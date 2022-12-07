from rest_framework import viewsets, mixins
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.pagination import PageNumberPagination
from django_auto_prefetching import AutoPrefetchViewSetMixin, prefetch
import os

from api.permissions import (
    InternalOrAuthenticatedPermission, IsEditorPermission)
from .models import Doc
from .serializers import DocSerializer, DocForUserSerializer, DocForEditorSerializer
from .filters import DocFilterBackend, DocForUserFilterBackend


class DocViewSet(AutoPrefetchViewSetMixin,
                 viewsets.ReadOnlyModelViewSet):
    permission_classes = [InternalOrAuthenticatedPermission]
    serializer_class = DocSerializer
    pagination_class = PageNumberPagination
    filter_backends = [OrderingFilter, DocFilterBackend]
    ordering_fields = '__all__'
    ordering = ['-publication_date', '-begin_date']

    def get_queryset(self):
        return prefetch(Doc.objects, self.get_serializer_class())


class DocForUserViewSet(DocViewSet):
    '''
    Publications
    Accessible si l'utilisateur est authentifié ou si le host est sécure (cf /api/safety/)
    Consultation uniquement et préférences utilisateur si authentifié (lu/non lu + favoris)
    Un document donné est accessible à /api/docs/{pk}/
    '''
    filter_backends = [DocForUserFilterBackend] + \
        DocViewSet.filter_backends

    def _is_authenticated(self):
        return self.request.user and self.request.user.is_authenticated

    def get_serializer_class(self):
        return DocForUserSerializer if self._is_authenticated()\
            else super().get_serializer_class()

    def get_queryset(self):
        return prefetch(Doc.objects_for_user, self.get_serializer_class())\
            if self._is_authenticated() else super().get_queryset()

    @action(detail=False, methods=['post'], name='Mark all as read', permission_classes=[IsAuthenticated])
    def page_read(self, request):
        doc_to_mark = self.get_queryset().exclude(
            who_read_it=request.user)
        if request.data:
            doc_to_mark = doc_to_mark.filter(
                pk__in=request.data.get("docs", []))
        ThroughModel = Doc.who_read_it.through
        ThroughModel.objects.bulk_create([
            ThroughModel(user_id=request.user.pk, doc_id=doc.pk) for doc in doc_to_mark])
        # docs must be refreshed from database to have is_read=True
        serializer = self.get_serializer(Doc.objects_for_user.filter(
            pk__in=[d.pk for d in doc_to_mark]), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], name='Mark as read',
            permission_classes=[IsAuthenticated])
    def read(self, request, pk=None):
        if request.data.get('read', False):
            self.get_object().set_as_read(request.user)
            return Response({'is_read': True})
        else:
            self.get_object().set_as_unread(request.user)
            return Response({'is_read': False})

    @action(detail=True, methods=['post'], name='Mark as favorite',
            permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        if request.data.get('favorite', False):
            self.get_object().add_to_favorites(request.user)
            return Response({'is_favorite': True})
        else:
            self.get_object().remove_from_favorites(request.user)
            return Response({'is_favorite': False})

    # @action(detail=True, methods=['post'], name='Mark as included',
    #         permission_classes=[IsEditorPermission])
    # def included(self, request, pk=None):
    #     object = self.get_object()
    #     object.included = request.data.get("included", False)
    #     object.save()
    #     return self.retrieve(request, pk=pk)


class EditorDocViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                       viewsets.GenericViewSet):
    '''
    Publications
    Accessible si l'utilisateur authentifié est éditeur de contenu
    (ie ayant la permission "Peut créer/éditer/supprimer un document")
    Les droits d'accès sont configurés par l'administrateur
    '''
    queryset = Doc.simple_objects.select_related(
        'redacteur', 'update_of', 'approbateur').prefetch_related('verificateurs', 'destinataires').all()
    serializer_class = DocForEditorSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsEditorPermission]

    def update(self, request, *args, **kwargs):
        self.should_delete_file = 'file_url' not in request.data \
            and 'file' not in request.data
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        super().perform_update(serializer)
        # delete file if not provided in serializer nor file_url
        # if file_url is present, then existing file should be kept
        # if file is present, it will replace existing file
        if self.should_delete_file:
            self._delete_file()

    def _delete_file(self):
        obj = self.get_object()
        if obj.file and os.path.isfile(obj.file.path):
            os.remove(obj.file.path)
        obj.file = None
        obj.save()
