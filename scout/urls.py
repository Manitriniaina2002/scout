"""
URL configuration for scout project.
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.views.generic import RedirectView

class CustomLogoutView(auth_views.LogoutView):
    http_method_names = ['get', 'post', 'options']

urlpatterns = [
    path('admin/', admin.site.urls),
    path('logout/', CustomLogoutView.as_view(next_page='/'), name='logout'),
    path('', include('monitoring.urls')),
]
