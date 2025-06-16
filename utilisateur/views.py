from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.urls import reverse
from django.urls import reverse_lazy
from acceil.models import Utilisateur
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re
from .models import Mesure
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from atelier.models import RendezVous
from django.utils import timezone
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from commande.models import Commande
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from io import BytesIO
from django.template.loader import render_to_string
import os
import qrcode
from qrcode.image.pil import PilImage
from PIL import Image as PILImage

# Create your views here.
def dashboard_client(request):
    if 'user_id' not in request.session:
        messages.warning(request, "Veuillez vous connecter pour accéder à votre espace personnel.")
        return redirect('acceil:connexion')
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        
        # Vérification du rôle
        if request.session.get('user_role') != 'client':
            messages.error(request, "Accès non autorisé. Cette page est réservée aux clients.")
            return redirect('acceil:connexion')
        
        # Récupérer les 2 prochains rendez-vous
        today = timezone.now().date()
        prochains_rdv = RendezVous.objects.filter(
            client=utilisateur,
            date__gte=today,
            status='en_attente'
        ).order_by('date', 'heure')[:2]
        
        # Récupérer les dernières mesures de l'utilisateur
        mesures = Mesure.objects.filter(utilisateur=utilisateur).order_by('-date_modification').first()
        
        # Compter les rendez-vous terminés
        rdv_termines = RendezVous.objects.filter(
            client=utilisateur,
            status='confirme'
        ).count()
        
        # Compter les commandes en cours
        commandes_en_cours = Commande.objects.filter(
            client=utilisateur,
            status='en_cours'
        ).count()
        
        # Compter le nombre total de commandes
        total_commandes = Commande.objects.filter(
            client=utilisateur
        ).count()
        
        # Compter les commandes terminées
        commandes_terminees = Commande.objects.filter(
            client=utilisateur,
            status='termine'
        ).count()
        
        # Récupérer les 3 dernières commandes de l'utilisateur
        dernieres_commandes = Commande.objects.filter(
            client=utilisateur
        ).select_related('produit', 'atelier').order_by('-date_creation')[:3]
        
        context = {
            'utilisateur': utilisateur,
            'prochains_rdv': prochains_rdv,
            'mesures': mesures,
            'rdv_termines': rdv_termines,
            'commandes_en_cours': commandes_en_cours,
            'total_commandes': total_commandes,
            'commandes_terminees': commandes_terminees,
            'dernieres_commandes': dernieres_commandes,
        }
        return render(request, 'utilisateur/dashboard_client.html', context)
    except Utilisateur.DoesNotExist:
        messages.error(request, "Votre compte n'a pas été trouvé. Veuillez vous reconnecter.")
        request.session.flush()  # Nettoyer la session
        return redirect('acceil:connexion')

def mon_profil(request):
    if 'user_id' not in request.session:
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    try:
        user = Utilisateur.objects.get(id=request.session['user_id'])
    except Utilisateur.DoesNotExist:
        messages.error(request, 'Utilisateur non trouvé.')
        return redirect('acceil:connexion')
    
    if request.method == 'POST':
        # Récupérer les données du formulaire
        nom = request.POST.get('nom', '').strip()
        prenom = request.POST.get('prenom', '').strip()
        email = request.POST.get('email', '').strip()
        telephone = request.POST.get('telephone', '').strip()
        
        # Validation des données
        errors = []
        
        # Validation du nom et prénom
        if not nom or not prenom:
            errors.append("Le nom et le prénom sont obligatoires.")
        elif len(nom) < 2 or len(prenom) < 2:
            errors.append("Le nom et le prénom doivent contenir au moins 2 caractères.")
        
        # Validation de l'email
        try:
            validate_email(email)
            # Vérifier si l'email existe déjà pour un autre utilisateur
            if Utilisateur.objects.filter(email=email).exclude(id=user.id).exists():
                errors.append("Cette adresse email est déjà utilisée par un autre compte.")
        except ValidationError:
            errors.append("L'adresse email n'est pas valide.")
        
        # Validation du téléphone
        if not telephone:
            errors.append("Le numéro de téléphone est obligatoire.")
        elif not re.match(r'^\+?\d{9,15}$', telephone):
            errors.append("Le format du numéro de téléphone n'est pas valide.")
        
        # Si des erreurs sont trouvées, les afficher et ne pas sauvegarder
        if errors:
            for error in errors:
                messages.error(request, error)
            return redirect('utilisateur:mon_profil')
        
        # Mise à jour des informations
        try:
            user.nom = nom
            user.prenom = prenom
            user.email = email
            user.telephone = telephone
            
            # Gestion de la photo de profil
            if 'photo' in request.FILES:
                photo = request.FILES['photo']
                # Vérifier le type de fichier
                if not photo.content_type.startswith('image/'):
                    messages.error(request, 'Le fichier doit être une image.')
                    return redirect('utilisateur:mon_profil')
                # Vérifier la taille du fichier (max 2MB)
                if photo.size > 2 * 1024 * 1024:
                    messages.error(request, 'L\'image ne doit pas dépasser 2MB.')
                    return redirect('utilisateur:mon_profil')
                user.photo = photo
            
            user.save()
            messages.success(request, 'Votre profil a été mis à jour avec succès.')
        except Exception as e:
            messages.error(request, f'Une erreur est survenue lors de la mise à jour du profil: {str(e)}')
        
        return redirect('utilisateur:mon_profil')
    
    return render(request, 'utilisateur/mon_profil.html', {'user': user})

