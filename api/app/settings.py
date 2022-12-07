import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)

DEBUG = os.getenv("DEBUG", "False") == "True"
SECRET_KEY = os.getenv("SECRET_KEY", "not-a-valid-key-9876543210")


if DEBUG:
    ALLOWED_HOSTS = ['*']
    CORS_ORIGIN_ALLOW_ALL = True
    OTHER_HOSTS = []
else:
    ALLOWED_HOSTS = ['*']
    a_h_list = [a_h for a_h in os.getenv(
        "ALLOWED_HOSTS", '').replace('"', '').split(' ')]
    CSRF_TRUSTED_ORIGINS = a_h_list
    # so that API can be usable by other websites, we allow cross-origin requests (when not authenticated)
    CORS_ORIGIN_ALLOW_ALL = True
    # CORS_ORIGIN_WHITELIST = ['https://{}'.format(a_h) for a_h in a_h_list]
    # CORS_ORIGIN_WHITELIST.append('http://localhost')
    CSRF_TRUSTED_ORIGINS = ['https://{}'.format(a_h) for a_h in a_h_list]
    CSRF_TRUSTED_ORIGINS.append('http://localhost')
    # cors not needed because django will serve react files
    # CSRF_COOKIE_SAMESITE = 'Strict'
    # SESSION_COOKIE_SAMESITE = 'Strict'
    # False since we will grab it via universal-cookies in frontend
    # SECURE_SSL_REDIRECT = True
    CSRF_COOKIE_HTTPONLY = False
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_AGE = 30 * 60  # session duration in sec

# racine de l'application
URL_ROOT = os.getenv("URL_ROOT", '/')
FORCE_SCRIPT_NAME = CSRF_COOKIE_PATH = LANGUAGE_COOKIE_PATH = SESSION_COOKIE_PATH = URL_ROOT

# Fichiers statiques (CSS, JavaScript, Images)
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static_web'),
]
STATIC_URL = URL_ROOT + 'static/'
WHITENOISE_STATIC_PREFIX = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# Fichiers enregistrés
MEDIA_URL = URL_ROOT + 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # Applications tierces
    'rest_framework',
    'djoser',
    'constance',
    'constance.backends.database',
    'corsheaders',
    'django_celery_results',
    'django_celery_beat',

    # Applications eNews
    'users',
    'eNews',
    'nav',
    'api',
]

SITE_ID = 1

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'users.middleware.KeycloakMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

if DEBUG:
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
    INTERNAL_IPS = ['127.0.0.1']  # for debug toolbar
    INSTALLED_APPS += ['rest_framework.authtoken', 'debug_toolbar']
else:
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')


ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates_web'),
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': os.getenv("DB_ENGINE", 'django.db.backends.sqlite3'),
        'NAME': os.getenv("DB_NAME", os.path.join(BASE_DIR, 'db.sqlite3')),
        'USER': os.getenv("DB_USER", ''),
        'PASSWORD': os.getenv("DB_PASSWORD", ''),
        'HOST': os.getenv("DB_HOST", ''),
        'PORT': os.getenv("DB_PORT", '')
    }
}

WSGI_APPLICATION = 'app.wsgi.application'


AUTH_PASSWORD_VALIDATORS = []
AUTH_USER_MODEL = 'users.User'
AUTHENTICATION_BACKENDS = [
    'users.authentication.KeycloakAuthorizationBackend',
    'django.contrib.auth.backends.ModelBackend'
]
LOGOUT_REDIRECT_URL = "admin:login"
LOGIN_REDIRECT_URL = "admin:index"


FILE_UPLOAD_PERMISSIONS = 0o644


EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", None)
if EMAIL_BACKEND:
    # Envoi de mail par serveur SMTP (internet DGAC)
    EMAIL_HOST = os.getenv("EMAIL_HOST", '')
    EMAIL_PORT = os.getenv("EMAIL_PORT", "")
    EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", '')
    EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "False") == "True"
else:
    # mock email sending in "sent_emails" directory
    EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"
    EMAIL_FILE_PATH = os.path.join(BASE_DIR, "sent_emails")
SITE_NAME = "eNews"

