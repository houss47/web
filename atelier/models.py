from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from acceil.models import Atelier, Utilisateur

class Service(models.Model):
    atelier = models.ForeignKey(Atelier, on_delete=models.CASCADE, related_name='services')
    nom = models.CharField(max_length=100)
    description = models.TextField()
    prix_minimum = models.DecimalField(max_digits=10, decimal_places=2)
    
  

    def __str__(self):
        return f"{self.nom} - {self.atelier.nom_atelier}"

class Produit(models.Model):
    CATEGORIE_CHOICES = [
        ('femmes', 'Femmes'),
        ('hommes', 'Hommes'),
        ('enfants', 'Enfants'),
       
    ]

    atelier = models.ForeignKey(Atelier, on_delete=models.CASCADE, related_name='produits')
    nom = models.CharField(max_length=100)
    description = models.TextField()
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    photo = models.ImageField(upload_to='photos/produits/', blank=True, null=True)
    date_ajout = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} - {self.atelier.nom_atelier}"

class RendezVous(models.Model):
    STATUS_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
    ]

    atelier = models.ForeignKey(Atelier, on_delete=models.CASCADE, related_name='rendez_vous_atelier')
    client = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='rendez_vous_client')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='rendez_vous_service')
    date = models.DateField()
    heure = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_attente')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        client_display = f"{self.client.nom} {self.client.prenom}" if hasattr(self.client, 'nom') and hasattr(self.client, 'prenom') else str(self.client.get_full_name() if hasattr(self.client, 'get_full_name') else self.client.username)
        service_display = self.service.nom if self.service else "Service non spécifié"
        return f"RDV pour {client_display} à {self.atelier.nom_atelier} - Service: {service_display} - Le {self.date.strftime('%d/%m/%Y')} à {self.heure.strftime('%H:%M')}"

class Photo(models.Model):

    atelier = models.ForeignKey(Atelier, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='photos/galerie/')
    titre = models.CharField(max_length=100, blank=True)     
    date_ajout = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return f"{self.titre} - {self.atelier.nom_atelier}"

