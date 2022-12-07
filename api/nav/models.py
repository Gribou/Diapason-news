from django.db import models
from string import ascii_uppercase

from eNews.models import DocType, Statut

# See https://materialdesignicons.com/ for icons preview


ICON_CHOICES = ['Alpha{}boxOutline'.format(c) for c in ascii_uppercase]
ICON_CHOICES += ['Numeric{}BoxOutline'.format(i) for i in range(0, 10)]
ICON_CHOICES += ['PlusBoxOutline', 'PoundBoxOutline', 'StarBoxOutline',
                 'HeartBoxOutline', 'MinusBoxOutline', 'MusicBoxOutline',
                 'CircleBoxOutline', 'CloseBoxOutline', 'ChartBoxOutline',
                 'AlertBoxOutline', 'AccountBoxOutline', 'CheckBoxOutline']
ICON_CHOICES = [(a, a) for a in sorted(ICON_CHOICES)]


class NavItem(models.Model):

    title = models.CharField("Titre", max_length=25)
    icon = models.CharField("Icon", max_length=100,
                            choices=ICON_CHOICES, null=True, blank=True,
                            help_text="<a href='https://materialdesignicons.com/'>Aperçu des icônes</a>")
    rank = models.PositiveIntegerField("Rang", default=0)
    query = models.CharField("Recherche", max_length=250,
                             help_text="Sous la forme '?keyword=value&other_keyword=other_value'<br/>Voir l'URL de eNews quand on choisit des filtres personnalisés")

    class Meta:
        verbose_name = "Recherche enregistrée"
        verbose_name_plural = "Recherches enregistrées"
        ordering = ["rank", 'title']


class DoctypeFilter(models.Model):

    label = models.CharField("Intitulé", max_length=25)
    icon = models.CharField("Icon", max_length=100,
                            choices=ICON_CHOICES, null=True, blank=True,
                            help_text="<a href='https://materialdesignicons.com/'>Aperçu des icônes</a>")
    rank = models.PositiveIntegerField("Rang", default=0)
    doctypes = models.ManyToManyField(
        DocType, verbose_name="Types de documents à afficher")

    class Meta:
        verbose_name = "Filtre Type de document"
        verbose_name_plural = "Filtres Type de document"
        ordering = ["rank", 'label']

    @property
    def value(self):
        return ','.join([f.short_name for f in self.doctypes.all()])


class DestinataireFilter(models.Model):
    label = models.CharField("Intitulé", max_length=25)
    icon = models.CharField("Icon", max_length=100,
                            choices=ICON_CHOICES, null=True, blank=True,
                            help_text="<a href='https://materialdesignicons.com/'>Aperçu des icônes</a>")
    rank = models.PositiveIntegerField("Rang", default=0)
    destinataires = models.ManyToManyField(
        Statut, verbose_name="Destinataires à afficher")

    class Meta:
        verbose_name = "Filtre Destinataires"
        verbose_name_plural = "Filtres Destinataires"
        ordering = ["rank", 'label']

    @property
    def value(self):
        return ','.join([f.statut_name for f in self.destinataires.all()])
