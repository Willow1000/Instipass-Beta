from django.contrib.auth.mixins import LoginRequiredMixin,UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import ListView,UpdateView,DeleteView,DetailView
from django.contrib.auth.views import LoginView,LogoutView
from django.contrib.auth import logout
from .forms import LoginForm
from django.shortcuts import redirect
from institution.models import *
import requests
from student.models import *
from django.shortcuts import get_object_or_404
import json
from django.contrib import messages
from logs.models import APIAccessLog


# Create your views here.
# class AdminHome()
class AdminLogin(LoginView):
    form_class = LoginForm
    template_name = "admin_login.html"
    
    redirect_authenticated_user = False

    def dispatch(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated and user.is_superuser:
            return redirect("home")
        return super().dispatch(request, *args, **kwargs)
    
class InstituttionsView(UserPassesTestMixin,LoginRequiredMixin,ListView):
        model = Institution
        template_name = "admin_institution.html"
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
    template_name = "admin_institution_detail.html"
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
                        f"http://127.0.0.1:8001/institution/api/institution_stats/?q={institution.email}",
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

class StudentsAdminView(UserPassesTestMixin,LoginRequiredMixin,ListView):
    model = Student
    template_name = "admin_student.html"
    login_url = reverse_lazy('adminLogin')
    def get_context_data(self, **kwargs):
        email = self.request.GET.get("q")
        query = self.request.GET.get('querry')
        institution = Institution.objects.filter(email=email).first()
       
        context = super().get_context_data(**kwargs)
        if query:
            context["students"] = Student.objects.filter(last_name__icontains=query , institution=institution) | Student.objects.filter(first_name__icontains=query,institution=institution) | Student.objects.filter(status__icontains = query, institution=institution) | Student.objects.filter(email__icontains = query,institution=institution) | Student.objects.filter(phone_number__icontains=query, institution=institution)
            if not context['students']:
                messages.warning(message = "No results match your search",request = self.request)
        elif Student.objects.filter(institution=institution):
            context['students'] = Student.objects.filter(institution=institution)    

        else:
            context['no_students'] = True    
        context["institution"] = institution

        return context
    def test_func(self):
        return self.request.user.is_superuser

class DeleteInstitutionView(UserPassesTestMixin,LoginRequiredMixin,DeleteView):
    model = Institution
    success_url = reverse_lazy("institutions_admin")
    def test_func(self):
        return self.request.user.is_superuser

class DeleteStudentView(UserPassesTestMixin,LoginRequiredMixin,DeleteView):
    model = Student

    def test_func(self):

        return self.request.user.is_superuser
    def get_success_url(self):
        next_url = self.request.GET.get('next')
        return next_url 

class LogoutView(LogoutView):
    next_page = "/super/login?next=institutions"   
    def dispatch(self, request, *args, **kwargs):
        logout(request)  # Ensure session is cleared
        return redirect(self.next_page)

class ApiAccessView(UserPassesTestMixin,LoginRequiredMixin,ListView):
    template_name = 'admin_apiaccesslogs.html'
    model = APIAccessLog  
    login_url = reverse_lazy('adminLogin')
    def get_queryset(self):
        pass
    def get_context_data(self,**kwargs):
        context =  super().get_context_data(**kwargs)
        context['apiaccesslogs'] =  True  
        query = self.request.GET.get('querry')
        if query:
            context['logs'] =  APIAccessLog.objects.filter(request_method__icontains=query) | APIAccessLog.objects.filter(endpoint__icontains=query) | APIAccessLog.objects.filter(user_id__icontains=query) | APIAccessLog.objects.filter(status_code__icontains = query) | APIAccessLog.objects.filter(ip_address__icontains = query) | APIAccessLog.objects.filter(request_timestamp__icontains = query)
            if not context['logs']:
                messages.warning(message = "No results match your search",request = self.request)
                context['no_results'] = True
        else:

            context['logs'] =  APIAccessLog.objects.all()
        return context
    def test_func(self):
        return self.request.user.is_superuser      


        