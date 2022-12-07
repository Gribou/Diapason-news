from datetime import date
from django.contrib.auth import get_user_model
from django.db import models
from datetime import datetime, timedelta, date
from django.core.validators import FileExtensionValidator


from . import model_managers


def current_year():
    return date.today().year


class Statut(models.Model):
    """
    Définit un statut particulier pour le centre.
    Un statut peut également être un ensemble de statuts, liés par une
    condition logique 'et'.
    """

    class Meta:
        verbose_name = 'Statut'
        verbose_name_plural = 'Statuts'
        ordering = ["statut_name"]

    def __str__(self):
        return self.statut_name

    statut_name = models.CharField("Nom du statut", max_length=50, unique=True)
    mix_statuts = models.ManyToManyField(
        'Statut', verbose_name='Statuts associés', related_name='parent_statuts', default=None, blank=True)


class Theme(models.Model):
    full_name = models.CharField(
        "Nom complet", max_length=100, default="", null=True)
    short_name = models.CharField(
        "Abréviation", max_length=15, default="", null=True, unique=True)

    class Meta:
        verbose_name = "Thème"
        verbose_name_plural = "Thèmes"
        ordering = ["short_name"]

    def __str__(self):
        return self.short_name


class UserProfile(models.Model):

    class Meta:
        verbose_name = 'Profil utilisateur eNews'
        verbose_name_plural = 'Profils utilisateurs eNews'

    def __str__(self):
        return "Profil de {}".format(self.user)

    user = models.OneToOneField(
        get_user_model(), verbose_name='Utilisateur associé',
        on_delete=models.CASCADE, related_name='user_profile', default=None)

    can_edit_doc = models.BooleanField(
        "Peut créer/màj/supprimer", default=False)  # TODO migrate this to permission

    reminder_recipient = models.BooleanField(
        "Reçoit les emails de rappels", default=False)  # TODO migrate this to permission

    mandatory_statuts = models.ManyToManyField(
        Statut, verbose_name='Statuts associés obligatoires',
        related_name='mandatory_statuts_profile', default=None, blank=True,
        limit_choices_to={'mix_statuts': None})


class DocType(models.Model):

    class Meta:
        verbose_name = 'type de documentation'
        verbose_name_plural = 'types de documentation'
        ordering = ["short_name"]

    full_name = models.CharField(
        "Nom complet", max_length=100, default="", null=True)
    short_name = models.CharField(
        "Abréviation", max_length=15, default="", null=True, unique=True)
    reference_format = models.CharField(
        "Format utilisé pour les références du documents", default="YYTNNN", max_length=25, help_text="'YYYY' : année sur 4 charactères<br/>'YY' : les 2 derniers chiffres de l'année (2021 -> 21)<br/>'T' : Abbréviation du type de document (2, 3 caractères : NI, CPG, ...)<br/>'NNN' : index du document codé sur autant de caractères (NNN : 001, NNNN: 0001)<br/>Les autres caractères sont autorisés et seront intégrés tels quels dans la référence du document (ex : tirets, slash, autres lettres...")
    archive_path = models.CharField(
        "Chemin vers l'archivage long durée", max_length=250, null=True, blank=True, help_text="Utilisez le mot-clé ${YEAR} qui sera remplacé par l'année de publication du document")

    def __str__(self):
        return self.short_name

    def simple_reference_format(self):
        # remove duplicate special characters but keep the order
        # also keep other characters like underscore, dash, etc
        result = []
        special_chars = ['Y', 'T', 'N']
        for char in self.reference_format:
            if char not in special_chars or char not in result:
                result.append(char)
        return "".join(result)


OBSOLETE_DELAY_IN_YEARS = 3


def get_default_obsolescence_date():
    return (datetime.now() + timedelta(days=OBSOLETE_DELAY_IN_YEARS * 365)).date()


