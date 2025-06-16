from django.urls import path
from . import views
from django.shortcuts import redirect

app_name = 'utilisateur'

urlpatterns = [
    path('', lambda request: redirect('utilisateur:dashboard_client'), name='index'),
    path('dashboard/', views.dashboard_client, name='dashboard_client'),
    path('mon-profil/', views.mon_profil, name='mon_profil'),
    path('mes-commandes/', views.mes_commandes, name='mes_commandes'),
    path('mes-mesures/', views.mes_mesures, name='mes_mesures'),
    path('mes-rendez-vous/', views.mes_rendez_vous, name='mes_rendez_vous'),
    path('modifier-mesure/', views.modifier_mesure, name='modifier_mesure'),
    path('annuler-rendez-vous/<int:rdv_id>/', views.annuler_rendez_vous, name='annuler_rendez_vous'),
    path('supprimer-rendez-vous/<int:rdv_id>/', views.supprimer_rendez_vous, name='supprimer_rendez_vous'),
    path('annuler-commande/<int:commande_id>/', views.annuler_commande, name='annuler_commande'),
    path('telecharger-commande/<int:commande_id>/', views.telecharger_commande, name='telecharger_commande'),
]