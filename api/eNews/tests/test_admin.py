from django.urls import reverse
from api.tests.base import AdminTestCase
from ..models import Doc, DocType, Statut
from ..admin import StatutAdmin, DocAdmin


class StatutAdminTestCase(AdminTestCase):

    def setUp(self):
        super().setUp()
        self.pc = Statut.objects.create(statut_name="PC")
        self.zone = Statut.objects.create(statut_name="Zone Est")
        self.complex = Statut.objects.create(statut_name="PC Zone Est")
        self.complex.mix_statuts.set([self.pc, self.zone])
        self.sa = StatutAdmin(Statut, self.site)

    def test_statut_list_shows_mix_statuts(self):
        self.assertIn("get_mix_statuts", self.sa.get_changelist_instance(
            self.request).list_display)
        self.assertEqual(self.sa.get_mix_statuts(
            self.complex), "PC + Zone Est")


class DocAdminTestCase(AdminTestCase):

    def setUp(self):
        super().setUp()
        self.simple_doc = Doc.objects.create(
            year_ref=2021, number_ref=5, title="Le Titre",
            doctype=DocType.objects.get(short_name="CPG"),
            descriptive="Ceci est la description", obsolescence_date="2021-01-01")
        self.da = DocAdmin(Doc, self.site)

    # FIXME
    # def test_doc_list_shows_extra_archive_button(self):
    #     response = self.client.get(
    #         reverse('admin:eNews_doc_changelist'), follow=True)
    #     self.assertTemplateUsed(
    #         response, "eNews/admin_changelist_with_extra_button.html")
    #     self.assertIn(
    #         "trigger-archive/", [button['path'] for button in response.context['extra_buttons']])

    # def test_doc_extra_archive_button_triggers_task(self):
    #     response = self.client.post(
    #         reverse('admin:eNews_doc_changelist') + 'trigger-archive', follow=True)
    #     self.assertEqual(response.status_code, 200)
    #     # archive task has run et simple_doc is now archived
    #     self.simple_doc.refresh_from_db()
    #     self.assertTrue(self.simple_doc.archived)
