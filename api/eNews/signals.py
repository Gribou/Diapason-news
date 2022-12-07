from django.dispatch.dispatcher import receiver
from django.db.models import signals
import os

from .models import DocType, Doc

import logging
logger = logging.getLogger("django")


@receiver(signals.post_save, sender=DocType, dispatch_uid="update_references")
def update_references_on_doctype_update(sender, instance, **kwargs):
    # force update of all doc references for doc of this doctype
    for doc in Doc.objects.filter(doctype=instance).all():
        doc.save()


@receiver(signals.post_delete, sender=Doc, dispatch_uid="delete_doc")
def delete_file_on_doc_delete(sender, instance, **kwargs):
    ''' delete media file on doc delete'''
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)


@receiver(signals.pre_save, sender=Doc, dispatch_uid="update_doc")
def delete_old_file_on_doc_update(sender, instance, **kwargs):
    '''delete previous file if it is being updated'''
    if not instance.pk:
        return False
    try:
        old_file = sender.objects.get(pk=instance.pk).file
    except sender.DoesNotExist:
        return False

    new_file = instance.file
    if new_file != old_file:
        # clear search index if file changes
        instance.search_index = None

    if old_file and not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)

    # un-archive doc if a new file is provided
    if new_file:
        instance.archived = False


# @receiver(signals.post_save, sender=Doc, dispatch_uid="update_search_index")
# def update_doc_search_index(sender, instance, **kwargs):
#     if instance.file is not None and instance.search_index is None:
#         index_content.delay([instance.pk])