def mes_commandes(request):
    if 'user_id' not in request.session:
        messages.error(request, "Vous devez être connecté pour accéder à cette page.")
        return redirect('acceil:login')
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        
        # Récupérer les paramètres de filtrage
        status_filter = request.GET.get('status', '')
        period_filter = request.GET.get('period', '')
        price_filter = request.GET.get('price', '')
        type_filter = request.GET.get('type', '')
        
        # Base queryset
        commandes = Commande.objects.filter(client=utilisateur).select_related('produit', 'atelier')
        
        # Appliquer le filtre de statut
        if status_filter:
            if status_filter == 'en-cours':
                commandes = commandes.filter(status='en_cours')
            elif status_filter == 'terminee':
                commandes = commandes.filter(status='termine')
            elif status_filter == 'en-attente':
                commandes = commandes.filter(status='en_attente')
            elif status_filter == 'recupere':
                commandes = commandes.filter(status='recupere')
        
        # Appliquer le filtre de période
        if period_filter:
            today = timezone.now().date()
            if period_filter == 'this-month':
                start_of_month = today.replace(day=1)
                if today.month == 12:
                    end_of_month = today.replace(year=today.year + 1, month=1, day=1) - timezone.timedelta(days=1)
                else:
                    end_of_month = today.replace(month=today.month + 1, day=1) - timezone.timedelta(days=1)
                commandes = commandes.filter(date_creation__date__range=[start_of_month, end_of_month])
            elif period_filter == 'last-month':
                if today.month == 1:
                    start_of_month = today.replace(year=today.year - 1, month=12, day=1)
                else:
                    start_of_month = today.replace(month=today.month - 1, day=1)
                end_of_month = today.replace(day=1) - timezone.timedelta(days=1)
                commandes = commandes.filter(date_creation__date__range=[start_of_month, end_of_month])
            elif period_filter == 'last-3-months':
                three_months_ago = today - timezone.timedelta(days=90)
                commandes = commandes.filter(date_creation__date__gte=three_months_ago)
        
        # Appliquer le filtre de prix
        if price_filter:
            if price_filter == '0-25000':
                commandes = commandes.filter(produit__prix__lte=25000)
            elif price_filter == '25000-50000':
                commandes = commandes.filter(produit__prix__gt=25000, produit__prix__lte=50000)
            elif price_filter == '50000+':
                commandes = commandes.filter(produit__prix__gt=50000)
        
        # Appliquer le filtre de type (catégorie de produit)
        if type_filter:
            commandes = commandes.filter(produit__categorie=type_filter)
        
        # Trier par date de création (plus récent en premier)
        commandes = commandes.order_by('-date_creation')
        
        # Pagination
        page = request.GET.get('page', 1)
        paginator = Paginator(commandes, 10)  # 10 commandes par page
        
        try:
            commandes_page = paginator.page(page)
        except PageNotAnInteger:
            commandes_page = paginator.page(1)
        except EmptyPage:
            commandes_page = paginator.page(paginator.num_pages)
        
        # Compter les commandes actives (en cours + en attente)
        commandes_actives = Commande.objects.filter(
            client=utilisateur,
            status__in=['en_cours', 'en_attente']
        ).count()
        
        # Calculer la progression pour chaque commande
        for commande in commandes_page:
            # Calculer la progression basée sur le statut et la date d'échéance
            if commande.status == 'en_attente':
                commande.progression = 20
                commande.progression_text = "Commande en attente de traitement"
                commande.progression_color = "#ffc107"  # Jaune
                commande.progression_class = "progress-warning"
            elif commande.status == 'en_cours':
                # Calculer la progression basée sur le temps écoulé depuis la création
                if commande.date_echeance:
                    # Si une date d'échéance est définie, calculer la progression temporelle
                    today = timezone.now().date()
                    total_days = (commande.date_echeance - commande.date_creation.date()).days
                    elapsed_days = (today - commande.date_creation.date()).days
                    
                    if total_days > 0:
                        # Progression basée sur le temps écoulé (entre 30% et 80%)
                        time_progress = min(max((elapsed_days / total_days) * 50 + 30, 30), 80)
                        commande.progression = int(time_progress)
                    else:
                        commande.progression = 50
                else:
                    # Pas de date d'échéance, progression fixe
                    commande.progression = 50
                
                commande.progression_text = "Commande en cours de réalisation"
                commande.progression_color = "#E17921"  # Orange
                commande.progression_class = "progress-primary"
                
            elif commande.status == 'termine':
                commande.progression = 90
                commande.progression_text = "Commande terminée, prête pour récupération"
                commande.progression_color = "#28a745"  # Vert
                commande.progression_class = "progress-success"
            elif commande.status == 'recupere':
                commande.progression = 100
                commande.progression_text = "Commande récupérée"
                commande.progression_color = "#17a2b8"  # Bleu
                commande.progression_class = "progress-info"
            else:
                commande.progression = 0
                commande.progression_text = "Statut inconnu"
                commande.progression_color = "#6c757d"  # Gris
                commande.progression_class = "progress-secondary"
            
            # Ajouter des informations supplémentaires pour le modal
            commande.jours_restants = None
            commande.jours_restants_abs = None
            commande.retard = False
            
            if commande.date_echeance:
                today = timezone.now().date()
                jours_restants = (commande.date_echeance - today).days
                commande.jours_restants = jours_restants
                commande.jours_restants_abs = abs(jours_restants)
                commande.retard = jours_restants < 0
                
                # Ajuster la progression si en retard
                if commande.retard and commande.status == 'en_cours':
                    commande.progression = min(commande.progression, 70)  # Limiter à 70% si en retard
                    commande.progression_text = f"Commande en cours (en retard de {commande.jours_restants_abs} jours)"
                    commande.progression_color = "#dc3545"  # Rouge pour retard
                    commande.progression_class = "progress-danger"
            
            # Ajouter des informations sur l'atelier
            commande.atelier_contact = {
                'nom': commande.atelier.nom_atelier,
                'telephone': commande.atelier.utilisateur.telephone if commande.atelier.utilisateur else '',
                'email': commande.atelier.utilisateur.email if commande.atelier.utilisateur else '',
                'adresse': getattr(commande.atelier, 'adresse', 'Non disponible')
            }
            
            # S'assurer que toutes les propriétés ont des valeurs par défaut
            if not hasattr(commande, 'progression_text') or not commande.progression_text:
                commande.progression_text = f"{commande.progression}% complété"
            if not hasattr(commande, 'progression_color') or not commande.progression_color:
                commande.progression_color = "#E17921"
            if not hasattr(commande, 'progression_class') or not commande.progression_class:
                commande.progression_class = "progress-primary"
            if not hasattr(commande, 'jours_restants') or commande.jours_restants is None:
                commande.jours_restants = ''
            if not hasattr(commande, 'retard'):
                commande.retard = False
        
        context = {
            'utilisateur': utilisateur,
            'commandes': commandes_page,
            'commandes_actives': commandes_actives,
            'current_status': status_filter,
            'current_period': period_filter,
            'current_price': price_filter,
            'current_type': type_filter,
            'paginator': paginator,
        }
        return render(request, 'utilisateur/mes_commandes.html', context)
    except Utilisateur.DoesNotExist:
        messages.error(request, "Utilisateur non trouvé.")
        return redirect('acceil:login')

