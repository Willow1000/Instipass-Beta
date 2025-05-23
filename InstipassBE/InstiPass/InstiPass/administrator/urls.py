from django.urls import path

from .views import *
urlpatterns = [
    path("login",AdminLogin.as_view(),name="adminLogin"),
    path("institutions",InstituttionsView.as_view(),name="institutions_admin"),
    path("institution/<int:pk>", InstitutionadminView.as_view(), name="institution_admin_detail"),
    path("logout",LogoutView.as_view(),name="adminLogout"),
    path("students/", StudentsAdminView.as_view(),name="students_admin"),
    path("delete/institution/<int:pk>",DeleteInstitutionView.as_view(),name="delete_institution"),
    path("delete/student/<int:pk>",DeleteStudentView.as_view(),name="delete_student"),
    path('apiaccesslogs',ApiAccessView.as_view(),name="apiAccess")
]

