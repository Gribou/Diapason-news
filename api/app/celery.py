import os
from django.conf import settings
from celery import Celery
from celery.schedules import crontab
from celery.signals import task_failure

from api.email import mail_admins

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

app = Celery("app")
app.config_from_object('django.conf:settings', namespace="CELERY")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@task_failure.connect
def notify_admin_on_task_failure(**kwargs):
    if not settings.DEBUG:
        subject = "ERREUR : Tâche {sender.name} ({task_id}): {exception}".format(
            **kwargs)
        message = "Task {sender.name} with id {task_id} raised exception : {exception!r}\nTask was called with args: {args} kwargs: {kwargs}.The contents of the full traceback was:\n{einfo}".format(
            **kwargs)
        mail_admins(subject, message)


app.conf.beat_schedule = {
    'archive': {
        "task": "eNews.tasks.archive",
        "schedule": crontab(minute=0, hour=0, day_of_month=7)
    }
}
