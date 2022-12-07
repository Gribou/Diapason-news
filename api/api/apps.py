from django.apps import AppConfig
from constance.apps import ConstanceConfig
from django_celery_beat.apps import BeatConfig
from django_celery_results.apps import CeleryResultConfig


class ApiConfig(AppConfig):
    name = 'api'


BeatConfig.verbose_name = "Tâches - Planification"
CeleryResultConfig.verbose_name = "Tâches - Résultats"
ConstanceConfig.verbose_name = "Paramètres"
# prevent unecessary migration :
ConstanceConfig.default_auto_field = 'django.db.models.AutoField'
