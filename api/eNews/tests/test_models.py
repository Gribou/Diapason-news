import datetime
import os
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from eNews import models


class Doc_TestCase(TestCase):

    @classmethod  # <- setUpClass doit être une méthode de classe, attention !
    def setUpTestData(cls):

        # ---------------------------------------------------------
        # STATUTS
        cls.statut_pc = models.Statut(statut_name="PC")
        cls.statut_pc.save()
        # ---------------
        cls.statut_cds = models.Statut(statut_name="CDS")
        cls.statut_cds.save()
        # ---------------
        cls.statut_zone_ouest = models.Statut(statut_name="Zone Ouest")
        cls.statut_zone_ouest.save()
        # ---------------
        cls.statut_zone_est = models.Statut(statut_name="Zone Est")
        cls.statut_zone_est.save()
        # ---------------
        cls.statut_cds_ouest = models.Statut(statut_name="CDS Zone Ouest")
        cls.statut_cds_ouest.save()
        cls.statut_cds_ouest.mix_statuts.set(
            [cls.statut_cds, cls.statut_zone_ouest])
        cls.statut_cds_ouest.save()
        # ---------------
        cls.statut_pc_est = models.Statut(statut_name="PC Zone Est")
        cls.statut_pc_est.save()
        cls.statut_pc_est.mix_statuts.set([cls.statut_pc, cls.statut_zone_est])
        cls.statut_pc_est.save()

        # ---------------------------------------------------------
        # USER et USERPROFILE
        cls.pc_est = get_user_model()(username='PC de la zone Est')
        cls.pc_est.save()
        cls.profile1 = models.UserProfile.objects.create(user=cls.pc_est)
        cls.profile1.mandatory_statuts.set(
            [cls.statut_pc, cls.statut_zone_est])
        cls.profile1.save()
        # ---------------
        cls.pc_cds_ouest = get_user_model()(
            username='CDS de la zone Ouest (aussi PC)')
        cls.pc_cds_ouest.save()
        cls.profile2 = models.UserProfile.objects.create(user=cls.pc_cds_ouest)
        cls.profile2.mandatory_statuts.set(
            [cls.statut_pc, cls.statut_cds, cls.statut_zone_ouest])
        cls.profile2.save()
        # ---------------
        cls.pc_ouest = get_user_model()(username='PC de la zone Ouest')
        cls.pc_ouest.save()
        cls.profile1 = models.UserProfile.objects.create(user=cls.pc_ouest)
        cls.profile1.mandatory_statuts.set(
            [cls.statut_pc, cls.statut_zone_ouest])
        cls.profile1.save()

        # ---------------------------------------------------------
        # DOCOPS

        # ---------------
        # Pour CDS Ouest, à venir
        cls.doc_cds_ouest = models.Doc(
            begin_date=datetime.date.today() + datetime.timedelta(days=10),
            title="", descriptive=""
        )
        cls.doc_cds_ouest.save()
        cls.doc_cds_ouest.destinataires.set([cls.statut_cds_ouest])
        cls.doc_cds_ouest.save()
        # ---------------
        # Pour PC Est, périmée, remplacée par et en remplacement de
        cls.doc_pc_est = models.Doc(
            begin_date=datetime.date.today() - datetime.timedelta(days=10),
            end_date=datetime.date.today() - datetime.timedelta(days=1),
            title="", descriptive=""
        )
        cls.doc_pc_est.save()
        cls.doc_pc_est.destinataires.set([cls.statut_pc_est])
        cls.doc_pc_est.update_of = cls.doc_cds_ouest
        cls.doc_pc_est.save()

    def setUp(self):
        self.doctype = models.DocType.objects.create(
            full_name="Note de service", short_name="NS")
        # Pour PC, en vigueur
        self.doc_pc = models.Doc(
            begin_date=datetime.date.today() - datetime.timedelta(days=10),
            title="", descriptive="", year_ref=2021, number_ref=22,
            doctype=self.doctype,
            file=SimpleUploadedFile("consigne.pdf", b'abc')
        )
        self.doc_pc.save()
        self.doc_pc.destinataires.set([self.statut_pc])
        self.doc_pc.save()

    def test_readUnreadDoc(self):
        # testés : user_has_read_doc | set_as_read | set_as_unread
        self.assertFalse(self.pc_est in self.doc_pc.who_read_it.all())
        self.assertFalse(self.doc_pc.user_has_read_doc(self.pc_est))
        # ---------------
        self.doc_pc.set_as_read(self.pc_est)
        self.assertTrue(self.pc_est in self.doc_pc.who_read_it.all())
        self.assertTrue(self.doc_pc.user_has_read_doc(self.pc_est))
        # ---------------
        self.doc_pc.set_as_unread(self.pc_est)
        self.assertFalse(self.pc_est in self.doc_pc.who_read_it.all())
        self.assertFalse(self.doc_pc.user_has_read_doc(self.pc_est))

    def test_favoritesDoc(self):
        # testés : is_favorite_of | add_to_favorites | remove_from_favorites
        self.assertFalse(self.pc_est in self.doc_pc.favorite_for.all())
        self.assertFalse(self.doc_pc.is_favorite_of(self.pc_est))
        # ---------------
        self.doc_pc.add_to_favorites(self.pc_est)
        self.assertTrue(self.pc_est in self.doc_pc.favorite_for.all())
        self.assertTrue(self.doc_pc.is_favorite_of(self.pc_est))
        # ---------------
        self.doc_pc.remove_from_favorites(self.pc_est)
        self.assertFalse(self.pc_est in self.doc_pc.favorite_for.all())
        self.assertFalse(self.doc_pc.is_favorite_of(self.pc_est))

    def test_is_dest(self):
        # testé : is_dest
        # --------------- doc_pc testé pour chaque utilisateur
        self.assertTrue(self.doc_pc.is_dest(self.pc_est))
        self.assertTrue(self.doc_pc.is_dest(self.pc_cds_ouest))
        self.assertTrue(self.doc_pc.is_dest(self.pc_ouest))
        # --------------- doc_cds_ouest testé pour chaque utilisateur
        self.assertFalse(self.doc_cds_ouest.is_dest(self.pc_est))
        self.assertTrue(self.doc_cds_ouest.is_dest(self.pc_cds_ouest))
        self.assertFalse(self.doc_cds_ouest.is_dest(self.pc_ouest))
        # --------------- doc_pc_est testé pour chaque utilisateur
        self.assertTrue(self.doc_pc_est.is_dest(self.pc_est))
        self.assertFalse(self.doc_pc_est.is_dest(self.pc_cds_ouest))
        self.assertFalse(self.doc_pc_est.is_dest(self.pc_ouest))

    def test_is_to_come(self):
        # testé : is_to_come
        self.assertFalse(self.doc_pc.is_to_come())
        self.assertTrue(self.doc_cds_ouest.is_to_come())
        self.assertFalse(self.doc_pc_est.is_to_come())

    def test_is_in_effect(self):
        # testé : is_in_effect
        self.assertTrue(self.doc_pc.is_in_effect())
        self.assertFalse(self.doc_cds_ouest.is_in_effect())
        self.assertFalse(self.doc_pc_est.is_in_effect())

    def test_is_out_of_date(self):
        # testé : is_out_of_date
        self.assertFalse(self.doc_pc.is_out_of_date())
        self.assertFalse(self.doc_cds_ouest.is_out_of_date())
        self.assertTrue(self.doc_pc_est.is_out_of_date())

    def test_has_been_replaced(self):
        # testé : has_been_replaced
        self.assertFalse(self.doc_pc.has_been_replaced())
        self.assertTrue(self.doc_cds_ouest.has_been_replaced())

    def test_is_an_update(self):
        # testé : is_an_update()
        self.assertFalse(self.doc_pc.is_an_update())
        self.assertTrue(self.doc_pc_est.is_an_update())

    def test_reference(self):
        self.assertEqual(self.doc_pc.reference, "21NS022")

    # delete file on doc delete
        # delete old file on doc update
    def test_delete_file_on_doc_delete(self):
        file_path = self.doc_pc.file.path
        self.assertTrue(os.path.isfile(file_path))
        self.doc_pc.delete()
        self.assertFalse(os.path.isfile(file_path))

    def test_update_file_on_doc_update(self):
        # file is updated on doc update
        old_file_path = self.doc_pc.file.path
        self.doc_pc.file = SimpleUploadedFile("new_file.pdf", b'cde')
        self.doc_pc.save()
        new_file_path = self.doc_pc.file.path
        self.assertFalse(os.path.isfile(old_file_path))
        self.assertTrue(os.path.isfile(new_file_path))
        # file is deleted on file update
        self.doc_pc.file = None
        self.doc_pc.save()
        self.assertFalse(os.path.isfile(new_file_path))