def mes_mesures(request):
    if 'user_id' not in request.session:
        messages.error(request, "Vous devez être connecté pour accéder à cette page.")
        return redirect('acceil:login')
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        # Récupérer les mesures de l'utilisateur
        mesures = Mesure.objects.filter(utilisateur=utilisateur).order_by('-date_modification').first()
        
        # Si aucune mesure n'existe, créer un objet Mesure vide avec des valeurs par défaut
        if not mesures:
            mesures = Mesure(
                utilisateur=utilisateur,
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
        
        context = {
            'utilisateur': utilisateur,
            'mesures': mesures,
        }
        return render(request, 'utilisateur/mes_mesures.html', context)
    except Utilisateur.DoesNotExist:
        messages.error(request, "Utilisateur non trouvé.")
        return redirect('acceil:login')

def mes_rendez_vous(request):
    if 'user_id' not in request.session:
        messages.error(request, "Vous devez être connecté pour accéder à cette page.")
        return redirect('acceil:login')
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        # Récupérer les paramètres de filtrage
        status_filter = request.GET.get('status', '')
        period_filter = request.GET.get('period', '')
        
        # Base queryset
        rendez_vous = RendezVous.objects.filter(client=utilisateur)
        
        # Appliquer le filtre de statut
        if status_filter:
            if status_filter == 'upcoming':
                rendez_vous = rendez_vous.filter(status='en_attente')
            elif status_filter == 'completed':
                rendez_vous = rendez_vous.filter(status='confirme')
            elif status_filter == 'cancelled':
                rendez_vous = rendez_vous.filter(status='annule')
        
        # Appliquer le filtre de période
        if period_filter:
            today = timezone.now().date()
            if period_filter == 'today':
                rendez_vous = rendez_vous.filter(date=today)
            elif period_filter == 'this-week':
                start_of_week = today - timezone.timedelta(days=today.weekday())
                end_of_week = start_of_week + timezone.timedelta(days=6)
                rendez_vous = rendez_vous.filter(date__range=[start_of_week, end_of_week])
            elif period_filter == 'this-month':
                start_of_month = today.replace(day=1)
                if today.month == 12:
                    end_of_month = today.replace(year=today.year + 1, month=1, day=1) - timezone.timedelta(days=1)
                else:
                    end_of_month = today.replace(month=today.month + 1, day=1) - timezone.timedelta(days=1)
                rendez_vous = rendez_vous.filter(date__range=[start_of_month, end_of_month])
        
        # Trier par date et heure
        rendez_vous = rendez_vous.order_by('date', 'heure')

        # Pagination
        page = request.GET.get('page', 1)
        paginator = Paginator(rendez_vous, 10)  # 10 rendez-vous par page
        
        try:
            rendez_vous_page = paginator.page(page)
        except PageNotAnInteger:
            rendez_vous_page = paginator.page(1)
        except EmptyPage:
            rendez_vous_page = paginator.page(paginator.num_pages)
        
        context = {
            'utilisateur': utilisateur,
            'rendez_vous': rendez_vous_page,
            'current_status': status_filter,
            'current_period': period_filter,
            'paginator': paginator,
        }
        return render(request, 'utilisateur/mes_rendez_vous.html', context)
    except Utilisateur.DoesNotExist:
        messages.error(request, "Utilisateur non trouvé.")
        return redirect('acceil:login')

@require_POST
def modifier_mesure(request):
    if 'user_id' not in request.session:
        return JsonResponse({'status': 'error', 'message': 'Vous devez être connecté pour modifier vos mesures'}, status=401)
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        mesure_type = request.POST.get('type')
        valeur = request.POST.get('value')
        
        # Debug: Afficher les valeurs reçues
        print(f"Type de mesure reçu: {mesure_type}")
        print(f"Valeur reçue: {valeur}")
        
        if not mesure_type:
            return JsonResponse({
                'status': 'error',
                'message': 'Le type de mesure est manquant'
            }, status=400)
            
        if not valeur:
            return JsonResponse({
                'status': 'error',
                'message': 'La valeur de la mesure est manquante'
            }, status=400)
        
        # Validation de la valeur
        try:
            valeur = Decimal(valeur)
            if valeur < 0:
                return JsonResponse({
                    'status': 'error',
                    'message': 'La mesure ne peut pas être négative'
                }, status=400)
            if valeur > 300:  # Limite raisonnable pour des mesures en cm
                return JsonResponse({
                    'status': 'error',
                    'message': 'La mesure ne peut pas dépasser 300 cm'
                }, status=400)
        except (ValueError, TypeError) as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Veuillez entrer une valeur numérique valide: {str(e)}'
            }, status=400)
        
        # Récupérer ou créer les mesures de l'utilisateur
        mesures, created = Mesure.objects.get_or_create(
            utilisateur=utilisateur,
            defaults={
                'tour_poitrine': 0,
                'tour_taille': 0,
                'tour_hanches': 0,
                'longueur_epaule': 0,
                'hauteur_epaule': 0,
                'longueur_buste': 0,
                'longueur_bras': 0,
                'tour_biceps': 0,
                'tour_poignet': 0,
                'longueur_epaule_coude': 0,
                'longueur_jambe': 0,
                'entrejambe': 0,
                'tour_cuisse': 0,
                'tour_genou': 0,
                'tour_mollet': 0,
                'tour_cheville': 0,
                'tour_cou': 0,
                'hauteur_dos': 0,
                'carrure_dos': 0,
                'largeur_epaules': 0
            }
        )
        
        # Vérifier si le type de mesure existe
        if not hasattr(mesures, mesure_type):
            return JsonResponse({
                'status': 'error',
                'message': f'Type de mesure non reconnu: {mesure_type}'
            }, status=400)
        
        # Vérifier si la valeur a changé
        ancienne_valeur = getattr(mesures, mesure_type)
        if ancienne_valeur == valeur:
            return JsonResponse({
                'status': 'info',
                'message': 'La mesure n\'a pas été modifiée',
                'value': str(valeur)
            })
        
        # Mettre à jour la mesure
        setattr(mesures, mesure_type, valeur)
        mesures.save()
        
        # Enregistrer l'historique des modifications
        messages.success(request, f"La mesure a été mise à jour avec succès")
        
        return JsonResponse({
            'status': 'success',
            'message': 'Mesure mise à jour avec succès',
            'value': str(valeur),
            'ancienne_valeur': str(ancienne_valeur)
        })
            
    except Utilisateur.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Utilisateur non trouvé'
        }, status=404)
    except Exception as e:
        print(f"Erreur lors de la modification de la mesure: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': f'Une erreur est survenue lors de la modification de la mesure: {str(e)}'
        }, status=500)

