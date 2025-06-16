from django.urls import path
from . import views

app_name = 'acceil'  # ← très important pour {% url 'acceil:index' %}

urlpatterns = [
    path('', views.index, name='index'),
    path('contact/', views.contact, name='contact'),
    path('connexion/', views.connexion, name='connexion'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('mot-de-passe-oublie/', views.mot_de_passe_oublie, name='mot_de_passe_oublie'),
    path('dashboard-client/', views.dashboard_client, name='dashboard_client'),
    path('dashboard-gerant/', views.dashboard_gerant, name='dashboard_gerant'),
    path('creer-atelier/', views.creer_atelier, name='creer_atelier'),
    
]
