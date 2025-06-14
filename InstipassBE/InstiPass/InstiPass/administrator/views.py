from django.contrib.auth.mixins import LoginRequiredMixin,UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import ListView,UpdateView,DeleteView,DetailView,CreateView
from django.contrib.auth.views import LoginView,LogoutView
from django.contrib.auth import logout
from .forms import LoginForm
from django.shortcuts import redirect
from institution.models import *
import requests
from rest_framework import viewsets
from student.models import *
from django.shortcuts import get_object_or_404
import json
from .models import ContactUs,NewsLetter,DemoBooking
from django.contrib import messages
from logs.models import APIAccessLog,AdminActionsLog
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from accounts.models import InstitutionSignupToken, SignupTracker
# from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.decorators import method_decorator
from django.http import JsonResponse




# Create your views here.
# class AdminHome()
class AdminLogin(LoginView):
    form_class = LoginForm
    template_name = "administrator/admin_login.html"
    redirect_authenticated_user = False

    def dispatch(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated and user.is_superuser:
            return redirect("home")
        return super().dispatch(request, *args, **kwargs)
    
class LogoutView(LogoutView):
    next_page = "/super/login?next=institutions"   
    def dispatch(self, request, *args, **kwargs):
        logout(request)  # Ensure session is cleared
        return redirect(self.next_page)

class InstituttionsView(UserPassesTestMixin,LoginRequiredMixin,ListView):
        model = Institution
        template_name = "administrator/admin_institution.html"
        context_object_name = "institutions"
        login_url = reverse_lazy('adminLogin')

        def get_queryset(self):
            query = self.request.GET.get('querry')
            if query:
                return Institution.objects.filter(name__icontains=query) | Institution.objects.filter(region__icontains=query) | Institution.objects.filter(county__icontains=query)
            return Institution.objects.all()
        def test_func(self):
            return self.request.user.is_superuser
        
class InstitutionadminView(UserPassesTestMixin,LoginRequiredMixin,DetailView):
    model = Institution
    template_name = "administrator/admin_institution_detail.html"
    context_object_name = "institution"
    login_url = reverse_lazy('adminLogin')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = self.kwargs.get("pk")
        institution = get_object_or_404(Institution, id=pk)
        context['settings'] = InstitutionSettings.objects.filter(institution=institution).first()

        if self.request.user.is_authenticated:
            try:
                with requests.Session() as session:
                    session.cookies.set("sessionid", self.request.COOKIES.get("sessionid"))
                    session.cookies.set("csrftoken", self.request.COOKIES.get("csrftoken"))
                    headers = {
                        "X-CSRFToken": self.request.COOKIES.get("csrftoken")
                    }
                    response = session.get(
                        f"http://127.0.0.1:8000/institution/api/institution_stats/?q={institution.email}",
                        headers=headers
                    )
                    data = response.json()
                    context['total'] = data.get("registered_students")
                    context['process'] = data.get("Ids_being_processed")
                    context["ready"] = data.get("Ids_ready")
            except Exception as e:
                print(f"Error fetching stats: {e}")
                context['total'] = context['process'] = context['ready'] = 0
            return context

    def test_func(self):
            return self.request.user.is_superuser

class InstitutionTokeniew(UserPassesTestMixin,LoginRequiredMixin,ListView):
    model = InstitutionToken
    template_name = 'administrator/admin_institution_token.html'
    login_url = reverse_lazy("adminLogin")
    context_object_name = 'tokens'
    def test_func(self):
        return self.request.user.is_superuser

class DeleteTokenView(UserPassesTestMixin,LoginRequiredMixin,DeleteView):
    model = InstitutionToken
    success_url = reverse_lazy('institution_token')
    login_url = reverse_lazy('adminLogin')       

    def test_func(self):
        return self.request.user.is_superuser

class DeleteInstitutionView(UserPassesTestMixin,LoginRequiredMixin,DeleteView):
    model = Institution
    success_url = reverse_lazy("institutions_admin")
    login_url = reverse_lazy('adminLogin')
    
    def test_func(self):
        return self.request.user.is_superuser

class DeleteStudentView(UserPassesTestMixin,LoginRequiredMixin,DeleteView):
    model = Student
    login_url = reverse_lazy('adminLogin')
    def test_func(self):

        return self.request.user.is_superuser
    def get_success_url(self):
        next_url = self.request.GET.get('next')
        print(next_url)
        return next_url 

class StudentsAdminView(UserPassesTestMixin,LoginRequiredMixin,ListView):
    model = Student
    template_name = "administrator/admin_student.html"
    login_url = reverse_lazy('adminLogin')
    def get_context_data(self, **kwargs):
        email = self.request.GET.get("q")
        query = self.request.GET.get('querry')
        institution = Institution.objects.filter(email=email).first()
       
        context = super().get_context_data(**kwargs)
        if Student.objects.filter(institution=institution):    
            context['students'] = Student.objects.filter(institution=institution)    
        else:
            context['no_students'] = True    

   
        context["institution"] = institution

        return context
    def test_func(self):
        return self.request.user.is_superuser

class StudentUpdateView(UserPassesTestMixin,LoginRequiredMixin,UpdateView):
    model=Student
    template_name = "administrator/admin_student_update.html"
    login_url = reverse_lazy("adminLogin")
    fields = ['first_name','last_name','email','phone_number','reg_no','course','admission_year','photo']
    
    def test_func(self):
        return self.request.user.is_superuser 

    def get_success_url(self):
        next_url = self.request.GET.get('next')
        return next_url     


class ApiAccessView(UserPassesTestMixin,LoginRequiredMixin,ListView):
    template_name = 'administrator/admin_apiaccesslogs.html'
    model = APIAccessLog  
    login_url = reverse_lazy('adminLogin')
    context_object_name = 'logs'

    def test_func(self):
        return self.request.user.is_superuser      




@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_apiaccess_logs(request):
    try:
        deleted_count, _ = APIAccessLog.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} logs.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "APIACCESSLOGS",
            victim = "ALL APIACCESSLOGS"

        )
        return redirect(referer)
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_messages(request):
    try:
        deleted_count, _ = ContactUs.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} messages.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "MESSAGES",
            victim = "ALL MESSAGES"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)  

