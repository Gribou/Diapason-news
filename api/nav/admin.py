from django.contrib import admin

from .models import NavItem, DoctypeFilter, DestinataireFilter


class NavItemAdmin(admin.ModelAdmin):
    model = NavItem
    list_display = ('rank', 'title', 'query', 'icon')


class DoctypeFilterAdmin(admin.ModelAdmin):
    model = DoctypeFilter
    list_display = ('rank', 'label', 'value', 'icon')


class DestinataireFilterAdmin(admin.ModelAdmin):
    model = DestinataireFilter
    list_display = ('rank', 'label', 'value', 'icon')


admin.site.register(NavItem, NavItemAdmin)
admin.site.register(DoctypeFilter, DoctypeFilterAdmin)
admin.site.register(DestinataireFilter, DestinataireFilterAdmin)
