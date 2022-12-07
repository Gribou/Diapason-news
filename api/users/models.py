from .keycloak import get_openid_client
import json
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, Group
from django.apps import apps
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AbstractUser, UserManager, Group, Permission


class PrefetchingUserManager(UserManager):
    '''
    DB query optimisation : statuts and profile are prefetched at the same
    time as user'''

    def get(self, *args, **kwargs):
        return super().prefetch_related('user_profile__mandatory_statuts', 'doc_favorite_for').get(
            *args, **kwargs)


class User(AbstractUser):
    objects = PrefetchingUserManager()
    simple_objects = UserManager()

    def __str__(self):
        return self.get_full_name() if self.get_full_name()\
            else self.get_username()

    @property
    def is_editor(self):
        return (hasattr(self, 'user_profile') and self.user_profile.can_edit_doc) or self.has_perm("eNews.change_doc")

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        db_table = 'auth_user'  # migrating from existing default User model
        # https://www.caktusgroup.com/blog/2019/04/26/how-switch-custom-django-user-model-mid-project/


class GroupProxy(Group):
    # force group to be registered in 'users' app in admin
    class Meta:
        proxy = True
        verbose_name = "Groupe"


def get_editors():
    Doc = apps.get_model(app_label="eNews", model_name="Doc")
    content_type = ContentType.objects.get_for_model(Doc)
    permission = Permission.objects.get(
        codename="change_doc", content_type=content_type)
    return User.simple_objects.filter(
        Q(user_profile__isnull=False, user_profile__can_edit_doc=True) | Q(groups__permissions=permission) | Q(user_permissions=permission)).exclude(username="admin").distinct()


class SSOConfig(models.Model):

    _well_known_oidc = models.TextField(blank=True)

    @property
    def well_known_oidc(self):
        return json.loads(self._well_known_oidc)

    @well_known_oidc.setter
    def well_known_oidc(self, content):
        self._well_known_oidc = json.dumps(content)

    def save(self, *args, **kwargs):
        if not self.pk and SSOConfig.objects.exists():
            raise ValidationError(
                'There is can be only one SSOConfig instance')
        return super().save(*args, **kwargs)

    public_key = models.TextField(blank=True)


def get_sso_config():
    return SSOConfig.objects.first()


class SSOUserProfile(models.Model):
    user = models.OneToOneField(User,
                                related_name='sso_profile',
                                on_delete=models.CASCADE)
    sub = models.CharField(max_length=255, unique=True)
    access_token = models.TextField(null=True)
    expires_before = models.DateTimeField(null=True)

    refresh_token = models.TextField(null=True)
    refresh_expires_before = models.DateTimeField(null=True)

    def logout(self):
        # Try to logout from keycloak server.
        # if fails, continue anyway
        try:
            get_openid_client().logout(self.refresh_token)
        except:
            pass
        self.access_token = None
        self.expires_before = None
        self.refresh_token = None
        self.refresh_expires_before = None
        self.save()

    def login(self, token_response, initiate_time):
        expires_before = initiate_time + timedelta(
            seconds=token_response['expires_in'])
        refresh_expires_before = initiate_time + timedelta(
            seconds=token_response['refresh_expires_in'])
        self.access_token = token_response['access_token']
        self.expires_before = expires_before
        self.refresh_token = token_response['refresh_token']
        self.refresh_expires_before = refresh_expires_before
        self.save()

    def refresh_access_token(self):
        if self.refresh_expires_before >= timezone.now():
            initiate_time = timezone.now()
            self.login(get_openid_client().refresh_token(self.refresh_token),
                       initiate_time)
        else:
            raise Exception("Refresh token has expired")

    def check_session(self):
        # check that the refresh token is still active = the user has not logout from another app
        return get_openid_client().introspect(self.refresh_token).get('active', False)