@require_POST
def annuler_rendez_vous(request, rdv_id):
    if 'user_id' not in request.session:
        return JsonResponse({'status': 'error', 'message': 'Vous devez être connecté pour effectuer cette action.'}, status=401)
    
    try:
        rdv = RendezVous.objects.get(id=rdv_id, client_id=request.session['user_id'])
        if rdv.status != 'en_attente':
            return JsonResponse({'status': 'error', 'message': 'Ce rendez-vous ne peut plus être annulé.'}, status=400)
        
        rdv.status = 'annule'
        rdv.save()
        return JsonResponse({'status': 'success', 'message': 'Rendez-vous annulé avec succès.'})
    except RendezVous.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Rendez-vous non trouvé.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_POST
def supprimer_rendez_vous(request, rdv_id):
    if 'user_id' not in request.session:
        return JsonResponse({'status': 'error', 'message': 'Vous devez être connecté pour effectuer cette action.'}, status=401)
    
    try:
        rdv = RendezVous.objects.get(id=rdv_id, client_id=request.session['user_id'])
        rdv.delete()
        return JsonResponse({'status': 'success', 'message': 'Rendez-vous supprimé avec succès.'})
    except RendezVous.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Rendez-vous non trouvé.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@require_POST
def annuler_commande(request, commande_id):
    if 'user_id' not in request.session:
        return JsonResponse({'status': 'error', 'message': 'Vous devez être connecté pour effectuer cette action.'}, status=401)
    
    try:
        commande = Commande.objects.get(id=commande_id, client_id=request.session['user_id'])
        
        # Vérifier que la commande peut être annulée (seulement en attente)
        if commande.status != 'en_attente':
            return JsonResponse({
                'status': 'error', 
                'message': 'Cette commande ne peut plus être annulée car elle est déjà en cours de traitement.'
            }, status=400)
        
        # Supprimer la commande
        commande.delete()
        
        messages.success(request, 'Votre commande a été annulée avec succès.')
        return JsonResponse({
            'status': 'success', 
            'message': 'Commande annulée avec succès.',
            'redirect_url': reverse('utilisateur:mes_commandes')
        })
        
    except Commande.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Commande non trouvée.'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error', 
            'message': f'Une erreur est survenue lors de l\'annulation: {str(e)}'
        }, status=500)

