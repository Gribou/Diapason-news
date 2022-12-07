from constance import config
from django.conf import settings


def get_safe_hosts():
    return config.INTERNAL_HOSTNAMES.split(" ")


def get_unsafe_hosts():
    safe_hosts = get_safe_hosts()
    return [a for a in settings.ALLOWED_HOSTS if a not in safe_hosts and a != "localhost"] if '*' not in safe_hosts else []


def host_is_safe(hostname):
    safe_hosts = get_safe_hosts()
    return '*' in safe_hosts or hostname in safe_hosts


def make_url(request, host_list):
    if host_list and '*' not in host_list:
        return "{}://{}{}".format(request.scheme, host_list[0], settings.URL_ROOT)
    else:
        return None


def serialize_safety(request):
    return {
        'is_safe': host_is_safe(request.get_host()),
        'safe_host': make_url(request, get_safe_hosts()),
        'other_host': make_url(request, get_unsafe_hosts())
    }
