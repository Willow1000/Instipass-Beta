from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
from InstiPass import settings
from django.conf.urls.static import static

from accounts.views import EmailTokenObtainPairView,CustomTokenRefreshView




router = DefaultRouter()
router.register("institution",InstitutionViewSet,basename="institutionApi")
router.register("settings",InstitutionSettingsViewSet,basename="institutionSettingsApi")
router.register("notifications",NotificationViewSet,basename = "institutionNotificationsApi")

urlpatterns = [
    
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path("api/",include(router.urls)),
    path("api/institution_stats/",IdProcessStatsAPIView.as_view(),name="id_process_stats"),
    
   
]


if settings.DEBUG:
    urlpatterns+= static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)