# use CONSTANCE_CONFIG instead
ADMINS = [('Admin', os.getenv('EMAIL_ADMIN', None))]
DEFAULT_FROM_EMAIL = os.getenv("EMAIL_ADMIN", "")
SERVER_EMAIL = DEFAULT_FROM_EMAIL  # admin emails 'from'

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'
CONSTANCE_ADDITIONAL_FIELDS = {
    'logo_select': [
        'django.forms.fields.ChoiceField', {
            'widget': 'django.forms.Select',
            'choices': (("diapason", 'Diapason'), ('lfff', 'CRNA/N'))
        }
    ]
}
CONSTANCE_CONFIG = {
    'EMAIL_ADMIN': (os.getenv('EMAIL_ADMIN', "root@localhost"),
                    "Adresse e-mail de l'administrateur"),
    'EMAIL_SUBJECT_PREFIX':
    ('[ENEWS] ',
     'Préfixe ajouté aux sujets des emails envoyés automatiquement'),
    'INTERNAL_HOSTNAMES':
    (os.getenv("INTERNAL_HOSTNAME", "example.crnan"),
     "Noms de domaine accessibles en interne séparés par des espaces.\nTous les autres domaines seront considérés comme 'non-sûrs'. Certaines fonctions ne sont pas accessibles depuis les hôtes non sûrs.\nUn astérisque (*) indique que tous les domaines doivent être considérés comme sûrs."
     ),
    'DOMAINS_FOR_DISPLAY': (os.getenv("DOMAINS_FOR_DISPLAY", "example.crnan/enews autreexample.crnan/enews"), "Noms de domaine servant à la génération de liens dans les emails automatiques (séparés par des espaces).\nUn lien pour chaque domaine sera présenté à l'utilisateur."),
    'LOGO': ("diapason", "Logo à afficher sur la page portail", 'logo_select'),
    'KEYCLOAK_ENABLED': (False, "Utiliser l'authentification SSO avec un serveur Keycloak"),
    'KEYCLOAK_SERVER_URL': ("http://localhost:8080/auth/", "URL du serveur Keycloak"),
    'KEYCLOAK_REALM': ('master', 'Nom de royaume Keycloak'),
    'KEYCLOAK_CLIENT_ID': ("enews", 'Identifiant de client Keycloak de cette application'),
    'KEYCLOAK_CLIENT_SECRET': ("__secret__", "Secret de client Keycloak de cette application"),
}
CONSTANCE_CONFIG_FIELDSETS = {
    "Envoi d'emails": ('EMAIL_ADMIN', 'EMAIL_SUBJECT_PREFIX', "DOMAINS_FOR_DISPLAY"),
    "Gestion des Urls": ("INTERNAL_HOSTNAMES", ),
    "SSO Keycloak": ("KEYCLOAK_ENABLED", "KEYCLOAK_SERVER_URL", "KEYCLOAK_REALM", "KEYCLOAK_CLIENT_ID", 'KEYCLOAK_CLIENT_SECRET'),
    "Personnalisation": ("LOGO",)
}

REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS':
        'rest_framework.versioning.AcceptHeaderVersioning',
    'DEFAULT_VERSION': '1.0',
    'ALLOWED_VERSIONS': ['1.0'],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.SessionAuthentication',
        'users.authentication.CSRFExemptSessionAuthentication',
    ],
    'PAGE_SIZE': 20,
    'TEST_REQUEST_DEFAULT_FORMAT': 'json'
}

if DEBUG:
    REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'].append(
        'rest_framework.authentication.TokenAuthentication')


DJOSER = {
    'SERIALIZERS': {
        'current_user': 'users.serializers.CustomUserSerializer',
    },
}
if not DEBUG:  # when rest_framework.auth_token is not in use
    DJOSER['TOKEN_MODEL'] = None
    DJOSER['CREATE_SESSION_ON_LOGIN'] = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'fr-FR'

TIME_ZONE = 'Europe/Paris'

USE_I18N = True

USE_L10N = True

USE_TZ = True

CELERY_TIMEZONE = TIME_ZONE
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", None)
CELERY_TASK_DEFAULT_QUEUE = os.getenv("CELERY_QUEUE", "enews")
# do not send task to queue if no broker, run task locally (blocking) :
CELERY_TASK_ALWAYS_EAGER = CELERY_BROKER_URL is None
CELERY_RESULT_BACKEND = "django-db"
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

SILENCED_SYSTEM_CHECKS = [
    "rest_framework.W001",  # no default pagination class
    "corsheaders.E013",  # for test container
]

# if DEBUG:
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'api.email.ConstanceAdminEmailHandler'
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
    },
    'loggers': {
        '': {
            'handlers': ["console"],
            "level": "DEBUG",
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django.security': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        }
    }
}
