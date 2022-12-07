from rest_framework import filters
from django.db.models import Q
from datetime import date
from functools import reduce


import logging
logger = logging.getLogger('django')


class DocFilterBackend(filters.SearchFilter):
    # DRAFT_OR_PUBLISHED_KEYWORD = 'with_draft'
    # DRAFT_ONLY_KEYWORD = 'draft_only'
    IN_EFFECT_KEYWORD = 'in_effect'
    TO_COME_KEYWORD = 'to_come'
    DESTINATAIRES_KEYWORD = 'dest'
    REFERENCE_KEYWORD = 'reference'
    DOCTYPE_KEYWORD = "doctype"
    THEME_KEYWORD = "theme"
    default_search_fields = ['title', 'descriptive', 'reference', 'keywords']

    def get_search_fields(self, view, request):
        fields = super().get_search_fields(view, request)
        return self.default_search_fields + (fields if fields else [])

    def _get_param_list(self, request, keyword):
        try:
            return request.query_params.get(keyword, None).split(',')
        except (AttributeError, ValueError):
            return []

    def filter_queryset(self, request, queryset, view):
        if request.query_params:  # optimization if no params at all
            queryset = super().filter_queryset(request, queryset, view)
            queryset = self._filter_by_reference(request, queryset)
            queryset = self._filter_by_doctypes(request, queryset)
            queryset = self._filter_by_themes(request, queryset)
            # queryset = self._filter_draft(request, queryset)
            queryset = self._filter_by_effect_period(request, queryset)
            queryset = self._filter_by_destinataires(request, queryset)
        return queryset.distinct()

    def _filter_by_reference(self, request, queryset):
        references = self._get_param_list(request, self.REFERENCE_KEYWORD)
        if references and references[0].startswith("-"):
            return queryset.exclude(reference__in=[r.replace("-", "") for r in references])
        elif references:
            return queryset.filter(reference__in=references)
        else:
            return queryset

    def _filter_by_doctypes(self, request, queryset):
        doctypes = [d.upper() for d in self._get_param_list(
            request, self.DOCTYPE_KEYWORD)]
        if doctypes and doctypes[0].startswith("-"):
            return queryset.exclude(
                doctype__short_name__in=[d.replace("-", "") for d in doctypes])
        elif doctypes:
            return queryset.filter(doctype__short_name__in=doctypes)
        else:
            return queryset

    def _filter_by_themes(self, request, queryset):
        themes = self._get_param_list(request, self.THEME_KEYWORD)
        if themes and themes[0].startswith("-"):
            return queryset.exclude(theme__short_name__in=[t.replace("-", "") for t in themes])
        elif themes:
            return queryset.filter(theme__short_name__in=themes)
        else:
            return queryset

    # def _filter_draft(self, request, queryset):
    #     '''filter docs depending on published state'''
    #     if self.DRAFT_ONLY_KEYWORD in request.query_params:
    #         return queryset.exclude(publication_date__lte=date.today())
    #     if self.DRAFT_OR_PUBLISHED_KEYWORD not in request.query_params:
    #         # keep only published
    #         return queryset.filter(publication_date__lte=date.today())
    #     return queryset

    def _filter_by_effect_period(self, request, queryset):
        '''filter docs depending on when they are in effect'''
        begin_date_filter = Q()
        end_date_filter = Q()
        is_used = False
        if self.TO_COME_KEYWORD in request.query_params:
            begin_date_filter = Q(begin_date__gt=date.today())
            is_used = True
        if self.IN_EFFECT_KEYWORD in request.query_params:
            begin_date_filter = begin_date_filter | Q(
                begin_date__lte=date.today())
            end_date_filter = Q(end_date=None) | Q(
                end_date__gte=date.today())
            is_used = True
        return queryset.filter(begin_date_filter, end_date_filter).filter(update_by__isnull=True, included=False) if is_used else queryset

    def _filter_by_destinataires(self, request, queryset):
        dests = self._get_param_list(request, self.DESTINATAIRES_KEYWORD)
        exclude_dest = [d[1:] for d in dests if d.startswith('-')]
        include_dest = [d for d in dests if not d.startswith('-')]
        if exclude_dest:
            queryset = queryset.exclude(
                destinataires__statut_name__in=exclude_dest).exclude(destinataires__mix_statuts__statut_name__in=exclude_dest)
        if include_dest:
            queryset = queryset.filter(
                Q(destinataires__statut_name__in=include_dest) |
                Q(destinataires__mix_statuts__statut_name__in=include_dest))
        return queryset


class DocForUserFilterBackend(filters.BaseFilterBackend):
    FAVORITE_KEYWORD = 'favorite'
    READ_KEYWORD = 'read'
    UNREAD_KEYWORD = 'unread'
    FOR_ME_KEYWORD = 'for_me'  # just the ones sent to current user

    def filter_queryset(self, request, queryset, view):
        if request.user and request.user.is_authenticated:
            queryset = self._filter_favorite(request, queryset)
            queryset = self._filter_by_read_status(request, queryset)
            queryset = self._filter_for_me(request, queryset)
        return queryset.all()

    def _filter_favorite(self, request, queryset):
        '''keep only favorite docs for current user'''
        return queryset.filter(favorite_for=request.user)\
            if self.FAVORITE_KEYWORD in request.query_params else queryset

    def _filter_by_read_status(self, request, queryset):
        '''keep docs according to read/unread status for current user'''
        if self.READ_KEYWORD in request.query_params:
            if self.UNREAD_KEYWORD not in request.query_params:
                return queryset.filter(who_read_it=request.user)
            # if 'read' and 'unread' are both in params, do not filter
        elif self.UNREAD_KEYWORD in request.query_params:
            return queryset.exclude(who_read_it=request.user)
        return queryset

    def _filter_for_me(self, request, queryset):
        if self.FOR_ME_KEYWORD in request.query_params:
            try:
                user_statuts = request.user.user_profile.mandatory_statuts.all()
            except:
                user_statuts = []
            lookup = [Q(destinataires=s) | Q(destinataires__mix_statuts=s)
                      for s in user_statuts]
            return queryset.filter(reduce(lambda q, value: q | value, lookup, Q()))
        return queryset
