from django.test import TestCase
from django.core import mail
from constance.test import override_config
from rest_framework.test import RequestsClient
from rest_framework import status

from .base import *
from api.email import mail_admins
from api.views import ConfigView, HealthCheckView

# TODO how to test custom EmailAdminHandler for logging ?


class MailAdminTestCase(TestCase):

    @override_config(EMAIL_ADMIN="test_admin@apps.crnan", EMAIL_SUBJECT_PREFIX="[ENEWS] ")
    def test_mail_admins(self):
        mail_admins("Sujet", "Message", html_message="<div>Html message</div>")
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["test_admin@apps.crnan"])
        self.assertIn("[ENEWS]", mail.outbox[0].subject)

    @override_config(EMAIL_ADMIN="")
    def test_mail_admins_if_no_email(self):
        mail_admins("Sujet", "Message", html_message="<div>Html message</div>")
        self.assertEqual(len(mail.outbox), 0)


class ConfigTest(ApiTestCase):

    @override_config(INTERNAL_HOSTNAMES="*")
    def test_read_safety(self):
        request = self.factory.get("/api/config/")
        response = ConfigView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['safety']['is_safe'])

    @override_config(INTERNAL_HOSTNAMES="")
    def test_read_safety_when_unsafe(self):
        request = self.factory.get("/api/config/")
        response = ConfigView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(response.data['safety']['is_safe'])

    @override_config(INTERNAL_HOSTNAMES='safehost')
    def test_read_safety_from_unsafe_host(self):
        request = self.factory.get("/api/config/")
        response = ConfigView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertFalse(response.data['safety']['is_safe'])

    @override_config(INTERNAL_HOSTNAMES='testserver')
    def test_read_safety_from_safe_host(self):
        request = self.factory.get("/api/config/")
        response = ConfigView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['safety']['is_safe'])


class HealthCheckTest(ApiTestCase):

    def test_healthcheck(self):
        request = self.factory.get("/api/health/")
        response = HealthCheckView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))


class RouterTest(ApiTestCase):

    def test_root_view(self):
        '''API Root View should list all available endpoints'''
        client = RequestsClient()
        response = client.get("http://testserver/api/")
        self.assertTrue(status.is_success(response.status_code))
        content = response.json()
        self.assertEqual(sorted(content.keys()), sorted([
            'doc', 'users', 'doc-for-editors', 'config', 'sso-login-callback', 'sso-login', 'login', 'logout', 'health', 'session']))
