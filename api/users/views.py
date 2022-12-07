from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from djoser.views import UserViewSet
from djoser.conf import settings as djoser_settings
from constance import config
from django.conf import settings
import logging
import json

from eNews.models import Statut, UserProfile
from .keycloak import get_openid_client, has_keycloak_config

logger = logging.getLogger("django")


class StandAloneLoginView(APIView):
    '''Authentification de l'utilisateur
    Permet d'obtenir les cookies csrftoken et sessionid à utiliser pour les requêtes suivantes
    '''

    def post(self, request, format=None):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        if username is None or password is None:
            return Response({'non_field_errors': 'Veuillez indiquer nom d\'utilisateur et mot de passe.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'non_field_errors': 'Mot de passe invalide.'},
                            status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response({'detail': 'Authentifié avec succès.',
                         'csrftoken': request.META["CSRF_COOKIE"]})


class LogoutView(APIView):
    '''
    Invalidation des cookies de session de l'utilisateur courant
    '''

    def post(self, request, format=None):
        try:
            self.request.user.sso_profile.logout()
        except:
            pass
        if settings.DEBUG:
            djoser_settings.TOKEN_MODEL.objects.filter(
                user=request.user).delete()
        logout(request)
        return Response({'detail': 'Déconnecté avec succès.'})


class SessionView(APIView):
    '''
    Etat de la session en cours
    Indique si l'actuel utilisateur est authentifié ou non
    '''

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format=None):
        return Response({'is_authenticated': request.user.is_authenticated,
                         'csrftoken': request.META["CSRF_COOKIE"]})


class CustomUserViewSet(UserViewSet):
    '''
    Liste des utilisateurs.
    Aller à /api/users/me/ pour voir le profil de l'utilisateur actuellement connecté
    '''

    def update(self, request, *args, **kwargs):
        # manually save status (not handled by user serializer)
        self.update_statuts(self.get_object(), request.data.pop('statuts'))
        # no need to refresh object, because super.update gets it from db
        response = super().update(request, *args, **kwargs)
        return response

    def update_statuts(self, obj, statuts):
        if not hasattr(obj, 'user_profile'):
            UserProfile.objects.create(user=obj)
            obj.refresh_from_db()
        obj.user_profile.mandatory_statuts.set(Statut.objects.filter(
            statut_name__in=statuts).all())


class SSOLoginView(APIView):
    '''
    Demande d'authentification auprès du serveur SSO (Keycloak)
    Le serveur renvoie une URL d'autorisation Keycloak qui permettra d'obtenir un code à utiliser avec la vue api-sso-callback
    '''

    def post(self, request, format=None):
        if not has_keycloak_config():
            return Response({"non_field_errors": "L'authentification Angélique est désactivée. Veuillez utiliser le formulaire de connexion intégré."}, status=status.HTTP_400_BAD_REQUEST)
        redirect_uri = request.data.get('redirect_uri', "")
        # Returns the url the user needs to go to to authenticate with keycloak
        return Response({"authorization_url": get_openid_client().auth_url(redirect_uri)})


class SSOCallbackView(APIView):
    '''
    Termine le processus d'authentification SSO (Keycloak)
    Indiquez ici les valeurs obtenues auprès du serveur d'authentification sous la forme :
    { "code" : "le-code", "redirect_uri": "uri-fournit-par-sso"}
    '''

    def post(self, request, format=None):
        if not has_keycloak_config():
            return Response({"non_field_errors": "L'authentification Angélique est désactivée. Veuillez utiliser le formulaire de connexion intégré."}, status=status.HTTP_400_BAD_REQUEST)
        code = request.data.get('code', None)
        redirect_uri = request.data.get('redirect_uri', "")
        try:
            user = authenticate(request=request,
                                code=code,
                                redirect_uri=redirect_uri)
            login(request, user,
                  backend='users.authentication.KeycloakAuthorizationBackend')
            if settings.DEBUG:
                token, _ = djoser_settings.TOKEN_MODEL.objects.get_or_create(
                    user=user)
                return Response(djoser_settings.SERIALIZERS.token(token).data)
            else:
                return Response({'detail': 'Authentifié avec succès.', 'csrftoken': request.META["CSRF_COOKIE"]})
        except Exception as e:
            logger.error(e)
            error_message = json.loads(e.error_message).get(
                "error_description", None)
            return Response(
                {'non_field_errors': "L'authentification Angélique a échoué ({}).".format(
                    error_message or e)},
                status=status.HTTP_400_BAD_REQUEST)
