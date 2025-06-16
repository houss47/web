from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Utilisateur, Atelier
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from django.db import transaction
from .forms import AtelierCreationForm, ConnexionForm, InscriptionForm
from django.http import JsonResponse

# Create your views here.
def index(request):
    # Récupérer les 4 premiers ateliers
    ateliers = Atelier.objects.all()[:4]
    return render(request, 'acceil/home.html', {'ateliers': ateliers})

def contact(request):
    return render(request, 'acceil/contact.html')

def connexion(request):
    if request.method == 'POST':
        try:
            form_type = request.POST.get('form_type')
            
            if form_type == 'connexion':
                form = ConnexionForm(request.POST)
                if form.is_valid():
                    email = form.cleaned_data['email']
                    password = form.cleaned_data['mot_de_passe']
                    
                    try:
                        user = Utilisateur.objects.get(email=email)
                        if check_password(password, user.mot_de_passe):
                            # Stocker les informations de l'utilisateur en session
                            request.session['user_id'] = user.id
                            request.session['user_role'] = user.role
                            request.session['user_email'] = user.email
                            request.session['user_nom'] = user.nom
                            request.session['user_prenom'] = user.prenom
                            
                            # Préparer la réponse
                            response_data = {
                                'success': True,
                                'redirect': '/administration/' if user.role == 'gérant' else '/utilisateur/'
                            }
                            
                            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                                return JsonResponse(response_data)
                            
                            return redirect('administration:dashboard' if user.role == 'gérant' else 'utilisateur:dashboard_client')
                        else:
                            error_msg = 'Mot de passe incorrect'
                            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                                return JsonResponse({
                                    'success': False,
                                    'errors': {'mot_de_passe': error_msg}
                                })
                            messages.error(request, error_msg)
                    except Utilisateur.DoesNotExist:
                        error_msg = 'Email non trouvé'
                        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return JsonResponse({
                                'success': False,
                                'errors': {'email': error_msg}
                            })
                        messages.error(request, error_msg)
                else:
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return JsonResponse({
                            'success': False,
                            'errors': form.errors
                        })
                    for field, errors in form.errors.items():
                        for error in errors:
                            messages.error(request, f"{form.fields[field].label}: {error}")
            
            elif form_type == 'inscription':
                form = InscriptionForm(request.POST)
                
                if form.is_valid():
                    try:
                        with transaction.atomic():
                            email = form.cleaned_data['email']
                            
                            if Utilisateur.objects.filter(email=email).exists():
                                error_msg = 'Cette adresse email est déjà utilisée.'
                                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                                    return JsonResponse({
                                        'success': False,
                                        'errors': {'email': error_msg}
                                    })
                                messages.error(request, error_msg)
                                return render(request, 'acceil/connexion.html', {
                                    'connexion_form': ConnexionForm(),
                                    'inscription_form': form
                                })

                            user = form.save()
                            
                            response_data = {
                                'success': True,
                                'redirect': '/connexion/'
                            }
                            
                            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                                return JsonResponse(response_data)
                            
                            messages.success(request, 'Inscription réussie ! Vous pouvez maintenant vous connecter.')
                            return redirect('acceil:connexion')
                        
                    except Exception as e:
                        error_response = {
                            'success': False,
                            'errors': {'general': str(e)}
                        }
                        
                        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return JsonResponse(error_response)
                        messages.error(request, f'Erreur lors de l\'inscription : {str(e)}')
                else:
                    error_response = {
                        'success': False,
                        'errors': form.errors
                    }
                    
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return JsonResponse(error_response)
                    for field, errors in form.errors.items():
                        for error in errors:
                            messages.error(request, f"{form.fields[field].label}: {error}")
        
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': {'general': 'Une erreur inattendue est survenue'}
                })
            messages.error(request, 'Une erreur inattendue est survenue')
    
    else:
        connexion_form = ConnexionForm()
        inscription_form = InscriptionForm()
    
    return render(request, 'acceil/connexion.html', {
        'connexion_form': connexion_form,
        'inscription_form': inscription_form
    })

