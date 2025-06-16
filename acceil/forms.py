from django import forms
from .models import Utilisateur, Atelier
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError

class AtelierCreationForm(forms.Form):
    # Informations personnelles
    prenom = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Entrez votre prénom'})
    )
    nom = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Entrez votre nom'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'exemple@email.com'})
    )
    telephone = forms.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?\d{9,15}$', message="Format de téléphone invalide")],
        widget=forms.TextInput(attrs={'placeholder': '+33 6 12 34 56 78'})
    )
    photo_utilisateur = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={'accept': 'image/*'})
    )

    # Informations de l'atelier
    nom_atelier = forms.CharField(
        max_length=100,
        min_length=3,
        widget=forms.TextInput(attrs={'placeholder': 'Ex: Atelier de Couture Marie'})
    )
    adresse = forms.CharField(
        max_length=255,
        min_length=5,
        widget=forms.TextInput(attrs={'placeholder': '123 rue de la Couture'})
    )
    ville = forms.CharField(
        max_length=100,
        min_length=2,
        widget=forms.TextInput(attrs={'placeholder': 'Paris'})
    )
    description = forms.CharField(
        min_length=50,
        widget=forms.Textarea(attrs={
            'placeholder': 'Décrivez votre atelier, vos spécialités, votre expérience... (minimum 50 caractères)'
        })
    )
    photo_atelier = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={'accept': 'image/*'})
    )

    # Mot de passe
    mot_de_passe = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={'placeholder': 'Minimum 8 caractères'})
    )
    confirmation_mot_de_passe = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirmez votre mot de passe'})
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if Utilisateur.objects.filter(email=email).exists():
            raise forms.ValidationError('Cette adresse email est déjà utilisée.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        mot_de_passe = cleaned_data.get('mot_de_passe')
        confirmation_mot_de_passe = cleaned_data.get('confirmation_mot_de_passe')

        if mot_de_passe and confirmation_mot_de_passe and mot_de_passe != confirmation_mot_de_passe:
            raise forms.ValidationError('Les mots de passe ne correspondent pas.')
        
        return cleaned_data 

class ConnexionForm(forms.Form):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'votre@email.com',
            'id': 'connexionEmail',
            'name': 'email'
        })
    )
    mot_de_passe = forms.CharField(
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Votre mot de passe',
            'id': 'connexionPassword',
            'name': 'mot_de_passe'
        })
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise forms.ValidationError('L\'email est requis.')
        if not Utilisateur.objects.filter(email=email).exists():
            raise forms.ValidationError('Aucun compte associé à cet email.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        mot_de_passe = cleaned_data.get('mot_de_passe')

        if email and mot_de_passe:
            try:
                user = Utilisateur.objects.get(email=email)
                if not check_password(mot_de_passe, user.mot_de_passe):
                    raise forms.ValidationError('Mot de passe incorrect')
            except Utilisateur.DoesNotExist:
                pass  # L'erreur est déjà gérée dans clean_email

        return cleaned_data

class InscriptionForm(forms.Form):
    prenom = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Votre prénom',
            'id': 'prenom',
            'name': 'prenom'
        })
    )
    nom = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Votre nom',
            'id': 'nom',
            'name': 'nom'
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'votre@email.com',
            'id': 'inscriptionEmail',
            'name': 'email'
        })
    )
    telephone = forms.CharField(
        max_length=15,
        required=True,
        validators=[RegexValidator(r'^\+?\d{9,15}$', message="Format de téléphone invalide")],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+33 6 12 34 56 78',
            'id': 'telephone',
            'name': 'telephone'
        })
    )
    mot_de_passe = forms.CharField(
        min_length=8,
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Minimum 8 caractères',
            'id': 'inscriptionPassword',
            'name': 'mot_de_passe'
        })
    )
    confirmation_mot_de_passe = forms.CharField(
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirmez votre mot de passe',
            'id': 'confirmationPassword',
            'name': 'confirmation_mot_de_passe'
        })
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise forms.ValidationError('L\'email est requis.')
        if Utilisateur.objects.filter(email=email).exists():
            raise forms.ValidationError('Cette adresse email est déjà utilisée.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        mot_de_passe = cleaned_data.get('mot_de_passe')
        confirmation_mot_de_passe = cleaned_data.get('confirmation_mot_de_passe')

        if not mot_de_passe:
            raise forms.ValidationError('Le mot de passe est requis.')
        if not confirmation_mot_de_passe:
            raise forms.ValidationError('La confirmation du mot de passe est requise.')
        if mot_de_passe and confirmation_mot_de_passe and mot_de_passe != confirmation_mot_de_passe:
            raise forms.ValidationError('Les mots de passe ne correspondent pas.')
        
        return cleaned_data

    def save(self):
        try:
            cleaned_data = self.cleaned_data
            print("\n=== DÉBUT DE LA SAUVEGARDE ===")
            print("Données nettoyées:", cleaned_data)
            
            # Créer l'utilisateur avec les données nettoyées
            utilisateur = Utilisateur(
                prenom=cleaned_data['prenom'],
                nom=cleaned_data['nom'],
                email=cleaned_data['email'],
                telephone=cleaned_data['telephone'],
                role='client',
                mot_de_passe=make_password(cleaned_data['mot_de_passe'])
            )
            
            print("\nUtilisateur créé avec les données suivantes:")
            print(f"Prénom: {utilisateur.prenom}")
            print(f"Nom: {utilisateur.nom}")
            print(f"Email: {utilisateur.email}")
            print(f"Téléphone: {utilisateur.telephone}")
            print(f"Rôle: {utilisateur.role}")
            
            print("\nValidation en cours...")
            utilisateur.full_clean()
            print("Validation réussie")
            
            print("\nSauvegarde en cours...")
            utilisateur.save()
            print(f"Utilisateur sauvegardé avec succès. ID: {utilisateur.id}")
            
            return utilisateur
            
        except ValidationError as e:
            print("\nERREUR DE VALIDATION:")
            print(f"Message: {str(e)}")
            print("Erreurs détaillées:")
            for field, errors in e.message_dict.items():
                print(f"- {field}: {errors}")
            raise
        except Exception as e:
            print("\nERREUR LORS DE LA SAUVEGARDE:")
            print(f"Type d'erreur: {type(e)}")
            print(f"Message: {str(e)}")
            import traceback
            print("Traceback complet:")
            print(traceback.format_exc())
            raise 