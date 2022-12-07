from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_204_NO_CONTENT
from constance import config

from api.safety import serialize_safety
from eNews.models import Statut, DocType, Doc, Theme
from users.models import get_editors
from users.keycloak import has_keycloak_config
from nav.models import DestinataireFilter, NavItem, DoctypeFilter
from nav.serializers import DestinataireFilterSerializer, NavItemSerializer, DocTypeFilterSerializer


class ConfigView(APIView):
    '''
    Eléments configurables par l'administrateur (changeant peu)

    Safety : 
    Le nom de domaine utilisé est-il considéré comme sécure.
    Si oui, les publications sont accessibles sans authentification
    Si non, l'utilisateur doit être authentifié pour accéder au contenu
    '''

    def get(self, request, format=None):
        context = {"request": request}
        status_list = Statut.objects.all()
        # users can only choose from 'simple' statuses (no mix_statuts)
        # doc can have 'complex' statuses as destinataires
        return Response({
            'sso': has_keycloak_config(),
            'email_admin': config.EMAIL_ADMIN,
            "safety": serialize_safety(request),
            "statuts": [s.statut_name for s in status_list],
            "statuts_for_user": [s.statut_name for s in status_list if not s.mix_statuts.exists()],
            "doctypes": [
                doctype.short_name for doctype in DocType.objects.order_by('short_name').all()
            ],
            "themes": [theme.short_name for theme in Theme.objects.all()],
            "references": [doc.reference for doc in Doc.simple_objects.all()],
            "editors": [editor.username for editor in get_editors()],
            "logo": config.LOGO,
            "menu": NavItemSerializer(
                NavItem.objects.all(), many=True, context=context).data,
            "filters": {
                "doctypes": DocTypeFilterSerializer(
                    DoctypeFilter.objects.all(), many=True, context=context).data,
                "destinataires": DestinataireFilterSerializer(DestinataireFilter.objects.all(), many=True, context=context).data,
                "themes": [{'label': t.short_name, 'value': t.short_name} for t in Theme.objects.all()]
            }
        })


class HealthCheckView(APIView):
    '''
    Vérification que le serveur web est en route
    A utiliser avec Docker-compose pour établir l'état de santé du container
    (healthcheck)
    '''

    def get(self, request, format=None):
        return Response(status=HTTP_204_NO_CONTENT)