def telecharger_commande(request, commande_id):
    if 'user_id' not in request.session:
        return HttpResponse("Vous devez être connecté pour télécharger cette commande.", status=401, content_type='text/plain')
    
    try:
        # Vérifier que commande_id est un entier valide
        try:
            commande_id = int(commande_id)
        except (ValueError, TypeError):
            return HttpResponse("ID de commande invalide.", status=400, content_type='text/plain')
        
        # Récupérer la commande
        try:
            commande = Commande.objects.get(id=commande_id, client_id=request.session['user_id'])
        except Commande.DoesNotExist:
            return HttpResponse("Commande non trouvée.", status=404, content_type='text/plain')
        
        # Vérifier que la commande peut être téléchargée (seulement terminée)
        if commande.status != 'termine':
            return HttpResponse("Cette commande ne peut être téléchargée car elle n'est pas terminée.", status=400, content_type='text/plain')
        
        # Générer le PDF de la commande
        try:
            pdf_data = generate_commande_pdf(commande)
        except Exception as pdf_error:
            import traceback
            traceback.print_exc()
            return HttpResponse(f"Erreur lors de la génération du PDF: {str(pdf_error)}", status=500, content_type='text/plain')
        
        # Créer la réponse HTTP avec le PDF
        try:
            response = HttpResponse(pdf_data, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="commande_{commande.reference}.pdf"'
            response['Content-Length'] = len(pdf_data)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            
            return response
            
        except Exception as response_error:
            import traceback
            traceback.print_exc()
            return HttpResponse(f"Erreur lors de la création de la réponse: {str(response_error)}", status=500, content_type='text/plain')
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return HttpResponse(f"Une erreur est survenue lors de la génération du PDF: {str(e)}", status=500, content_type='text/plain')

def generate_commande_pdf(commande):
    """
    Génère un PDF détaillé pour une commande terminée
    """
    try:
        # Créer un buffer pour stocker le PDF
        buffer = BytesIO()
        
        # Créer le document PDF
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Styles pour le document
        styles = getSampleStyleSheet()
        
        # Style personnalisé pour le titre principal
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1,  # Centré
            textColor=colors.HexColor('#E17921')
        )
        
        # Style pour les sous-titres
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.HexColor('#9C4506')
        )
        
        # Style pour le texte normal
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=6
        )
        
        # Style pour les informations importantes
        info_style = ParagraphStyle(
            'CustomInfo',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=4,
            leftIndent=20
        )
        
        # Contenu du document
        story = []
        
        # En-tête avec logo et titre
        story.append(Paragraph("Couture Hub", title_style))
        story.append(Paragraph("Reçu de commande", subtitle_style))
        story.append(Spacer(1, 20))
        
        # Informations de la commande
        story.append(Paragraph("Informations de la commande", subtitle_style))
        
        # Tableau des informations principales
        commande_data = [
            ['Référence:', commande.reference],
            ['Date de création:', commande.date_creation.strftime('%d/%m/%Y')],
            ['Statut:', 'Terminée'],
            ['Date de finalisation:', timezone.now().strftime('%d/%m/%Y')],
        ]
        
        commande_table = Table(commande_data, colWidths=[2*inch, 4*inch])
        commande_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E17921')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ]))
        
        story.append(commande_table)
        story.append(Spacer(1, 20))
        
        # Informations du client (supprimée pour la compacité)
        # story.append(Paragraph("Informations du client", subtitle_style))
        # client_data = [
        #     ['Nom complet:', f"{commande.client.prenom} {commande.client.nom}"],
        #     ['Email:', commande.client.email],
        #     ['Téléphone:', commande.client.telephone],
        # ]
        # 
        # client_table = Table(client_data, colWidths=[2*inch, 4*inch])
        # client_table.setStyle(TableStyle([
        #     ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
        #     ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        #     ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        #     ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        #     ('FONTSIZE', (0, 0), (-1, -1), 11),
        #     ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        #     ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E17921')),
        #     ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        # ]))
        # 
        # story.append(client_table)
        # story.append(Spacer(1, 20))
        
        # Informations du produit
        story.append(Paragraph("Détails du produit", subtitle_style))
        produit_data = [
            ['Produit:', commande.produit.nom],
            ['Catégorie:', commande.produit.categorie],
            ['Description:', commande.produit.description],
            ['Prix:', f"{commande.produit.prix:,} XOF"],
        ]
        
        produit_table = Table(produit_data, colWidths=[2*inch, 4*inch])
        produit_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E17921')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ]))
        
        story.append(produit_table)
        story.append(Spacer(1, 20))
        
        # Ajouter le QR code pour le produit
        try:
            qr_data = f"Commande: {commande.reference}\nProduit: {commande.produit.nom}\nPrix: {commande.produit.prix} XOF\nAtelier: {commande.atelier.nom_atelier}"
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            img = qr.make_image(image_factory=PilImage).convert('RGB')
            
            # Convertir l'image PIL en un format utilisable par ReportLab (PNG)
            img_buffer = BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            # Créer l'objet Image pour ReportLab et l'ajouter à l'histoire
            rl_image = Image(img_buffer, width=1.5*inch, height=1.5*inch)
            story.append(Spacer(1, 15))
            story.append(Paragraph("QR Code de la commande", normal_style))
            story.append(rl_image)
            story.append(Spacer(1, 30))
            
        except Exception as qr_error:
            # Gérer les erreurs de génération de QR code sans bloquer le PDF
            print(f"Erreur lors de la génération du QR code: {qr_error}")
            story.append(Paragraph("QR Code non disponible", normal_style))
            story.append(Spacer(1, 20))

        # Informations de l'atelier
        # story.append(Paragraph("Informations de l'atelier", subtitle_style))
        
        # Récupérer les informations de l'atelier de manière sécurisée
        atelier_telephone = 'Non disponible'
        atelier_email = 'Non disponible'
        
        try:
            if hasattr(commande.atelier, 'utilisateur') and commande.atelier.utilisateur:
                atelier_telephone = commande.atelier.utilisateur.telephone or 'Non disponible'
                atelier_email = commande.atelier.utilisateur.email or 'Non disponible'
        except Exception as e:
            pass # Ne pas logguer les erreurs ici, car elles peuvent être normales si les champs n'existent pas
        
        atelier_data = [
            ['Atelier:', commande.atelier.nom_atelier],
            ['Adresse:', getattr(commande.atelier, 'adresse', 'Non disponible')],
            ['Téléphone:', atelier_telephone],
            ['Email:', atelier_email],
        ]
        
        # atelier_table = Table(atelier_data, colWidths=[2*inch, 4*inch])
        # atelier_table.setStyle(TableStyle([
        #     ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8F9FA')),
        #     ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        #     ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        #     ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        #     ('FONTSIZE', (0, 0), (-1, -1), 11),
        #     ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        #     ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E17921')),
        #     ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        # ]))
        
        # story.append(atelier_table)
        # story.append(Spacer(1, 30))
        
        # Résumé et remerciements
        # story.append(Paragraph("Résumé de la commande", subtitle_style))
        # story.append(Paragraph(f"Votre commande {commande.reference} a été réalisée avec succès par l'atelier {commande.atelier.nom_atelier}.", normal_style))
        # story.append(Paragraph("Merci de votre confiance et à bientôt sur Couture Hub !", normal_style))
        
        # Pied de page
        story.append(Spacer(1, 40))
        story.append(Paragraph("© 2025 Couture Hub - Tous droits réservés", info_style))
        story.append(Paragraph("Ce document est généré automatiquement et fait foi de la réalisation de votre commande.", info_style))
        
        # Construire le PDF
        doc.build(story)
        
        # Récupérer les données du PDF
        pdf_data = buffer.getvalue()
        buffer.close()
        
        return pdf_data
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
