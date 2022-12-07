from django.db import models

'''
When using many to many fields, SQL queries tend to proliferate when
iterating through a queryset
(because a new query is sent to m2m table for each item).
This can be prevented by prefetching children before iterating
'''


class RefPrefetchingDocManager(models.Manager):
    '''doctype.shortname is used in doc __str__'''

    def get_queryset(self):
        return super().get_queryset()\
            .select_related('doctype', 'theme', 'redacteur')\



class UpdatePrefecthingDocManager(RefPrefetchingDocManager):

    def get_queryset(self):
        return super().get_queryset()\
            .prefetch_related('update_by', 'destinataires__mix_statuts')


class UserPrefetchingDocManager(RefPrefetchingDocManager):
    '''to be used when user data is needed for each doc
    (dest, read/unread, favorite)'''

    def get_queryset(self):
        return super().get_queryset()\
            .prefetch_related('who_read_it', 'favorite_for')
        # 'destinataires__mix_statuts'