@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_student_reg_tracker(request):
    try:
        deleted_count, _ = SubmissionTracker.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} logs.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "STUDENTTRACKERLOGS",
            victim = "ALL STUDENTTRACKERLOGS"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_institution_reg_tracker(request):
    try:
        deleted_count, _ = RegistrationTracker.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} logs.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "INSTITUTIONTRACKERLOGS",
            victim = "ALL INSTITUTIONTRACKERLOGS"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)        

@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_institution_signup_token(request):
    try:
        deleted_count, _ = InstitutionSignupToken.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} tokens.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "INSTITUTIONSIGNUPTOKENS",
            victim = "ALL INSTITUTIONSIGNUPTOKENS"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500) 

@login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_demobooking(request):
    try:
        deleted_count, _ = DemoBooking.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} demobookings.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "DEMOBOOKINGS",
            victim = "ALL DEMOBOOKINGS"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)   

login_required
@user_passes_test(lambda u: u.is_superuser)
def clear_signuptracker(request):
    try:
        deleted_count, _ = SignupTracker.objects.all().delete()
        messages.success(request, f"Deleted {deleted_count} signuptracker records.")
        referer = request.META.get('HTTP_REFERER') or '/'
        AdminActionsLog.objects.create(
            action = "CLEAR",
            admin = request.user,
            victim_type = "SIGNUPTRACKER",
            victim = "ALL SIGNUPTRACKERLOGS"

        )
        return redirect(referer)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)                                         



class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    http_method_names = ['post']
   


