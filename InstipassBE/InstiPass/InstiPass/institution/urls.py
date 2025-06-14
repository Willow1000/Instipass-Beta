from django.urls import path,include
from rest_framework.routers import DefaultRouter,SimpleRouter
from .views import *
from InstiPass import settings
from django.conf.urls.static import static

from accounts.views import EmailTokenObtainPairView,CustomTokenRefreshView
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from rest_framework.response import Response



router = DefaultRouter()
router.register("institution",InstitutionViewSet,basename="institutionApi")
router.register("institutions",InstitutionsViewSet,basename="institutionsApi")
router.register("settings",InstitutionSettingsViewSet,basename="institutionSettingsApi")
router.register("notifications",NotificationViewSet,basename = "institutionNotificationsApi")
router.register('students',InstitutionStudentViewSet,basename='institutionStudents')

urlpatterns = [
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path("api/",include(router.urls)),
    path("api/institution_stats/",IdProcessStatsAPIView.as_view(),name="id_process_stats"), 
    path("api/tokenvalidator",InstitutionTokenAPIView.as_view(),name='validate_token_institution'),
    path("api/signup/token/create",CreateSignupTokenAPIView.as_view(),name="create_institution_signup_token")
]


if settings.DEBUG:
    urlpatterns+= static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)