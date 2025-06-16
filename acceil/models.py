from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator
from django.core.exceptions import ValidationError

# Create your models here.

class Utilisateur(models.Model):
    ROLE_CHOICES = [
        ('gérant', 'Gérant'),
        ('client', 'Client'),
    ]

    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    email = models.EmailField(unique=True, verbose_name="Email", error_messages={'unique': 'Cette adresse email est déjà utilisée.'})
    date_inscription = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    telephone = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?\d{9,15}$', message="Format de téléphone invalide")],
        verbose_name="Téléphone"
    )
    photo = models.ImageField(upload_to='photos/utilisateurs/', blank=True, null=True)
    mot_de_passe = models.CharField(max_length=128)  # à hasher manuellement ou via Django auth

    def clean(self):
        if self.role == 'gérant' and not hasattr(self, 'atelier'):
            raise ValidationError("Un gérant doit avoir un atelier associé")

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.role})"

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"


class Atelier(models.Model):
    utilisateur = models.OneToOneField(
        Utilisateur, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'gérant'},
        related_name='atelier'
    )
    nom_atelier = models.CharField(
        max_length=100, 
        verbose_name="Nom de l'atelier",
        validators=[MinLengthValidator(3, message="Le nom de l'atelier doit contenir au moins 3 caractères")]
    )
    adresse = models.CharField(
        max_length=255,
        verbose_name="Adresse",
        validators=[MinLengthValidator(5, message="L'adresse doit contenir au moins 5 caractères")]
    )
    ville = models.CharField(
        max_length=100,
        verbose_name="Ville",
        validators=[MinLengthValidator(2, message="Le nom de la ville doit contenir au moins 2 caractères")]
    )
    description = models.TextField(
        verbose_name="Description",
        validators=[MinLengthValidator(50, message="La description doit contenir au moins 50 caractères")]
    )
    cree_le = models.DateTimeField(auto_now_add=True)
    photo_atelier = models.ImageField(
        upload_to='photos/ateliers/', 
        blank=True, 
        null=True,
        verbose_name="Photo de l'atelier"
    )

    def clean(self):
        if self.utilisateur and self.utilisateur.role != 'gérant':
            raise ValidationError("L'utilisateur associé doit être un gérant")

    def __str__(self):
        return f"{self.nom_atelier} - {self.ville}"

    class Meta:
        verbose_name = "Atelier"
        verbose_name_plural = "Ateliers"


class Contact(models.Model):
    nom_complet = models.CharField(max_length=100, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Adresse email")
    sujet = models.CharField(max_length=200, verbose_name="Sujet du message")
    message = models.TextField(verbose_name="Message")
    date_envoi = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    traite = models.BooleanField(default=False, verbose_name="Message traité")

    def __str__(self):
        return f"Message de {self.nom_complet} - {self.sujet}"

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-date_envoi']
