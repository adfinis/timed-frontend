import datetime
import os

import environ

env = environ.Env()

django_root = environ.Path(__file__) - 2

ENV_FILE = env.str('DJANGO_ENV_FILE', default=django_root('.env'))
if os.path.exists(ENV_FILE):
    environ.Env.read_env(ENV_FILE)

# per default production is enabled for security reasons
# for development create .env file with ENV=dev
ENV = env.str('ENV', 'prod')


def default(default_dev=env.NOTSET, default_prod=env.NOTSET):
    """Environment aware default."""
    return ENV == 'prod' and default_prod or default_dev


# Database definition

DATABASE_URL = default('psql://timed:timed@127.0.0.1:5432/timed')
DATABASES = {
    'default': env.db(default=DATABASE_URL)
}


# Application definition

DEBUG = env.bool('DJANGO_DEBUG', default=default(True, False))
SECRET_KEY = env.str('DJANGO_SECRET_KEY', default=default('uuuuuuuuuu'))
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=default(['*']))


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.humanize',
    'multiselectfield',
    'django.forms',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'timed.employment',
    'timed.projects',
    'timed.tracking',
    'timed.reports',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'timed.middleware.DisableCSRFMiddleware',
]

ROOT_URLCONF = 'timed.urls'

FORM_RENDERER = 'django.forms.renderers.TemplatesSetting'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [django_root('timed', 'templates')],
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

WSGI_APPLICATION = 'timed.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LOCALE_PATHS = [
    django_root('timed', 'locale')
]

LANGUAGE_CODE = 'en-US'

TIME_ZONE = env.str('DJANGO_TIME_ZONE', 'Europe/Zurich')

USE_I18N = True
USE_L10N = True

DATETIME_FORMAT = env.str('DJANGO_DATETIME_FORMAT', 'd.m.Y H:i:s')
DATE_FORMAT = env.str('DJANGO_DATE_FORMAT', 'd.m.Y')
TIME_FORMAT = env.str('DJANGO_TIME_FORMAT', 'H:i:s')

DECIMAL_SEPARATOR = env.str('DECIMAL_SEPARATOR', '.')

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = env.str('STATIC_URL', '/static/')
STATIC_ROOT = env.str('STATIC_ROOT', None)

# Rest framework definition

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework_json_api.parsers.JSONParser',
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_METADATA_CLASS':
        'rest_framework_json_api.metadata.JSONAPIMetadata',
    'EXCEPTION_HANDLER':
        'rest_framework_json_api.exceptions.exception_handler',
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework_json_api.pagination.PageNumberPagination',
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework_json_api.renderers.JSONRenderer',
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

JSON_API_FORMAT_KEYS = 'dasherize'
JSON_API_FORMAT_TYPES = 'dasherize'
JSON_API_PLURALIZE_TYPES = True

APPEND_SLASH = False

# Authentication definition

AUTH_LDAP_USER_ATTR_MAP = env.dict('DJANGO_AUTH_LDAP_USER_ATTR_MAP', default={
    'first_name': 'givenName',
    'last_name':  'sn',
    'email':      'mail'
})

LDAP_BASE = 'dc=adsy-ext,dc=becs,dc=adfinis-sygroup,dc=ch'
AUTH_LDAP_SERVER_URI = env.str(
    'DJANGO_AUTH_LDAP_SERVER_URI',
    default('ldap://localhost:389')
)
AUTH_LDAP_BIND_DN = env.str(
    'DJANGO_AUTH_LDAP_BIND_DN',
    default('uid=Administrator,cn=users,{0}'.format(LDAP_BASE))
)
AUTH_LDAP_PASSWORD = env.str(
    'DJANGO_AUTH_LDAP_PASSWORD',
    default('univention')
)
AUTH_LDAP_USER_DN_TEMPLATE = env.str(
    'DJANGO_AUTH_LDAP_USER_DN_TEMPLATE',
    default('uid=%(user)s,cn=users,{0}'.format(LDAP_BASE))
)

AUTH_USER_MODEL = 'employment.User'

AUTHENTICATION_BACKENDS = (
    'django_auth_ldap.backend.LDAPBackend',
    'django.contrib.auth.backends.ModelBackend',
)

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=2),
    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',  # noqa
    },
]

# Email definition

EMAIL_CONFIG = env.email_url(
    'EMAIL_URL',
    default='smtp://localhost:25'
)
vars().update(EMAIL_CONFIG)

DEFAULT_FROM_EMAIL = env.str(
    'DJANGO_DEFAULT_FROM_EMAIL',
    default('webmaster@localhost')
)
