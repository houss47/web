from django.urls import path
from . import views

app_name = 'atelier'

urlpatterns = [
    # URLs principales
    path('ateliers/', views.ateliers, name='ateliers'),
   
    
    # URLs des ateliers
    path('atelier/<int:atelier_id>/', views.atelier_detail, name='atelier_detail'),
   
    path('atelier/<int:atelier_id>/prendre-rdv/', views.prendre_rdv, name='prendre_rdv'),
    
   
]