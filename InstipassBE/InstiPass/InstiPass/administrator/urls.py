from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()


urlpatterns = [
    path("login",AdminLogin.as_view(),name="adminLogin"),
    path("api/",include(router.urls)),
    path("messages",ContactUsView.as_view(),name="admin_contactus"),
    path("message/<int:pk>",DetailContactUsView.as_view(),name="admin_detail_contactus"),
    path("institutions",InstituttionsView.as_view(),name="institutions_admin"),
    path("institution/<int:pk>", InstitutionadminView.as_view(), name="institution_admin_detail"),
    path("logout",LogoutView.as_view(),name="adminLogout"),
    path("contactus/delete/<int:pk>",DelteContactUsView.as_view(),name="delete_contactus"),
    path("students/", StudentsAdminView.as_view(),name="students_admin"),
    path("delete/institution/<int:pk>",DeleteInstitutionView.as_view(),name="delete_institution"),
    path("delete/student/<int:pk>/",DeleteStudentView.as_view(),name="delete_student"),
    path('apiaccesslogs',ApiAccessView.as_view(),name="apiAccess"),
    path('update/student/<int:pk>/',StudentUpdateView.as_view(),name='update_student'),
    path("institution/registration/tracker/",RegistrationTrackerView.as_view(),name='institution_registration_tracker'),
    path('student/registration/tracker/',SubmissionTrackerView.as_view(),name = 'student_registration_tracker'),
    path('clear/apiaccess',clear_apiaccess_logs),
    path("clear/messages",clear_messages),
    path("clear/institution/tracker",clear_institution_reg_tracker),
    path("clear/student/tracker",clear_student_reg_tracker),
    path("institution/token",InstitutionTokeniew.as_view(),name='institution_token'),
    path('delete/token/<int:pk>/',DeleteTokenView.as_view(),name="delete_institution_token"),
    path('institution/signup/token',InstitutionSignupView.as_view(),name='institution_signup_token'),
    path("demobookings",DemoBookingView.as_view(),name="admin_demobooking"),
    path("demobookings/<int:pk>",DemoBookingDetailView.as_view(),name="admin_demosession_detail"),
    path("clear/institution/signup/token",clear_institution_signup_token),
    path("delete/demobooking/<int:pk>",DeleteDemoBooking.as_view(),name="delete_demobooking"),
    path("clear/demobookings",clear_demobooking),
    path("create/demosession", CreateDemoBooking.as_view(),name="admin_create_demosession"),
    path("reschedule/demosession/<int:pk>",UpdateDemoBooking.as_view(),name = "admin_reschedule_demosession"),
    path('institution/signup/tracker',SignupTrackerView.as_view(), name="admin_signup_tracker"),
    path('demobooking/tracker',DemoBookingTrackerView.as_view(),name='demobooking_tracker'),
    path('contactus/tracker',ContactUsTrackerView.as_view(),name='contactus_tracker'),
    path("clear/signuptracker",clear_signuptracker),
    path("clear/contactustracker",clear_contactustracker),
    path("clear/demobookingtracker",clear_demobookingtracker),

    
]