class ContactUsView(LoginRequiredMixin,UserPassesTestMixin,ListView):
    template_name = "administrator/admin_contactus.html"
    model = ContactUs
    login_url = reverse_lazy('adminLogin')
    context_object_name = "messages"
    def test_func(self):
       return self.request.user.is_superuser      


class DetailContactUsView(LoginRequiredMixin,UserPassesTestMixin,DetailView):
    model = ContactUs
    template = "administrator/contactus_detail.html"
    context_object_name = 'message'
    login_url = reverse_lazy('adminLogin')   

    def test_func(self):
       return self.request.user.is_superuser

class NewsLetterViewSet(viewsets.ModelViewSet):
    queryset = NewsLetter.objects.all()
    serializer_class = NewsLetterSerializer
    http_method_names = ['post']

class DemoBookingViewSet(viewsets.ModelViewSet):
    queryset = DemoBooking.objects.all()
    serializer_class = DemoBookingSerializer
    http_method_names=['post','get']

class RegistrationTrackerView(ListView,LoginRequiredMixin,UserPassesTestMixin):
    template_name = 'administrator/admin_institution_registration_tracker.html'
    model = RegistrationTracker
    context_object_name = 'trackers'
    login_url = reverse_lazy('adminLOgin')    
    def test_func(self):
       return self.request.user.is_superuser 

class SubmissionTrackerView(ListView,LoginRequiredMixin,UserPassesTestMixin):
    template_name = 'administrator/admin_student_registration_tracker.html'
    model = SubmissionTracker
    context_object_name = 'trackers'
    login_url = reverse_lazy('adminLOgin')    
    def test_func(self):
       return self.request.user.is_superuser        

class InstitutionSignupView(ListView,LoginRequiredMixin,UserPassesTestMixin):
    template_name = "administrator/admin_institution_signup.html"
    model = InstitutionSignupToken
    login_url = reverse_lazy('adminLogin')
    context_object_name = 'tokens'

    def test_func(self):
        return self.request.user.is_superuser

class DemoBookingView(LoginRequiredMixin,UserPassesTestMixin,ListView):
    model = DemoBooking       
    template_name = 'administrator/admin_demobooking.html' 
    login_url = reverse_lazy('adminLogin')
    context_object_name = 'bookings'

    def test_func(self):
        return self.request.user.is_superuser

class DeleteDemoBooking(LoginRequiredMixin,UserPassesTestMixin,DeleteView):
    model = DemoBooking
    login_url = reverse_lazy('adminLogin')
    success_url = reverse_lazy('admin_demobooking')  

    def test_func(self):
        return self.request.user.is_superuser     

class CreateDemoBooking(LoginRequiredMixin,UserPassesTestMixin,CreateView):
    model = DemoBooking
    template_name = 'administrator/admin_create_demosession.html'        
    success_url = reverse_lazy('admin_demobooking') 
    login_url = reverse_lazy('adminLogin')
    fields = "__all__"

    def test_func(self):
        return self.request.user.is_superuser


class UpdateDemoBooking(LoginRequiredMixin,UserPassesTestMixin,UpdateView):
    model = DemoBooking
    template_name = 'administrator/admin_reschedule_demo.html'
    success_url = reverse_lazy('admin_demobooking')
    context_object_name = 'demo'
    login_url = reverse_lazy('adminLogin')     
    fields = ['date','time']

    def test_func(self):
        return self.request.user.is_superuser

class DemoBookingDetailView(LoginRequiredMixin,UserPassesTestMixin,DetailView):
    model = DemoBooking
    template_name = "administrator/admin_demosession_detail.html"
    login_url = reverse_lazy('adminLogin')
    context_object_name = 'session'

    def test_func(self):
        return self.request.user.is_superuser


class SignupTrackerView(LoginRequiredMixin,UserPassesTestMixin,ListView):
    model = SignupTracker
    template_name = "administrator/admin_signuptracker.html"
    login_url = reverse_lazy('adminLogin')
    context_object_name = 'trackers'    

    def test_func(self):
        return self.request.user.is_superuser    
