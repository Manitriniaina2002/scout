from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('alerts/', views.alerts_view, name='alerts'),
    path('metrics/', views.metrics_view, name='metrics'),
    path('reports/', views.reports_view, name='reports'),
]
