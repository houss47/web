from django.urls import path
from . import views

app_name = 'commande'

urlpatterns = [
    path('', views.commande_list, name='commande_list'),
    path('validate/', views.validate_commande, name='validate_commande'),
]
