from django.urls import path, include
from django.conf import settings

from users.views import CustomUserViewSet
from eNews.views import EditorDocViewSet, DocForUserViewSet
from .views import ConfigView, HealthCheckView
from .routers import NestedDefaultRouter

router = NestedDefaultRouter()
router.register(r'doc', DocForUserViewSet, basename='doc')
router.register(r'users', CustomUserViewSet)
router.register(r'doc-for-editors', EditorDocViewSet, basename="editors-doc")
router.register_additional_view("config", "api-config")
router.register_additional_view("sso-login", "api-sso-login")
router.register_additional_view("sso-login-callback", "api-sso-login-complete")
router.register_additional_view("login", "api-login")
router.register_additional_view("logout", "api-logout")
router.register_additional_view("health", "api-health")


urlpatterns = [
    path('', include(router.urls)),
    path('', include('users.urls')),
    path('config/', ConfigView.as_view(), name="api-config"),
    path('health/', HealthCheckView.as_view(),
         name="api-health"),
]

if not settings.DEBUG:
    router.register_additional_view("session", "api-session")
