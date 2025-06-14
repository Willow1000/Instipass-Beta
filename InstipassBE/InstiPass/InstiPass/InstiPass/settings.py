from pathlib import Path
import os
from dotenv import load_dotenv
import time
from datetime import timedelta
# making variables in the .env accessible to os.environ
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'administrator',
   
    'axes',
    'corsheaders',

    'accounts',
    'institution',
    'student',
    'logs',
    'Id',
    'rest_framework',
    
    # 'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', 
    'drf_spectacular',
    # 'drf_spectacular_sidecar',
]
# SECURITY
SECRET_KEY ='django-insecure-9d-7bt--r$pg#@!pvk$z8clp*wqnhl84x&lwq)=-za_malt)ic'
# AUTHENTICATION

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1",'localhost']
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]


CORS_ALLOW_CREDENTIALS = True

AUTHENTICATION_BACKENDS = [
    "accounts.forms.EmailBackend",
    'django.contrib.auth.backends.ModelBackend',
    "axes.backends.AxesBackend",
    
   
]
# ALLAUTH SETTINGS
# SOCIALACCOUNT_QUERY_EMAIL = True
# LOGIN_REDIRECT_URL = "/"
# ACCOUNT_SIGNUP_REDIRECT_URL = "/signup/redirect"
# ACCOUNT_LOGOUT_REDIRECT_URL = "/"
# ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = True
# ACCOUNT_AUTHENTICATED_REDIRECT_URL = "/"
AUTH_USER_MODEL = 'accounts.User'
SITE_ID = 1
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    }
}

# SESSION-BASED SECURITY SETTINGS
SESSION_COOKIE_AGE = 3600  # 1 hour
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST=True

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',  # Ensure this is present
    ),
    'DEFAULT_AUTHENTICATION_CLASSES':
      [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        
        
    ],
    'DEFAULT_SCHEMA_CLASS':"drf_spectacular.openapi.AutoSchema",

}
# AXES SETTINGS
# Axes settings

AXES_ENABLED = True  # Enable Axes (useful for disabling during tests)
AXES_LOGIN_FAILURE_LIMIT = 20 # Block after 5 failed attempts
AXES_COOLOFF_TIME = 0.5  # Lockout for 30 minutes (0.5 hours)
AXES_USERNAME_CALLABLE = lambda request, credentials: credentials.get('email')  # Use email as username
AXES_RESET_ON_SUCCESS = True  # Reset failed attempts on successful login
AXES_LOCKOUT_TEMPLATE = 'lockout.html'  # Custom lockout template
AXES_ONLY_USER_OR_IP_FAILURES = True  # lock if either user OR IP exceeds limits

SESSION_ENGINE="django.contrib.sessions.backends.db"
# Customize which HTTP methods are protected (POST covers login forms)
AXES_ONLY_ADMIN_SITE = False
AXES_ENABLE_ADMIN = True
AXES_LOCKOUT_PARAMETERS = ['username', 'ip_address', 'user_agent']

# Optional: Limit lockout to POST requests only
AXES_ONLY_ATTEMPTS_POST = True

# RECAPTCHA
RECAPTCHA_PUBLIC_KEY = os.environ['CAPTCHA_SITE_KEY']
RECAPTCHA_PRIVATE_KEY = os.environ['CAPTCHA_SECRET_KEY']
RECAPTCHA_USE_SSL = True
# CAPTCHA_TEST_MODE = True
NOCAPTCHA = True

# settings.py
# CORS_ALLOW_CREDENTIALS = True

# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',  # or your frontend origin
# ]

# CSRF_TRUSTED_ORIGINS = [
#     'http://localhost:3000',  # same origin as frontend
# ]

CSRF_COOKIE_AGE=3600
# JWT SETTINGS
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=2),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',

    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Nairobi'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'logs.middleware.RequestMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
     'logs.middleware.APILogMiddleware',
    "axes.middleware.AxesMiddleware",
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

ROOT_URLCONF = 'InstiPass.urls'
# TEMPLATES SETTINGS
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR/"templates"],
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

WSGI_APPLICATION = 'InstiPass.wsgi.application'

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
# }

# DATABASE
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ["DB_NAME"],
        "USER": os.environ['DB_USER'],
        "PASSWORD":os.environ["DB_PASS"],
        "HOST":os.environ["DB_HOST"],
        "PORT": os.environ["DB_PORT"],
        "OPTIONS":{
            
        }
    }
}




#MAIL
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.environ['HOST_MAIL']
EMAIL_HOST_PASSWORD = os.environ['HOST_PWD']
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

#MEDIA
MEDIA_ROOT = os.path.join(BASE_DIR,"media")
MEDIA_URL='/media/'

