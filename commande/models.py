from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from acceil.models import Utilisateur
from atelier.models import Produit, Atelier

# Create your models here.

class Commande(models.Model):
    STATUS_CHOICES = [
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('en_attente', 'En attente'),
        ('recupere', 'Récupérée'),
    ]

    reference = models.CharField(max_length=100, unique=True, verbose_name="Référence", blank=True, editable=False)
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_echeance = models.DateField(verbose_name="Date d'échéance", help_text="Date limite de livraison (définie par le gérant)", null=True, blank=True)
    client = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='commandes_client', verbose_name="Client", null=True, blank=True)
    atelier = models.ForeignKey(Atelier, on_delete=models.CASCADE, related_name='commandes_atelier', verbose_name="Atelier", null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_attente', verbose_name="Statut")
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='commandes_produit', verbose_name="Produit", null=True, blank=True)

    def clean(self):
        """Validation personnalisée"""
        if self.date_echeance and self.date_echeance < timezone.now().date():
            raise ValidationError({
                'date_echeance': 'La date d\'échéance ne peut pas être dans le passé.'
            })
        
        if self.client and self.client.role != 'client':
            raise ValidationError({
                'client': 'Seuls les clients peuvent passer des commandes.'
            })

    def save(self, *args, **kwargs):
        # Générer la référence uniquement pour les nouvelles commandes
        if not self.pk:
            self.generate_reference()
        
        # Validation avant sauvegarde
        self.full_clean()
        super().save(*args, **kwargs)

    def generate_reference(self):
        """Génère une référence unique pour la commande"""
        import random
        import string
        
        # Générer un préfixe avec l'année
        year = timezone.now().year
        prefix = f"CMD-{year}"
        
        # Trouver le dernier numéro de séquence pour cette année
        last_commande = Commande.objects.filter(
            reference__startswith=prefix
        ).order_by('-reference').first()
        
        if last_commande and last_commande.reference:
            try:
                # Extraire le numéro de séquence
                last_num = int(last_commande.reference.split('-')[-1])
                new_num = last_num + 1
            except (ValueError, IndexError):
                new_num = 1
        else:
            new_num = 1
        
        # Générer un suffixe aléatoire pour éviter les conflits
        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
        
        self.reference = f"{prefix}-{new_num:04d}-{suffix}"
        
        # Vérifier l'unicité
        while Commande.objects.filter(reference=self.reference).exists():
            suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
            self.reference = f"{prefix}-{new_num:04d}-{suffix}"

    def __str__(self):
        return f"Commande {self.reference} - {self.client.nom} {self.client.prenom}" if self.client else f"Commande {self.reference}"

    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ['-date_creation']
