from rest_framework import status
from rest_framework.test import force_authenticate
from django.core.files.uploadedfile import SimpleUploadedFile
from constance.test import override_config
from django.utils import timezone
from datetime import timedelta


from api.tests.base import ApiTestCase
from ..views import DocForUserViewSet, DocViewSet
from ..models import DocType, Doc, Theme


class FilterDocTestCase(ApiTestCase):

    def setUp(self):
        super().setUp()
        rh = Theme.objects.create(short_name="RH")
        self.simple_doc = Doc.objects.create(
            year_ref=2021, number_ref=5, title="Le Titre",
            doctype=DocType.objects.get(short_name="CPG"),
            descriptive="Ceci est la description",
            file=SimpleUploadedFile("consigne.pdf", b'abc'))
        self.other_doc = Doc.objects.create(
            title="L'autre consigne", descriptive="tagada", doctype=DocType.objects.get(short_name="NI"), theme=rh, begin_date=timezone.now() + timedelta(days=1))
        self.obsolete = Doc.objects.create(
            title="Périmé", doctype=DocType.objects.get(
                short_name="NS"), begin_date=timezone.now() - timedelta(days=3), end_date=timezone.now() - timedelta(days=1))

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_title_filter(self):
        request = self.factory.get("/api/doc/?search=autre")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.other_doc.pk, response.data['results'][0]['pk'])

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_description_filter(self):
        request = self.factory.get("/api/doc/?search=tagada")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.other_doc.pk, response.data['results'][0]['pk'])

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_filter_founds_nothing(self):
        request = self.factory.get("/api/doc/?search=connais pas")
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 0)

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_reference_filter(self):
        request = self.factory.get("/api/doc/?reference=21CPG005")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.simple_doc.pk, response.data['results'][0]['pk'])

        request = self.factory.get("/api/doc/?reference=-21CPG005")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        self.assertNotIn(self.simple_doc.pk, [r['pk']
                         for r in response.data['results']])

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_doctype_filter(self):
        request = self.factory.get("/api/doc/?doctype=CPG")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.simple_doc.pk, response.data['results'][0]['pk'])

        request = self.factory.get("/api/doc/?doctype=-CPG")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        self.assertNotIn(self.simple_doc.pk, [
                         r['pk'] for r in response.data['results']])

        request = self.factory.get("/api/doc/?doctype=CPG,NI")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_theme_filter(self):
        request = self.factory.get("/api/doc/?theme=RH")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.other_doc.pk, response.data['results'][0]['pk'])

        request = self.factory.get("/api/doc/?theme=-RH")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        self.assertNotIn(self.other_doc.pk, [r['pk']
                         for r in response.data['results']])

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_validity_filter(self):
        request = self.factory.get("/api/doc/?in_effect=true")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.simple_doc.pk, response.data['results'][0]['pk'])

        request = self.factory.get("/api/doc/?to_come=true")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(self.other_doc.pk, response.data['results'][0]['pk'])

        request = self.factory.get("/api/doc/?to_come=true&in_effect=true")
        response = DocViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        self.assertNotIn(self.obsolete.pk, [r['pk']
                                            for r in response.data['results']])

    def test_unread_filter(self):
        self.simple_doc.set_as_read(self.basic_user)
        self.obsolete.set_as_read(self.basic_user)
        # show unread docs for user
        request = self.factory.get("/api/doc/?unread=true")
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        # show unread docs for another user
        self.assertIn(self.other_doc.pk, [r['pk']
                                          for r in response.data['results']])
        force_authenticate(request, user=self.editor_user)
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 3)
        # show read docs for user
        request = self.factory.get("/api/doc/?read=true")
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        pks = [r['pk']
               for r in response.data['results']]
        self.assertIn(self.simple_doc.pk, pks)
        self.assertTrue(self.obsolete.pk, pks)

    def test_favorite_filter(self):
        self.simple_doc.add_to_favorites(self.basic_user)
        # show unread docs for user
        request = self.factory.get("/api/doc/?favorite=true")
        force_authenticate(request, user=self.basic_user)
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 1)
        # show unread docs for another user
        self.assertIn(self.simple_doc.pk, [r['pk']
                                           for r in response.data['results']])
        force_authenticate(request, user=self.editor_user)
        response = DocForUserViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 0)

    def test_destinataires_filter(self):
        pass  # TODO
