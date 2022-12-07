from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from django.forms import ModelForm, ModelMultipleChoiceField
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.utils.safestring import mark_safe
from django.urls import reverse_lazy

from eNews.models import UserProfile
from ..models import User, GroupProxy, SSOConfig, SSOUserProfile
from ..tasks import refresh_keycloak


def refresh_realm(modeladmin, request, queryset):
    result = refresh_keycloak.delay()
    modeladmin.message_user(
        request,
        mark_safe("<a href='{}'>Tâche {} ajoutée à la file</a> ({})".format(
            reverse_lazy('admin:django_celery_results_taskresult_changelist'), result.task_id, result.status))
    )


refresh_realm.short_description = "Actualiser la configuration Keycloak"


class SSOConfigAdmin(admin.ModelAdmin):
    model = SSOConfig
    fields = ['well_known_oidc', 'public_key']
    readonly_fields = ['well_known_oidc', 'public_key']
    actions = [refresh_realm]

    def has_add_permission(self, request):
        # set add permission to False, if object already exists
        if SSOConfig.objects.exists():
            return False
        return super().has_add_permission(request)


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    max = 1
    extra = 1

    def has_delete_permission(self, request, obj):
        return False


class SSOProfileInline(admin.StackedInline):
    model = SSOUserProfile
    readonly_fields = ['sub', 'access_token', 'expires_before',
                       'refresh_token', 'refresh_expires_before']


class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline, SSOProfileInline)
    list_display = ['username', 'email', 'is_sso',
                    'is_editor', 'reminder_recipient', 'last_login']
    ordering = ('-user_profile__can_edit_doc', '-date_joined',)
    search_fields = ['username', 'email']

    def is_editor(self, obj):
        return obj.is_editor
    is_editor.boolean = True
    is_editor.short_description = "Editeur"

    def reminder_recipient(self, obj):
        try:
            return obj.user_profile.reminder_recipient
        except:
            return False
    reminder_recipient.boolean = True

    def is_sso(self, obj):
        try:
            return obj.sso_profile.sub is not None
        except:
            return False
    is_sso.boolean = True
    is_sso.short_description = "SSO"


class GroupAdminForm(ModelForm):
    # edit user set from group admin
    class Meta:
        model = GroupProxy
        exclude = []

    # Add the users field.
    users = ModelMultipleChoiceField(
        queryset=get_user_model().objects.all(),
        required=False,
        # Use the pretty 'filter_horizontal widget'.
        widget=FilteredSelectMultiple('users', False)
    )

    def __init__(self, *args, **kwargs):
        # Do the normal form initialisation.
        super(GroupAdminForm, self).__init__(*args, **kwargs)
        # If it is an existing group (saved objects have a pk).
        if self.instance.pk:
            # Populate the users field with the current Group users.
            self.fields['users'].initial = self.instance.user_set.all()

    def save_m2m(self):
        # Add the users to the Group.
        self.instance.user_set.set(self.cleaned_data['users'])

    def save(self, *args, **kwargs):
        # Default save
        instance = super(GroupAdminForm, self).save()
        # Save many-to-many data
        self.save_m2m()
        return instance


class CustomGroupAdmin(GroupAdmin):
    form = GroupAdminForm


admin.site.register(SSOConfig, SSOConfigAdmin)
admin.site.register(User, CustomUserAdmin)
admin.site.unregister(Group)
admin.site.register(GroupProxy, CustomGroupAdmin)
admin.site.unregister(Site)
admin.site.login_template = "users/login.html"
