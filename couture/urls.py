"""
URL configuration for couture project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from acceil import views as acceil_views # Importer les vues de l'application acceil

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', acceil_views.index, name='home'), # Page d'accueil à la racine
    path('acceil/', include(('acceil.urls', 'acceil'), namespace='acceil')),
    path('administration/', include(('administration.urls', 'administration'), namespace='administration')),
    path('utilisateur/', include(('utilisateur.urls', 'utilisateur'), namespace='utilisateur')),
    path('atelier/', include(('atelier.urls', 'atelier'), namespace='atelier')),  
    path('commande/', include(('commande.urls', 'commande'), namespace='commande')), 
]

# Ajouter cette configuration pour servir les fichiers statiques en développement
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
