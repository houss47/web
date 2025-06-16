from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db import transaction
from .models import Commande
from acceil.models import Utilisateur # Assuming Utilisateur is in acceil app
from atelier.models import Produit, Atelier # Assuming Produit and Atelier are in atelier app
from utilisateur.models import Mesure # Import Mesure model

# Create your views here.
@login_required
def commande_list(request):
    try:
        # Récupérer l'utilisateur connecté depuis la session
        user_id = request.session.get('user_id')
        
        if not user_id:
            messages.error(request, 'Session utilisateur non trouvée.')
            return redirect('acceil:connexion')

        try:
            user = Utilisateur.objects.get(id=user_id)
        except Utilisateur.DoesNotExist:
            messages.error(request, 'Utilisateur non trouvé.')
            return redirect('acceil:connexion')

        # Vérifier que l'utilisateur est un client
        if user.role != 'client':
            messages.error(request, 'Seuls les clients peuvent passer des commandes.')
            return redirect('acceil:connexion')

        # Récupérer le produit et l'atelier depuis les paramètres GET
        produit_id = request.GET.get('produit_id')
        atelier_id = request.GET.get('atelier_id')
        
        # Si pas de paramètres, rediriger vers les ateliers
        if not produit_id or not atelier_id:
            messages.error(request, 'Veuillez sélectionner un produit et un atelier.')
            return redirect('atelier:ateliers')

        try:
            produit = Produit.objects.get(id=produit_id)
            atelier = Atelier.objects.get(id=atelier_id)
        except (Produit.DoesNotExist, Atelier.DoesNotExist):
            messages.error(request, 'Produit ou atelier non trouvé.')
            return redirect('atelier:ateliers')

        # Créer une nouvelle commande à chaque fois (sans date d'échéance)
        with transaction.atomic():
            commande = Commande.objects.create(
                client=user,
                produit=produit,
                atelier=atelier,
                status='en_attente'
                # Pas de date_echeance - sera définie par le gérant
            )

        # Récupérer les mesures de l'utilisateur
        mesures = Mesure.objects.filter(utilisateur=user).order_by('-date_modification').first()
        if not mesures:
            mesures = Mesure.objects.create(
                utilisateur=user,
                tour_poitrine=0,
                tour_taille=0,
                tour_hanches=0,
                longueur_epaule=0,
                hauteur_epaule=0,
                longueur_buste=0,
                longueur_bras=0,
                tour_biceps=0,
                tour_poignet=0,
                longueur_epaule_coude=0,
                longueur_jambe=0,
                entrejambe=0,
                tour_cuisse=0,
                tour_genou=0,
                tour_mollet=0,
                tour_cheville=0,
                tour_cou=0,
                hauteur_dos=0,
                carrure_dos=0,
                largeur_epaules=0
            )

        # Récupérer les informations du gérant de l'atelier
        atelier_gerant = atelier.utilisateur if atelier else None

        # Pas de calcul des jours restants car pas de date d'échéance
        jours_restants = None
        jours_restants_abs = None

        context = {
            'commande': commande,
            'atelier_gerant': atelier_gerant,
            'mesures': mesures,
            'user': user,
            'produit': produit,
            'atelier': atelier,
            'jours_restants': jours_restants,
            'jours_restants_abs': jours_restants_abs,
        }

        return render(request, 'commande/commande.html', context)

    except Exception as e:
        messages.error(request, f'Une erreur est survenue: {str(e)}')
        return redirect('atelier:ateliers')

@login_required
def validate_commande(request):
    if request.method == 'POST':
        try:
            # Vérifier si l'utilisateur est connecté
            user_id = request.session.get('user_id')
            if not user_id:
                messages.error(request, 'Vous devez être connecté pour valider une commande.')
                return redirect('acceil:connexion')

            # Récupérer la commande avec transaction
            with transaction.atomic():
                commande_id = request.POST.get('commande_id')
                commande = Commande.objects.select_for_update().get(
                    id=commande_id,
                    client_id=user_id
                )
                
                # Mettre à jour le statut
                commande.status = 'en_cours'
                commande.save()
                
                messages.success(request, f'Commande {commande.reference} validée avec succès !')
                
                # Rediriger vers l'atelier correspondant
                return redirect('atelier:atelier_detail', atelier_id=commande.atelier.id)

        except Commande.DoesNotExist:
            messages.error(request, 'Commande non trouvée.')
        except Exception as e:
            messages.error(request, f'Erreur lors de la validation de la commande: {str(e)}')
        
        return redirect('atelier:ateliers')
    
    return redirect('atelier:ateliers')
