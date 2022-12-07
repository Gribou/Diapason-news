# -*- coding: utf-8 -*-
from celery import shared_task
from django.apps import apps
from datetime import datetime


# DO NOT import app models directly in tasks files (circular dependency)


def _get_doc_model():
    return apps.get_model(app_label="eNews", model_name="Doc")


@shared_task
def archive():
    output = ""
    # Delete all Docs past their obsolescence date and delete_on_archive = True
    to_delete = _get_doc_model().objects.filter(
        obsolescence_date__lte=datetime.now(), delete_on_archive=True)
    if to_delete.exists():
        output += "Ces documents vont être supprimés définitivement : {}. ".format(
            ', '.join([str(d)for d in to_delete.all()]))
        to_delete.delete()

    # Archive all Docs past their obsolescence date
    to_archive = _get_doc_model().objects.filter(
        obsolescence_date__lte=datetime.now(), delete_on_archive=False, archived=False)
    if to_archive.exists():
        output += "Ces documents vont être archivés : {}. ".format(
            ', '.join([str(d) for d in to_archive.all()]))
        to_archive.update(archived=True, file=None)
    # Le media est supprimé automatiquement par le signal pre-save

    output += 'Archivage terminé.'
    return output
