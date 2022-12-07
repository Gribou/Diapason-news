from django.core.files.uploadedfile import SimpleUploadedFile
from constance.test import override_config
from rest_framework import status
from rest_framework.test import force_authenticate

from api.tests.base import ApiTestCase
from ..models import Doc, DocType
from ..views import DocForUserViewSet


class DocTestCase(ApiTestCase):

    def setUp(self):
        super().setUp()
        self.simple_doc = Doc.objects.create(
            year_ref=2021, number_ref=5, title="Le Titre",
            doctype=DocType.objects.get(short_name="CPG"),
            descriptive="Ceci est la description",
            file=SimpleUploadedFile("consigne.pdf", b'abc'))
        self.other_doc = Doc.objects.create(
            title="L'autre consigne", descriptive="tagada", doctype=DocType.objects.get(short_name="NI"))


class SafetyDocTestCase(DocTestCase):

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_get_list_on_safe_host(self):
        # anonymous user
        request = self.factory.get("/api/doc/")
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        simple_doc_in_result = next(
            doc for doc in response.data['results'] if doc['pk'] == self.simple_doc.pk)
        other_doc_in_result = next(
            doc for doc in response.data['results'] if doc['pk'] == self.other_doc.pk)
        self.assertIsNotNone(simple_doc_in_result)
        self.assertIsNotNone(other_doc_in_result)
        self.assertEqual(simple_doc_in_result['title'], "Le Titre")

    @override_config(INTERNAL_HOSTNAMES="")
    def test_get_list_on_unsafe_host(self):
        # 403 with anonymous user
        request = self.factory.get("/api/doc/")
        response = DocForUserViewSet.as_view({'get': 'list'})(request)
        self.assertTrue(status.is_client_error(response.status_code))
        # get paginated list with authenticated user
        request = self.factory.get("/api/doc/")
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view({'get': 'list'})(request)
        self.assertTrue(status.is_success(response.status_code))

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_read_doc_on_safe_host(self):
        request = self.factory.get("/api/doc/{}".format(self.simple_doc.pk))
        response = DocForUserViewSet.as_view(
            {"get": "retrieve"})(request, pk=self.simple_doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['reference'], "21CPG005")
        self.assertIn("file", response.data)


class ExtraActionsDocTestCase(DocTestCase):

    def test_mark_doc_as_read(self):
        self.assertFalse(self.simple_doc.user_has_read_doc(self.basic_user))
        request = self.factory.post(
            "/api/doc/{}/read/".format(self.simple_doc.pk), {'read': True})
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view(
            {'post': 'read'})(request, pk=self.simple_doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['is_read'])
        self.simple_doc.refresh_from_db()
        self.assertTrue(self.simple_doc.user_has_read_doc(self.basic_user))
        self.assertFalse(self.other_doc.user_has_read_doc(self.basic_user))

    def test_mark_doc_as_unread(self):
        self.simple_doc.set_as_read(self.basic_user)
        self.assertTrue(self.simple_doc.user_has_read_doc(self.basic_user))
        request = self.factory.post(
            "/api/doc/{}/read/".format(self.simple_doc.pk), {'read': False})
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view(
            {'post': 'read'})(request, pk=self.simple_doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(response.data['is_read'])
        self.simple_doc.refresh_from_db()
        self.assertFalse(self.simple_doc.user_has_read_doc(self.basic_user))

    def test_mark_page_as_read(self):
        self.assertFalse(self.simple_doc.user_has_read_doc(self.basic_user))
        self.assertFalse(self.other_doc.user_has_read_doc(self.basic_user))
        request = self.factory.post("/api/doc/page_read/",
                                    {'docs': [self.simple_doc.pk, self.other_doc.pk]})
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view({'post': 'page_read'})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(len(response.data), 2)
        self.assertTrue(response.data[0]['is_read'])
        self.assertTrue(response.data[1]['is_read'])
        self.simple_doc.refresh_from_db()
        self.other_doc.refresh_from_db()
        self.assertTrue(self.simple_doc.user_has_read_doc(self.basic_user))
        self.assertTrue(self.other_doc.user_has_read_doc(self.basic_user))

    def test_mark_doc_as_favorite(self):
        self.assertFalse(self.simple_doc.is_favorite_of(self.basic_user))
        request = self.factory.post(
            "/api/doc/{}/favorite/".format(self.simple_doc.pk), {'favorite': True})
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view(
            {'post': 'favorite'})(request, pk=self.simple_doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['is_favorite'])
        self.simple_doc.refresh_from_db()
        self.assertTrue(self.simple_doc.is_favorite_of(self.basic_user))

    def test_mark_doc_as_not_favorite(self):
        self.simple_doc.add_to_favorites(self.basic_user)
        self.assertTrue(self.simple_doc.is_favorite_of(self.basic_user))
        request = self.factory.post(
            "/api/doc/{}/favorite/".format(self.simple_doc.pk), {'favorite': False})
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view(
            {'post': 'favorite'})(request, pk=self.simple_doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(response.data['is_favorite'])
        self.simple_doc.refresh_from_db()
        self.assertFalse(self.simple_doc.user_has_read_doc(self.basic_user))

    # FIXME
    # def test_mark_doc_as_included(self):
    #     docview_factory = DocForUserViewSet.as_view(
    #         actions={'post': 'included'}, permission_classes=[IsEditorPermission])
    #     self.assertFalse(self.simple_doc.included)
    #     request = self.factory.post(
    #         "/api/doc/{}/included/".format(self.simple_doc.pk), {'included': True})
    #     # basic users are not allowed
    #     force_authenticate(request, user=self.basic_user)
    #     response = docview_factory(request, pk=self.simple_doc.pk)
    #     self.assertTrue(status.is_client_error(response.status_code))
    #     # editor users are allowed
    #     force_authenticate(request, user=self.editor_user)
    #     response = docview_factory(request, pk=self.simple_doc.pk)
    #     self.assertTrue(status.is_success(response.status_code))
    #     self.assertTrue(response.data['included'])
    #     self.simple_doc.refresh_from_db()
    #     self.assertTrue(self.simple_doc.included)

    # def test_mark_doc_as_not_included(self):
    #     docview_factory = DocForUserViewSet.as_view(
    #         actions={'post': 'included'}, permission_classes=[IsEditorPermission])
    #     self.simple_doc.included = True
    #     self.simple_doc.save()
    #     request = self.factory.post(
    #         "/api/doc/{}/included/".format(self.simple_doc.pk), {'included': False})
    #     force_authenticate(request, user=self.editor_user)
    #     response = docview_factory(request, pk=self.simple_doc.pk)
    #     self.assertTrue(status.is_success(response.status_code))
    #     self.assertFalse(response.data['included'])
    #     self.simple_doc.refresh_from_db()
    #     self.assertFalse(self.simple_doc.included)
