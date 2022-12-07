from rest_framework import serializers
from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model

from eNews.models import Doc


class SimpleUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['pk', 'username']
        read_only_fields = ['pk', 'username']


class CustomUserSerializer(UserSerializer):
    can_edit_doc = serializers.SerializerMethodField(read_only=True)
    statuts = serializers.SerializerMethodField()
    favorite_count = serializers.SerializerMethodField(read_only=True)
    unread_count = serializers.SerializerMethodField(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + \
            ('can_edit_doc', 'is_staff', 'statuts',
             'favorite_count', 'unread_count')
        read_only_fields = UserSerializer.Meta.read_only_fields + \
            ('can_edit_doc', 'is_staff', 'statuts',
             'favorite_count', 'unread_count')

    def get_statuts(self, obj):
        try:
            return [s.statut_name for s in obj.user_profile.mandatory_statuts.all()]
        except:
            return []

    def get_can_edit_doc(self, obj):
        return obj.is_editor

    def get_favorite_count(self, obj):
        return obj.doc_favorite_for.count()

    def get_unread_count(self, obj):
        return Doc.objects_for_user.exclude(who_read_it=obj).count()
