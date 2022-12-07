from rest_framework import status
from rest_framework.test import force_authenticate
from django.contrib.sessions.middleware import SessionMiddleware
from constance.test import override_config
from djoser.views import UserViewSet
from django.core.exceptions import ObjectDoesNotExist
import mock

from api.tests.base import *
from eNews.models import Statut
from users.models import SSOConfig
from users.keycloak import has_keycloak_config
from users.authentication import _update_or_create_user_from_sso
from .views import StandAloneLoginView, LogoutView, SessionView, CustomUserViewSet
from .admin import CustomUserAdmin


class AuthTest(ApiTestCase):

    def _session_authenticate(self, request):
        get_response = mock.MagicMock()
        middleware = SessionMiddleware(get_response)
        middleware.process_request(request)
        request.session.save()

    def test_get_user(self):
        ''' read user info with user API endpoint'''
        request = self.factory.get("/api/users/me/")
        force_authenticate(request, user=self.editor_user)
        response = UserViewSet.as_view(actions={'get': 'me'})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['can_edit_doc'])
        self.assertFalse(response.data['is_staff'])
        self.assertEqual(response.data['unread_count'], 0)

    def test_update_user(self):
        '''update user info'''
        self.assertFalse(hasattr(self.basic_user, 'user_profile'))
        statuts = ["Sub", "PC"]
        for statut in statuts:
            Statut.objects.create(statut_name=statut)
        request = self.factory.put("/api/users/me/", {
            'statuts': ['PC']
        })
        force_authenticate(request, user=self.basic_user)
        response = CustomUserViewSet.as_view(
            {'put': 'me'})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['statuts'], ['PC'])
        self.basic_user.refresh_from_db()
        self.assertEqual(
            self.basic_user.user_profile.mandatory_statuts.count(), 1)
        self.assertTrue(self.basic_user.user_profile.mandatory_statuts.filter(
            statut_name="PC").exists())

    def test_login_success(self):
        request = self.factory.post("/api/account/token/login/", {
            'username': self.basic_user.username,
            'password': "password"
        })
        self._session_authenticate(request)
        response = StandAloneLoginView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))

    def test_login_failure(self):
        request = self.factory.post("/api/account/token/login/", {
            'username': self.basic_user.username,
            'password': 'wrong password'
        })
        self._session_authenticate(request)
        response = StandAloneLoginView.as_view()(request)
        self.assertTrue(status.is_client_error(response.status_code))

    def test_login_empty(self):
        request = self.factory.post("/api/account/token/login/",
                                    {'username': self.basic_user.username})
        self._session_authenticate(request)
        response = StandAloneLoginView.as_view()(request)
        self.assertTrue(status.is_client_error(response.status_code))

    def test_logout(self):
        request = self.factory.post("/api/account/token/logout/")
        self._session_authenticate(request)
        force_authenticate(request, user=self.editor_user)
        response = LogoutView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))


class SessionTest(ApiTestCase):

    def test_authenticated_session(self):
        request = self.factory.get("/api/account/session/")
        force_authenticate(request, user=self.basic_user)
        response = SessionView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['is_authenticated'])

    def test_anonymous_session(self):
        request = self.factory.get("/api/account/session/")
        response = SessionView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(response.data['is_authenticated'])


class UserAdminTestCase(AdminTestCase):

    def setUp(self):
        super().setUp()
        self.basic_user = get_user_model().objects.create_user(
            username="basic", password="password", email="basic@test.app")
        UserProfile.objects.create(
            user=self.basic_user, reminder_recipient=True)
        self.editor_user = get_user_model().objects.create_user(
            username="editor", password="editor", email="editor@test.app")
        UserProfile.objects.create(user=self.editor_user, can_edit_doc=True)
        # FIXME use permissions instead
        self.ua = CustomUserAdmin(get_user_model(), self.site)

    def test_list_shows_can_edit_doc(self):
        self.assertIn("is_editor", self.ua.get_changelist_instance(
            self.request).list_display)
        self.assertFalse(self.ua.is_editor(self.basic_user))
        self.assertTrue(self.ua.is_editor(self.editor_user))

    def test_list_shows_reminder_recipient(self):
        self.assertIn("reminder_recipient", self.ua.get_changelist_instance(
            self.request).list_display)
        self.assertTrue(self.ua.reminder_recipient(self.basic_user))
        self.assertFalse(self.ua.reminder_recipient(self.editor_user))


@ override_config(KEYCLOAK_ENABLED=True)
class SSOTest(ApiTestCase):

    def setUp(self):
        super().setUp()
        sso = SSOConfig.objects.create()
        sso.well_known_oidc = {
            'issuer': 'https://keycloak.example.com/auth/realms/test'
        }
        sso.public_key = "-----BEGIN PUBLIC KEY-----\nThisIsAPublicKey\n-----END PUBLIC KEY-----"
        sso.save()

    def test_sso_config(self):
        self.assertTrue(SSOConfig.objects.exists())
        self.assertTrue(has_keycloak_config())

        SSOConfig.objects.all().delete()
        self.assertFalse(has_keycloak_config())

    def test_create_user_from_sso(self):
        '''should create a new user from sso id object'''
        id_object = {
            "email": "prenom.nom@aviation-civile.gouv.fr", "sub": "123456"}
        _update_or_create_user_from_sso(id_object)
        new_user = get_user_model().objects.get(username="prenom.nom")
        self.assertEqual(new_user.email, "prenom.nom@aviation-civile.gouv.fr")
        self.assertEqual(new_user.sso_profile.sub, "123456")

        id_object = {
            "preferred_username": "MyName",
            "email": "my.name@aviation-civile.gouv.fr", "sub": "567890"}
        _update_or_create_user_from_sso(id_object)
        new_user = get_user_model().objects.get(username="MyName")
        self.assertEqual(new_user.email, "my.name@aviation-civile.gouv.fr")
        self.assertEqual(new_user.sso_profile.sub, "567890")
        self.assertFalse(get_user_model().objects.filter(
            username="my.name").exists())

        id_object = {"sub": "abcdef"}
        _update_or_create_user_from_sso(id_object)
        new_user = get_user_model().objects.get(username="abcdef")
        self.assertEqual(new_user.sso_profile.sub, "abcdef")

    def test_update_user_from_sso(self):
        '''should update an existing user from sso id object'''
        existing_user = get_user_model().objects.create_user(
            "prenom.nom", None, "my_password")
        id_object = {
            "email": "prenom.nom@aviation-civile.gouv.fr", "sub": "123456"}
        _update_or_create_user_from_sso(id_object)
        existing_user.refresh_from_db()
        self.assertEqual(existing_user.email,
                         "prenom.nom@aviation-civile.gouv.fr")
        self.assertEqual(existing_user.sso_profile.sub, "123456")

    # FIXME : how to mock KeycloakOpenId client ?
    # TODO refresh sso_config
    # TODO refresh token in keycloak middelware
    # TODO user login and login callback
    # TODO user logout = feycloak logout
