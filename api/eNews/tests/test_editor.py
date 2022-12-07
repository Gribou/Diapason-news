from random import randint, choice, randrange
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.storage import default_storage
from datetime import timedelta
from rest_framework.test import force_authenticate
from rest_framework import status
from constance.test import override_config
import lorem
import io

from api.tests.base import *
from ..models import DocType, Doc
from ..views import EditorDocViewSet


def generate_random_datetime():
    return timezone.now() - timedelta(days=randrange(-30, 10))


def generate_uploaded_pdf(title="doc.pdf"):
    return SimpleUploadedFile(title, lorem.text().encode(), content_type="application/pdf")


def generate_file(title="doc.pdf"):
    file = io.BytesIO()
    file.name = title
    content = lorem.text()
    file.write(content.encode())
    file.seek(0)
    return file


def random_doc_args():
    return {
        'year_ref': 2000 + randint(0, 22),
        'doctype': choice(list(DocType.objects.all())),
        'number_ref': randint(0, 999),
        'begin_date': generate_random_datetime(),
        'title': lorem.text(),
        'file': generate_uploaded_pdf()
    }


def create_doc(data={}):
    complete_data = random_doc_args()
    complete_data.update(data)
    return Doc.objects.create(**complete_data)


def generate_doc_body(data={}):
    complete_body = {
        'year_ref': 2000 + randint(0, 22),
        'doctype': choice(list(DocType.objects.all())).short_name,
        'number_ref': randint(0, 999),
        'begin_date': generate_random_datetime().strftime("%Y-%m-%d"),
        'title': lorem.text(),
        'file': generate_file()
    }
    complete_body.update(data)
    return complete_body


@override_config(INTERNAL_HOSTNAMES="*")
class EditorApiTestCase(ApiTestCase):

    def test_create_doc_with_api(self):
        body = generate_doc_body({})
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(Doc.objects.filter(pk=response.data['pk']).exists())

    def test_update_doc_with_api(self):
        doc = create_doc()
        test_doctype = DocType.objects.create(
            short_name="TT", full_name="Test", archive_path="G:\Folder\Folder\${YEAR}")
        body = generate_doc_body(
            {'title': 'NEW NEW', 'doctype': test_doctype.short_name, "descriptive": ""})
        request = self.factory.put(
            "/api/doc-for-editors/{}/".format(doc.pk), body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view(
            {"put": "update"})(request, pk=doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        doc.refresh_from_db()
        self.assertEqual(doc.title, "NEW NEW")
        self.assertIsNone(doc.descriptive)

    def test_editor_permission(self):
        body = generate_doc_body({})
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.basic_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_client_error(response.status_code))

    def test_reference_updates_if_reference_format_changes(self):
        doctype = DocType.objects.create(
            short_name="TT", full_name="Test")
        doc = create_doc(
            {'doctype': doctype, 'year_ref': 2022, 'number_ref': 42})
        self.assertEqual(doc.reference, "22TT042")
        doctype.reference_format = "YYYYNNNN"
        doctype.save()
        doc.refresh_from_db()
        self.assertEqual(doc.reference, "20220042")

    def test_update_of(self):
        doc = create_doc()
        body = generate_doc_body({'update_of': doc.reference})
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        new_doc = Doc.objects.get(pk=response.data['pk'])
        self.assertEqual(new_doc.update_of.pk, doc.pk)
        doc.refresh_from_db()
        self.assertEqual(doc.update_by.first().pk, new_doc.pk)

    def test_update_of_with_wrong_reference(self):
        body = generate_doc_body({'update_of': "NOT_A_REF"})
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertIn('update_of', response.data)

    def test_upload_non_pdf_file(self):
        body = generate_doc_body({
            "file": generate_file(title="not-a-pdf.txt")
        })
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertIn('file', response.data)

    def test_doc_ref_is_unique(self):
        body = generate_doc_body({})
        request = self.factory.post(
            "/api/doc-for-editors/", body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_success(response.status_code))
        response = EditorDocViewSet.as_view({"post": "create"})(request)
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertIn('non_field_errors', response.data)

    def test_old_file_deleted(self):
        doc = create_doc()
        old_file = doc.file
        self.assertTrue(default_storage.exists(old_file.path))
        body = generate_doc_body()
        body.pop("file")
        request = self.factory.put(
            "/api/doc-for-editors/{}/".format(doc.pk), body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view(
            {"put": "update"})(request, pk=doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(default_storage.exists(old_file.path))

    def test_old_file_kept(self):
        doc = create_doc()
        old_file = doc.file
        self.assertTrue(default_storage.exists(old_file.path))
        body = generate_doc_body({"file_url": "/media/enews_doc/doc.pdf"})
        request = self.factory.put(
            "/api/doc-for-editors/{}/".format(doc.pk), body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view(
            {"put": "update"})(request, pk=doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        doc.refresh_from_db()
        new_file = doc.file
        self.assertTrue(default_storage.exists(new_file.path))

    def test_old_file_replaced(self):
        doc = create_doc()
        old_file = doc.file
        self.assertTrue(default_storage.exists(old_file.path))
        body = generate_doc_body({"file": generate_file(title="new.pdf")})
        request = self.factory.put(
            "/api/doc-for-editors/{}/".format(doc.pk), body, format="multipart")
        force_authenticate(request, user=self.editor_user)
        response = EditorDocViewSet.as_view(
            {"put": "update"})(request, pk=doc.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(default_storage.exists(old_file.path))
        doc.refresh_from_db()
        self.assertTrue(default_storage.exists(doc.file.path))
