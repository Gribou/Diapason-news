from rest_framework import permissions

from .safety import host_is_safe


class InternalOrAuthenticatedPermission(permissions.IsAuthenticated):
    '''
        Website is accessed from inside premices
        or user is authenticated
    '''
    message = "Vous devez utiliser un compte utilisateur ou être connecté au réseau interne."

    def has_permission(self, request, view):
        return host_is_safe(request.get_host())\
            or super().has_permission(request, view)


class IsEditorPermission(permissions.IsAuthenticated):
    ''' allow editon only if user has correct attribute and from safe host'''
    message = "Vous devez utiliser un compte ayant les droits d'accès et être connecté sur le réseau interne."

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_editor and host_is_safe(request.get_host())

    # TODO when can_edit_doc is not used anymore, this permission may be converted to DjangoModelPermission ?
