from django.contrib import admin, messages
from django.urls import path, reverse_lazy
from django.utils.safestring import mark_safe
from django.http import HttpResponseRedirect
from django import forms

from . import models
from .tasks import archive


class StatutAdminForm(forms.ModelForm):
    exclude = []

    class Meta:
        model = models.Statut
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['mix_statuts'].queryset = models.Statut.objects.exclude(
            pk=self.instance.pk)


@admin.register(models.Statut)
class StatutAdmin(admin.ModelAdmin):
    model = models.Statut
    form = StatutAdminForm
    list_display = ('statut_name', 'get_mix_statuts')
    filter_horizontal = ('mix_statuts',)

    def get_mix_statuts(self, obj):
        return " + ".join([s.statut_name for s in obj.mix_statuts.all()])
    get_mix_statuts.short_description = "Statuts inclus"


@admin.register(models.DocType)
class DocTypeAdmin(admin.ModelAdmin):
    model = models.DocType
    list_display = ('short_name', 'full_name',
                    'reference_format', 'archive_path')


@admin.register(models.Theme)
class ThemeAdmin(admin.ModelAdmin):
    model = models.Theme
    list_display = ('short_name', 'full_name')


class ExtraButtonsMixin:
    change_list_template = "eNews/admin_changelist_with_extra_button.html"

    def get_extra_buttons(self):
        # should return action as { title, path, method }
        raise NotImplementedError

    def get_urls(self):
        urls = super().get_urls()
        extra_urls = [path(extra['path'], extra['method'])
                      for extra in self.get_extra_buttons()]
        return extra_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['extra_buttons'] = self.get_extra_buttons()
        return super().changelist_view(request, extra_context=extra_context)

    def trigger_task(self, request, task):
        result = task.delay()
        self.message_user(
            request,
            mark_safe("<a href='{}'>Tâche {} ajoutée à la file</a> ({})".format(
                reverse_lazy('admin:django_celery_results_taskresult_changelist'), result.task_id, result.status))
        )
        return HttpResponseRedirect("../")


@admin.register(models.Doc)
class DocAdmin(ExtraButtonsMixin, admin.ModelAdmin):
    model = models.Doc
    list_display = ('reference', 'title', 'publication_date', 'begin_date',
                    'end_date', 'obsolescence_date', 'archived')  # , 'is_indexed')
    ordering = ['-reference']
    exclude = ('who_read_it', 'favorite_for', 'search_index',
               'archived', 'included', 'reminder_sent', 'reference')
    search_fields = ('title', 'doctype__short_name', 'reference')
    filter_horizontal = ('destinataires', )

    def get_extra_buttons(self):
        return [{
            'title': 'Archiver',
            'path': 'trigger-archive/',
            'method': self.trigger_archive
        }]

    def trigger_archive(self, request):
        return self.trigger_task(request, archive)


try:
    from app.version import __version__
    admin.site.site_header = mark_safe("Diapason eNews Admin <span style='font-size:0.8125rem;'>({})</span>".format(
        __version__))
except:
    admin.site.site_header = "Diapason eNews Admin"
