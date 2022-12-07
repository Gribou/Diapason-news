from django.test import TestCase
from django.core.management import call_command

from ..models import Doc, DocType
from ..tasks import archive


class ArchiveTaskTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('populate_lfff', quiet=True)

    def setUp(self):
        self.to_be_archived = Doc.objects.create(
            year_ref=2021, number_ref=5, title="Le Titre",
            doctype=DocType.objects.get(short_name="CPG"),
            descriptive="Ceci est la description", obsolescence_date="2021-01-01")
        self.to_be_deleted = Doc.objects.create(year_ref=2020, number_ref=3, title="Titre Titre", doctype=DocType.objects.get(
            short_name="NI"), obsolescence_date="2021-10-01", delete_on_archive=True)
        self.to_keep = Doc.objects.create(
            year_ref=2020, number_ref=12, doctype=DocType.objects.get(
                short_name="CTO"), title="Title", obsolescence_date="2044-01-01")
        archive.delay()

    def test_archive_task_keeps_non_obsolete_doc(self):
        self.to_keep.refresh_from_db()
        self.assertFalse(self.to_keep.archived)

    def test_archive_task_archives_obsolete_doc(self):
        self.to_be_archived.refresh_from_db()
        self.assertTrue(self.to_be_archived.archived)

    def test_archive_task_deletes_obsolete_doc(self):
        self.assertFalse(Doc.objects.filter(pk=self.to_be_deleted.pk).exists())

    