def deconnexion(request):
    """Vue de déconnexion centralisée"""
    # Sauvegarder le nom de l'utilisateur avant de vider la session
    user_name = request.session.get('user_nom', '')
    user_prenom = request.session.get('user_prenom', '')
    
    # Vider la session
    request.session.flush()
    
    # Afficher un message personnalisé si l'utilisateur était connecté
    if user_name and user_prenom:
        messages.info(request, f'À bientôt {user_prenom} {user_name} !')
    else:
        messages.info(request, 'À bientôt !')
        
    return redirect('acceil:connexion')

def mot_de_passe_oublie(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = Utilisateur.objects.get(email=email)
            # Ici, vous pouvez implémenter la logique d'envoi d'email
            # pour réinitialiser le mot de passe
            messages.success(request, 'Un email de réinitialisation a été envoyé à votre adresse email.')
            return redirect('acceil:connexion')
        except Utilisateur.DoesNotExist:
            messages.error(request, 'Aucun compte associé à cette adresse email.')
    
    return render(request, 'acceil/mot_de_passe_oublie.html')

def dashboard_client(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'client':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    user = Utilisateur.objects.get(id=request.session['user_id'])
    return render(request, 'acceil/dashboard_client.html', {'user': user})

def dashboard_gerant(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    user = Utilisateur.objects.get(id=request.session['user_id'])
    try:
        atelier = Atelier.objects.get(utilisateur=user)
    except Atelier.DoesNotExist:
        atelier = None
    
    return render(request, 'acceil/dashboard_gerant.html', {
        'user': user,
        'atelier': atelier
    })

def creer_atelier(request):
    if request.method == 'POST':
        form = AtelierCreationForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                with transaction.atomic():
                    # Créer d'abord l'utilisateur avec le rôle 'gérant'
                    utilisateur = Utilisateur(
                        nom=form.cleaned_data['nom'],
                        prenom=form.cleaned_data['prenom'],
                        email=form.cleaned_data['email'],
                        telephone=form.cleaned_data['telephone'],
                        role='gérant',  # On définit directement le rôle comme gérant
                        mot_de_passe=make_password(form.cleaned_data['mot_de_passe'])
                    )
                    
                    # Gérer la photo de l'utilisateur si elle est fournie
                    if 'photo_utilisateur' in request.FILES:
                        utilisateur.photo = request.FILES['photo_utilisateur']
                    
                    # Sauvegarder l'utilisateur sans validation (on la fera après)
                    utilisateur.save()
                    
                    # Créer l'atelier
                    atelier = Atelier(
                        utilisateur=utilisateur,
                        nom_atelier=form.cleaned_data['nom_atelier'],
                        adresse=form.cleaned_data['adresse'],
                        ville=form.cleaned_data['ville'],
                        description=form.cleaned_data['description']
                    )
                    
                    # Gérer la photo de l'atelier si elle est fournie
                    if 'photo_atelier' in request.FILES:
                        atelier.photo_atelier = request.FILES['photo_atelier']
                    
                    # Sauvegarder l'atelier
                    atelier.save()
                    
                    # Maintenant que l'atelier est créé, on peut valider l'utilisateur
                    utilisateur.full_clean()
                    utilisateur.save()
                    
                    messages.success(request, 'Votre atelier a été créé avec succès ! Vous pouvez maintenant vous connecter.')
                    return redirect('acceil:connexion')
                    
            except ValidationError as e:
                messages.error(request, f'Erreur de validation : {str(e)}')
            except Exception as e:
                messages.error(request, f'Une erreur est survenue : {str(e)}')
        else:
            for field, errors in form.errors.items():
                if field == '__all__':
                    for error in errors:
                        messages.error(request, error)
                else:
                    for error in errors:
                        messages.error(request, f"{form.fields[field].label}: {error}")
    else:
        form = AtelierCreationForm()
    
    return render(request, 'acceil/creer_atelier.html', {'form': form})
