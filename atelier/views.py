from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Atelier, RendezVous, Photo, Produit, Service
from acceil.models import Atelier as AtelierModel, Utilisateur
from django.core.exceptions import ValidationError
from django.db.models import Q
from datetime import datetime
from .forms import RendezVousForm

# Create your views here.
def atelier_detail(request, atelier_id):
    atelier = get_object_or_404(AtelierModel, id=atelier_id)
    photos = atelier.photos.all()
    services = atelier.services.all()
    produits = atelier.produits.all()
    
    # Récupérer l'utilisateur depuis la session si connecté
    user = None
    if request.session.get('user_id'):
        try:
            user = Utilisateur.objects.get(id=request.session['user_id'])
        except Utilisateur.DoesNotExist:
            pass
    
    # Traiter le formulaire si c'est une requête POST
    if request.method == 'POST' and request.session.get('user_id') and request.session.get('user_role') == 'client':
        print("Formulaire POST reçu")  # Debug log
        form = RendezVousForm(request.POST, atelier=atelier)
        print(f"Données du formulaire: {request.POST}")  # Debug log
        
        if form.is_valid():
            print("Formulaire valide")  # Debug log
            try:
                # Vérifier si l'utilisateur a déjà un rendez-vous à cette date
                if RendezVous.objects.filter(
                    client=user,
                    date=form.cleaned_data['date'],
                    heure=form.cleaned_data['heure']
                ).exists():
                    messages.error(request, 'Vous avez déjà un rendez-vous à cette date et heure.')
                    return redirect('atelier:atelier_detail', atelier_id=atelier_id)
                
                # Vérifier si le créneau est déjà pris
                if RendezVous.objects.filter(
                    atelier=atelier,
                    date=form.cleaned_data['date'],
                    heure=form.cleaned_data['heure']
                ).exists():
                    messages.error(request, 'Ce créneau est déjà réservé. Veuillez en choisir un autre.')
                    return redirect('atelier:atelier_detail', atelier_id=atelier_id)
                
                print(f"Création du rendez-vous avec les données: {form.cleaned_data}")  # Debug log
                
                # Créer le rendez-vous
                rdv = RendezVous.objects.create(
                    client=user,
                    atelier=atelier,
                    service=form.cleaned_data['service'],
                    date=form.cleaned_data['date'],
                    heure=form.cleaned_data['heure'],
                    message=form.cleaned_data.get('message', '')
                )
                
                print(f"Rendez-vous créé avec succès: {rdv}")  # Debug log
                messages.success(request, 'Votre rendez-vous a été pris avec succès !')
                return redirect('atelier:atelier_detail', atelier_id=atelier_id)
                
            except Exception as e:
                print(f"Erreur lors de la création du rendez-vous: {str(e)}")  # Debug log
                messages.error(request, f'Une erreur est survenue lors de la création du rendez-vous : {str(e)}')
        else:
            print(f"Erreurs de validation du formulaire: {form.errors}")  # Debug log
            # Afficher les erreurs de validation
            for field, errors in form.errors.items():
                if field != '__all__':
                    for error in errors:
                        messages.error(request, f"{form.fields[field].label}: {error}")
                else:
                    for error in errors:
                        messages.error(request, error)
    else:
        # Créer le formulaire de rendez-vous pour GET
        form = RendezVousForm(atelier=atelier)
    
    context = {
        'atelier': atelier,
        'photos': photos,
        'services': services,
        'produits': produits,
        'user': user,
        'form': form,
        'current_date': timezone.now().strftime('%Y-%m-%d')
    }
    return render(request, 'atelier/atelier_detail.html', context)

@login_required(login_url='acceil:connexion')
def prendre_rdv(request, atelier_id):
    # Vérifier si l'utilisateur est connecté
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour prendre rendez-vous.')
        return redirect('acceil:connexion')
    
    # Vérifier si l'utilisateur est un client
    if request.session.get('user_role') != 'client':
        messages.error(request, 'Cette fonctionnalité est réservée aux clients.')
        return redirect('acceil:connexion')
    
    try:
        atelier = Atelier.objects.get(id=atelier_id)
        user = Utilisateur.objects.get(id=request.session['user_id'])
        
        if request.method == 'POST':
            form = RendezVousForm(request.POST, atelier=atelier)
            if form.is_valid():
                try:
                    # Vérifier si l'utilisateur a déjà un rendez-vous à cette date
                    if RendezVous.objects.filter(
                        client=user,
                        date=form.cleaned_data['date'],
                        heure=form.cleaned_data['heure']
                    ).exists():
                        messages.error(request, 'Vous avez déjà un rendez-vous à cette date et heure.')
                        return redirect('atelier:atelier_detail', atelier_id=atelier_id)
                    
                    # Créer le rendez-vous
                    rdv = RendezVous.objects.create(
                        client=user,
                        atelier=atelier,
                        service=form.cleaned_data['service'],
                        date=form.cleaned_data['date'],
                        heure=form.cleaned_data['heure'],
                        message=form.cleaned_data['message'],
                        status='en_attente'
                    )
                    
                    messages.success(request, 'Votre rendez-vous a été pris avec succès !')
                    return redirect('atelier:atelier_detail', atelier_id=atelier_id)
                    
                except Exception as e:
                    messages.error(request, f'Une erreur est survenue lors de la création du rendez-vous : {str(e)}')
                    return redirect('atelier:atelier_detail', atelier_id=atelier_id)
            else:
                for field, errors in form.errors.items():
                    for error in errors:
                        messages.error(request, f"{form.fields[field].label}: {error}")
                return redirect('atelier:atelier_detail', atelier_id=atelier_id)
        else:
            form = RendezVousForm(atelier=atelier)
        
        return render(request, 'atelier/atelier_detail.html', {
            'atelier': atelier,
            'user': user,
            'form': form,
            'current_date': timezone.now().strftime('%Y-%m-%d')
        })
        
    except Atelier.DoesNotExist:
        messages.error(request, 'Atelier non trouvé.')
        return redirect('atelier:ateliers')
    except Utilisateur.DoesNotExist:
        messages.error(request, 'Utilisateur non trouvé.')
        return redirect('acceil:connexion')
        
def ateliers(request):
    # Récupérer les paramètres de recherche et de filtrage
    search_query = request.GET.get('search', '')
    page = request.GET.get('page', 1)
    per_page = 9  # Nombre d'ateliers par page
    
    # Base queryset
    ateliers_list = AtelierModel.objects.all()
    
    # Appliquer la recherche si un terme est fourni
    if search_query:
        ateliers_list = ateliers_list.filter(
            Q(nom_atelier__icontains=search_query) |
            Q(ville__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(ateliers_list, per_page)
    try:
        ateliers = paginator.page(page)
    except PageNotAnInteger:
        ateliers = paginator.page(1)
    except EmptyPage:
        ateliers = paginator.page(paginator.num_pages)
    
    context = {
        'ateliers': ateliers,
        'user': request.user,
        'search_query': search_query,
        'total_results': ateliers_list.count(),
    }
    return render(request, 'atelier/ateliers.html', context)


