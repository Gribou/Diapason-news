from rest_framework import serializers

from .models import DestinataireFilter, DoctypeFilter, NavItem


class NavItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = NavItem
        fields = ['title', 'query', 'icon', 'rank']


class DocTypeFilterSerializer(serializers.ModelSerializer):

    class Meta:
        model = DoctypeFilter
        fields = ['label', 'icon', 'value']


class DestinataireFilterSerializer(serializers.ModelSerializer):

    class Meta:
        model = DestinataireFilter
        fields = ['label', 'icon', 'value']
