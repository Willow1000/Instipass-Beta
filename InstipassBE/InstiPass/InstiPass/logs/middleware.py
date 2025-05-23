from .models import APIAccessLog
from django.utils.deprecation import MiddlewareMixin

class APILogMiddleware:
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self,request):
        if request.META:
            data =request.META
            x_forwarded_for = request.META.get("HTTP_X_FORWADED_FOR")
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0].strip()
            else:
                ip = request.META.get("REMOTE_ADDR")
        else:
            ip=None 
        response = self.get_response(request)
        user_id = str(request.user.id) if request.user.is_authenticated else "anonymous"
        if 'api' in request.path.lower():
            APIAccessLog.objects.create(
                user_id = user_id,
                endpoint = request.path,
                request_method = request.method,
                status_code = response.status_code,
                ip_address = ip
            )
 
        return response

# middleware.py
import threading

_request_local = threading.local()

def get_current_request():
    return getattr(_request_local, 'request', None)

class RequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _request_local.request = request
        response = self.get_response(request)
        return response

        
