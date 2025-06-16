from django.urls import path
from . import views

app_name = 'administration'

urlpatterns = [
    path('calendar/', views.calendar, name='calendar'),
    path('', views.dashboard, name='dashboard'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('models/', views.models, name='models'),
    path('ateliers/', views.ateliers, name='ateliers'),
    path('orders/', views.orders, name='orders'),
    path('settings/', views.settings, name='settings'),
    path('logout/', views.logout_view, name='logout'),
]
