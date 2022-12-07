from django.core.management.base import BaseCommand
from constance import config

from eNews.models import DocType
from nav.models import NavItem
from users.models import SSOConfig

DOCTYPES = [
    ('NI', "Note d'Information"),
    ('CV', "Convocation"),
    ('CR', "Compte-Rendu"),
    ('NS', "Note de Service"),
    ('CPE', "Consigne Permanente Est"),
    ('CPO', "Consigne Permanente Ouest"),
    ('CPG', "Consigne Permanente Générale"),
    ('CTE', "Consigne Temporaire Est"),
    ('CTO', "Consigne Temporaire Ouest"),
    ('CTG', "Consigne Temporaire Générale"),
    ('CX', "Consigne Exceptionnelle")
]

MENU = [
    {'title': "Général", 'icon': "AlphaGboxOutline",
     'query': '?doctype=CPG,CTG&in_effect=true&to_come=true'},
    {'title': "Zone Est", 'icon': "AlphaEboxOutline",
     'query': '?doctype=CPE,CTE,CPG,CTG&in_effect=true&to_come=true'},
    {'title': "Zone Ouest", 'icon': "AlphaOboxOutline",
     'query': '?doctype=CPO,CTO,CPG,CTG&in_effect=true&to_come=true'},
    {'title': "Information", 'icon': "AlphaIboxOutline",
     'query': '?doctype=NI,NS&in_effect=true&to_come=true'},
    {'title': "Autres", 'icon': "PoundBoxOutline",
     'query': '?doctype=-CPG,CTG,CPE,CTE,CPO,CTO,NI,NS&in_effect=true&to_come=true'},
]


class Command(BaseCommand):

    help = "Configure la base de données pour LFFF"

    def add_arguments(self, parser):
        parser.add_argument(
            '-q', '--quiet', action='store_true', help='No verbosity')

    def handle(self, *args, **options):
        quiet = options.get("quiet", False)
        self.create_doctypes(quiet)
        self.create_nav_menu(quiet)
        self.create_sso()

    def create_doctypes(self, quiet):
        if not DocType.objects.exists():
            for doctype in DOCTYPES:
                obj, created = DocType.objects.get_or_create(
                    full_name=doctype[1],
                    short_name=doctype[0]
                )
                if created and not quiet:
                    print("L'objet {} ({}) a été créé.".format(
                        doctype[0], doctype[1]))

    def create_nav_menu(self, quiet):
        if not NavItem.objects.exists():
            for i, m in enumerate(MENU):
                obj, created = NavItem.objects.get_or_create(
                    rank=i, defaults=m)
                if created and not quiet:
                    print("L'élément de menu {} a été créé".format(m['title']))

    def create_sso(self):
        if config.KEYCLOAK_ENABLED:
            if not SSOConfig.objects.exists():
                SSOConfig.objects.create()
