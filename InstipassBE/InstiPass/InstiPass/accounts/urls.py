from django.urls import path
from .views import *
from django.urls import include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("student/api",StudentViewSet,basename="StudentSignupAPI")
router.register("institution/api",InstitutionViewSet,basename="InstitutionSignupAPI")

urlpatterns = [
    path("signup/",include(router.urls)),
]
