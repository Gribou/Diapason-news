from django.core.management.base import BaseCommand

from eNews.models import Doc
from eNews.tasks import index_content


class Command(BaseCommand):

    help = "Actualise l'indexation de tous les fichiers PDF"

    def handle(self, *args, **options):
        index_content.delay(
            list(Doc.simple_objects.values_list('pk', flat=True).all()))