def make_reference(year_ref, doctype, number_ref):
    """ Renvoie la référence du document selon le format défini pour ce type """
    try:
        format = doctype.reference_format
        # format the year with the correct number of characters
        year_length = format.count('Y')
        formatted_year = str(abs(year_ref) %
                             10**year_length).zfill(year_length)
        # format the index with the correct number of characters
        formatted_number = str(number_ref).zfill(format.count("N"))
        # build the complete reference from the format
        format = doctype.simple_reference_format()
        # keep replacement in that order (Y - N - T) so that doctype containing N is not replaced by error.
        return format.replace("Y", formatted_year).replace("N", formatted_number).replace("T", doctype.short_name)
    except Exception as e:
        print(e)
        return "Erreur de ref"


class Doc(models.Model):
    simple_objects = model_managers.RefPrefetchingDocManager()
    objects = model_managers.UpdatePrefecthingDocManager()
    objects_for_user = model_managers.UserPrefetchingDocManager()

    class Meta:
        verbose_name = 'doc'
        verbose_name_plural = 'docs'
        ordering = ['-publication_date', 'reference']
        indexes = [
            models.Index(fields=['year_ref', 'doctype', 'number_ref']),
            models.Index(fields=['-publication_date'])
        ]

    def __str__(self):
        return "{} - {}".format(self.reference, self.title)

    # --------------------------------------------------------------------
    year_ref = models.PositiveIntegerField(
        'Année de rédaction du document', default=current_year)
    doctype = models.ForeignKey(
        DocType, verbose_name='Type de document',
        related_name='of_doctype', on_delete=models.SET_NULL, null=True)
    number_ref = models.PositiveIntegerField('Numéro du document', default=999)
    reference = models.CharField("Référence", max_length=25, null=True)

    # --------------------------------------------------------------------
    update_of = models.ForeignKey(
        'Doc', verbose_name='Référence du document remplacé par cette doc',
        related_name='update_by', on_delete=models.SET_NULL, default=None,
        blank=True, null=True)

    # --------------------------------------------------------------------
    begin_date = models.DateField(
        'Date de début de validité', default=date.today)
    end_date = models.DateField(
        'Date de fin de validité', default=None, blank=True, null=True)
    creation_date = models.DateField('Date de création', default=date.today)
    publication_date = models.DateField(
        'Date de publication', default=date.today)
    reminder_sent = models.BooleanField('Mail de rappel envoyé', default=False)
    included = models.BooleanField(
        'Inclus au MANEX', default=False, help_text='Cette publication a été intégré ailleurs (par ex dans le MANEX, ...)')
    archived = models.BooleanField(
        'Archivé', default=False,
        help_text="Le PDF est supprimé du serveur pour économiser de l'espace")
    obsolescence_date = models.DateField(
        'Date de fin de disponibilité eNews',
        help_text="Après cette date, le document peut être archivé.",
        default=get_default_obsolescence_date)
    delete_on_archive = models.BooleanField(
        'Supprimer complètement en fin de vie', default=False,
        help_text="Après la date de fin de disponibilité, le document sera supprimer complètement de la base de données.")

    # --------------------------------------------------------------------
    title = models.CharField('Titre du document', max_length=250, default=None)
    descriptive = models.TextField(
        'Description du contenu du document', default=None, blank=True, null=True)
    file = models.FileField('Doc (au format PDF)', blank=True, null=True,
                            max_length=251, upload_to='enews_docs/%Y/%m/',
                            validators=[FileExtensionValidator(allowed_extensions=['pdf'])])
    search_index = models.TextField(blank=True, null=True)
    keywords = models.CharField(
        "Mots-clés", max_length=250, null=True, blank=True,
        help_text="Sont indexés par le moteur de recherche")
    theme = models.ForeignKey(
        Theme, related_name="docs", on_delete=models.SET_NULL, null=True, blank=True)

    # --------------------------------------------------------------------
    # un seul rédacteur | un ou plusieurs vérificateurs | un seul approbateur
    redacteur = models.ForeignKey(
        get_user_model(), verbose_name='Rédacteur',
        related_name='Doc_redacteur', on_delete=models.SET_NULL, default=None,
        null=True, blank=True)
    verificateurs = models.ManyToManyField(
        get_user_model(), verbose_name='Vérificateurs',
        related_name='Doc_verificateurs', default=None, blank=True)
    approbateur = models.ForeignKey(
        get_user_model(), verbose_name='Approbateur',
        related_name='Doc_approbateur', on_delete=models.SET_NULL,
        default=None, null=True, blank=True)

    # --------------------------------------------------------------------
    # destinataires | users ayant lu le document | users ayant le document en
    # favoris
    destinataires = models.ManyToManyField(
        Statut, verbose_name='Destinataires',
        related_name='doc_destinataires', default=None, blank=True)
    who_read_it = models.ManyToManyField(
        get_user_model(),
        verbose_name='Liste des utilisateurs ayant lu la Doc Ops',
        related_name='doc_who_read_it',
        default=None, blank=True)
    favorite_for = models.ManyToManyField(
        get_user_model(),
        verbose_name='Liste des utilisateurs ayant ajouté cette Doc Ops '
        'à leurs favoris',
        related_name='doc_favorite_for',
        default=None, blank=True)

    def save(self, *args, **kwargs):
        # auto-update reference field with year/doctype/number_ref
        if self.doctype is not None:
            self.reference = make_reference(
                self.year_ref, self.doctype, self.number_ref)
        return super().save(*args, **kwargs)

    @property
    def archive_path(self):
        if self.doctype.archive_path is not None:
            return self.doctype.archive_path.replace("${YEAR}", str(self.year_ref))

    def is_to_come(self):
        """ Renvoie True si le document entre prochainement en vigueur. """
        return self.begin_date > date.today()

    @property
    def to_come(self):
        return self.is_to_come() and not self.included

    def is_in_effect(self):
        """ Renvoie True si la doc est en vigueur. """
        return self.begin_date <= date.today() and not self.is_out_of_date()

    @property
    def in_effect(self):
        return self.is_in_effect() and not self.has_been_replaced() and not self.included

    def is_out_of_date(self):
        """ Renvoie True si le document est périmée. """
        if self.end_date:
            return self.end_date < date.today()
        return False

    @property
    def out_of_date(self):
        return self.is_out_of_date() and not self.included

    def has_been_replaced(self):
        """
        Renvoie True si le document a été remplacée par une autre doc ops """
        if self.update_by.count() > 0:
            # The new doc must be in effect for this doc to be considered as replaced
            return self.update_by.order_by('begin_date')[0].begin_date <= date.today()
        return False

    @property
    def replaced(self):
        return self.has_been_replaced()

    def is_an_update(self):
        """
        Renvoie True si le document est la mise à jour d'une autre doc ops """
        if self.update_of:
            return True
        return False

    # read/unread
    def set_as_read(self, user):
        """ Ajoute user à la liste des utilisateurs ayant lu le document """
        self.who_read_it.add(user)

    def set_as_unread(self, user):
        """ Retire user de la liste des utilisateurs ayant lu le document """
        self.who_read_it.remove(user)

    def user_has_read_doc(self, user):
        """ Renvoie True si user a lu le document, false sinon """
        return user in self.who_read_it.all()

    # favorites
    def add_to_favorites(self, user):
        """
        Ajoute user à la liste des utilisateurs ayant le document pour favoris
        """
        self.favorite_for.add(user)

    def remove_from_favorites(self, user):
        """
        Retire user de la liste des utilisateurs ayant le document pour
        favoris """
        self.favorite_for.remove(user)

    def is_favorite_of(self, user):
        """ Renvoie True si user a ajouté ce document à ses favoris """
        return user in self.favorite_for.all()

    def is_dest(self, user):
        """ Return True si user est destinataire du document, False sinon. """
        try:
            user_statuts = user.user_profile.mandatory_statuts.all()
        except:
            user_statuts = []
        for statut in self.destinataires.iterator():
            # user has this statut or all of the mix_statuts of this statut
            if statut in user_statuts or all([s in user_statuts for s in statut.mix_statuts.all()]):
                return True
        # users should not be allowed to choose a complex statut. He/she must choose all relevant simple statuts instead
        return False


import eNews.signals  # noqa
