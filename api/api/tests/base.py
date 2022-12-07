from django.http.request import HttpRequest
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.contrib.admin.sites import AdminSite
from rest_framework.test import APIRequestFactory
from contextlib import contextmanager

import logging
import sys

from eNews.models import UserProfile

@contextmanager
def streamhandler_to_console(lggr):
    # Use 'up to date' value of sys.stdout for StreamHandler,
    # as set by test runner.
    stream_handler = logging.StreamHandler(sys.stdout)
    lggr.addHandler(stream_handler)
    yield
    lggr.removeHandler(stream_handler)


def testcase_log_console(lggr):
    def testcase_decorator(func):
        def testcase_log_console(*args, **kwargs):
            with streamhandler_to_console(lggr):
                return func(*args, **kwargs)

        return testcase_log_console

    return testcase_decorator


logger = logging.getLogger('django')
# use with @testcase_log_console(logger)


class ApiTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        call_command('populate_lfff', quiet=True)

    def setUp(self):
        self.factory = APIRequestFactory()
        self.basic_user = get_user_model().objects.create_user(
            username="username", password="password", email="username@test.app")
        self.editor_user = get_user_model().objects.create_user(
            username="editor", password="editor", email="editor@test.app")
        UserProfile(user=self.editor_user, can_edit_doc=True) #FIXME use permissions instead

    def _list_view(self, view):
        return view.as_view(actions={'get': 'list', 'post': 'create'})

    def _detail_view(self, view):
        return view.as_view(actions={
            'get': 'retrieve',
            'put': 'update',
            'delete': 'destroy'
        })

    def _get_detail(self, url, user=None, **kwargs):
        request = self.factory.get(url)
        self._authenticate(request, user=user)
        return self._detail_view()(request, **kwargs)

    def _get_list(self, url, user=None, **kwargs):
        request = self.factory.get(url)
        self._authenticate(request, user=user)
        return self._list_view()(request, **kwargs)


class MockRequest(HttpRequest):
    pass


class AdminTestCase(TestCase):
    request = MockRequest()

    @classmethod
    def setUpTestData(cls):
        call_command('populate_lfff', quiet=True)

    def setUp(self):
        self.site = AdminSite()
        basic_user = get_user_model().objects.create_user(
            username="username", password="password", email="username@test.app")
        self.request.user = basic_user
        self.admin_user = get_user_model().objects.create_superuser(
            username="admin", password="password")
        self.client.force_login(self.admin_user)
