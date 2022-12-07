from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.urls import reverse
import datetime
from pathlib import Path

from .models import Doc, Statut, DocType, Theme


class StatutSerializer(serializers.ModelSerializer):
    is_simple = serializers.SerializerMethodField()

    class Meta:
        model = Statut
        fields = ['pk', 'statut_name', 'is_simple']

    def get_is_simple(self, obj):
        return not obj.mix_statuts.exists()


class ThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theme
        fields = ['short_name', 'full_name']


class DocTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = DocType
        fields = ['short_name']


class SimpleDocSerializer(serializers.ModelSerializer):
    reference = serializers.ReadOnlyField()

    class Meta:
        model = Doc
        fields = ['pk', 'reference']


class DocSerializer(serializers.ModelSerializer):
    redacteur = serializers.StringRelatedField()
    updated_by = serializers.SerializerMethodField()
    theme = serializers.StringRelatedField()
    global_search = serializers.SerializerMethodField()

    class Meta:
        model = Doc
        fields = ['pk', 'reference', 'to_come', 'in_effect', 'out_of_date',
                  'update_of', 'begin_date', 'end_date', 'publication_date',
                  'title', 'descriptive', 'file', 'redacteur', 'replaced',
                  'updated_by', 'archived', 'archive_path', 'theme', 'global_search']
        read_only_fields = ['pk', 'reference', 'archived']

    def get_updated_by(self, obj):
        try:
            return [{'pk': doc.pk, 'ref': doc.reference} for doc in obj.update_by.all()]
        except (AttributeError, ValueError):
            return None

    def get_global_search(self, obj):
        # pre-formatted attr to be used by global search feature (diapason-portal)
        index_url = self.context['request'].build_absolute_uri(reverse("home"))
        return {
            "title": obj.reference,
            "subtitle": obj.title,
            "url": "{}doc/{}".format(index_url, obj.pk)
        }


class DocForUserSerializer(DocSerializer):
    '''additional fields when user is authenticated'''
    is_read = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    is_for_me = serializers.SerializerMethodField()

    def _user(self):
        try:
            return self.context.get('request', None).user
        except AttributeError:
            pass

    def get_is_read(self, obj):
        user = self._user()
        if user:
            return obj.user_has_read_doc(user)

    def get_is_favorite(self, obj):
        user = self._user()
        if user:
            return obj.is_favorite_of(user)

    def get_is_for_me(self, obj):
        user = self._user()
        if user:
            return obj.is_dest(user)

    class Meta(DocSerializer.Meta):
        fields = DocSerializer.Meta.fields + \
            ['is_read', 'is_favorite', 'is_for_me']


def year_choices_for_ref():
    return [(r, r) for r in range(2000, datetime.date.today().year + 2)]


class DocForEditorSerializer(serializers.ModelSerializer):
    year_ref = serializers.ChoiceField(choices=year_choices_for_ref())
    title = serializers.CharField(required=True)
    redacteur = serializers.SlugRelatedField(
        slug_field='username', queryset=get_user_model().simple_objects, allow_null=True, required=False)
    approbateur = serializers.SlugRelatedField(
        slug_field='username', queryset=get_user_model().simple_objects, allow_null=True, required=False)
    verificateurs = serializers.SlugRelatedField(
        slug_field='username', many=True, queryset=get_user_model().simple_objects)
    doctype = serializers.SlugRelatedField(
        slug_field='short_name', queryset=DocType.objects.all())
    theme = serializers.SlugRelatedField(
        slug_field='short_name', queryset=Theme.objects.all(), required=False)
    update_of_read = serializers.SerializerMethodField()
    update_of = serializers.CharField(required=False,
                                      write_only=True, allow_null=True)
    destinataires = serializers.SlugRelatedField(
        many=True, slug_field='statut_name', queryset=Statut.objects.all())
    file_url = serializers.FileField(source='file', read_only=True)
    file = serializers.FileField(
        write_only=True, required=False, allow_null=True)
    reference = serializers.ReadOnlyField()

    class Meta:
        model = Doc
        fields = ['pk', 'year_ref', 'doctype', 'number_ref', 'update_of',
                  'update_of_read', 'begin_date', 'end_date',
                  'publication_date', 'title', 'descriptive', 'file',
                  'file_url', 'redacteur', 'verificateurs', 'approbateur',
                  'destinataires', 'reference', 'keywords', 'obsolescence_date', 'delete_on_archive', 'theme']

    def get_update_of_read(self, obj):
        return obj.update_of.reference if obj.update_of else None

    def validate_update_of(self, value):
        if not value:
            return value
        updated_doc = Doc.simple_objects.filter(reference=value).first()
        if not updated_doc:
            raise serializers.ValidationError(
                "{} n'existe pas.".format(value.upper()))
        return updated_doc

    def validate_descriptive(self, value):
        # do not store an empty string
        return value if value else None

    def validate_file(self, value):
        # validate file extension
        try:
            extension = Path(value.name).suffix[1:].lower()
            if extension != "pdf":
                raise serializers.ValidationError(
                    "{} n'est pas un fichier PDF".format(value))
            return value
        except:
            raise serializers.ValidationError(
                "Le fichier fournit n'est pas valide.")

    def validate(self, data):
        try:
            same_ref = Doc.simple_objects.filter(
                year_ref=data['year_ref'],
                doctype__short_name=data['doctype'],
                number_ref=data['number_ref']).first()
            if same_ref is not None and (not self.instance or
                                         same_ref.pk != self.instance.pk):
                raise serializers.ValidationError('{} existe déjà ({}).'.format(
                    same_ref.reference, same_ref.title))
        except KeyError as e:
            raise serializers.ValidationError(
                "Référence manquante : {}".format(e))
        return super().validate(data)
