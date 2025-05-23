from django.contrib import admin
from InstiPass import settings
from django.conf.urls.static import static
from django.urls import path,include
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include('accounts.urls')),
   
    path("superuser/",include("Id.urls")),
    path("institution/",include('institution.urls')),
    path("student/",include('student.urls')),
    path("super/",include("administrator.urls")),

   
    # DRF Spectacular URLs (no UI):
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns+= static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)