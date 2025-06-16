from django.shortcuts import render, redirect
from django.contrib import messages
from acceil.models import Utilisateur, Atelier
from atelier.models import Produit, RendezVous, Photo, Service
from commande.models import Commande
from utilisateur.models import Mesure
from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import JsonResponse
from django.db.models import Q, Sum, Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from datetime import datetime, timedelta
from django.db.models.functions import ExtractMonth
from django.contrib.auth import logout
from acceil.views import deconnexion

# Create your views here.
def calendar(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
    atelier = Atelier.objects.get(utilisateur=utilisateur)
    
    # Récupération des rendez-vous
    rendez_vous = RendezVous.objects.filter(atelier=atelier).order_by('date', 'heure')
    
    # Filtres
    status = request.GET.get('status')
    if status and status != 'all':
        rendez_vous = rendez_vous.filter(status=status)
    
    search_query = request.GET.get('search')
    if search_query:
        rendez_vous = rendez_vous.filter(
            Q(client__nom__icontains=search_query) |
            Q(client__prenom__icontains=search_query) |
            Q(service__nom__icontains=search_query)
        )
    
    # Pagination
    page = request.GET.get('page', 1)
    paginator = Paginator(rendez_vous, 10)  # 10 rendez-vous par page
    
    try:
        rendez_vous = paginator.page(page)
    except PageNotAnInteger:
        rendez_vous = paginator.page(1)
    except EmptyPage:
        rendez_vous = paginator.page(paginator.num_pages)
    
    # Statistiques
    stats = {
        'total': RendezVous.objects.filter(atelier=atelier).count(),
        'en_attente': RendezVous.objects.filter(atelier=atelier, status='en_attente').count(),
        'confirme': RendezVous.objects.filter(atelier=atelier, status='confirme').count(),
        'annule': RendezVous.objects.filter(atelier=atelier, status='annule').count(),
        'aujourdhui': RendezVous.objects.filter(atelier=atelier, date=timezone.now().date()).count()
    }
    
    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        try:
            if action == 'change_status':
                rdv_id = request.POST.get('rdv_id')
                new_status = request.POST.get('status')
                
                if not rdv_id or not new_status:
                    raise ValidationError('Données manquantes')
                
                rdv = RendezVous.objects.get(id=rdv_id, atelier=atelier)
                old_status = rdv.status
                rdv.status = new_status
                rdv.save()
                
                # Message de succès avec l'ancien et le nouveau statut
                status_messages = {
                    'en_attente': 'en attente',
                    'confirme': 'confirmé',
                    'annule': 'annulé'
                }
                message = f'Statut changé de {status_messages[old_status]} à {status_messages[new_status]}'
                
                if is_ajax:
                    return JsonResponse({
                        'success': True,
                        'message': message,
                        'new_status': new_status,
                        'status_display': status_messages[new_status]
                    })
                messages.success(request, message)
            
            elif action == 'delete':
                try:
                    rdv_id = request.POST.get('rdv_id')
                    if not rdv_id:
                        raise ValidationError('ID de rendez-vous manquant')
                    
                    # Vérification que l'ID est un nombre valide
                    try:
                        rdv_id = int(rdv_id)
                    except ValueError:
                        raise ValidationError('ID de rendez-vous invalide')
                    
                    # Récupération du rendez-vous avec vérification de l'atelier
                    rdv = RendezVous.objects.get(id=rdv_id, atelier=atelier)
                    
                    # Sauvegarde des informations avant suppression
                    client_name = f"{rdv.client.prenom} {rdv.client.nom}"
                    service_name = rdv.service.nom
                    
                    # Suppression du rendez-vous
                    rdv.delete()
                    
                    message = f'Rendez-vous de {client_name} pour {service_name} supprimé avec succès'
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': message
                        })
                    messages.success(request, message)
                
                except RendezVous.DoesNotExist:
                    error_msg = 'Rendez-vous non trouvé'
                    if is_ajax:
                        return JsonResponse({
                            'success': False,
                            'message': error_msg
                        })
                    messages.error(request, error_msg)
                
                except ValidationError as e:
                    if is_ajax:
                        return JsonResponse({
                            'success': False,
                            'message': str(e)
                        })
                    messages.error(request, str(e))
                
                except Exception as e:
                    error_msg = f'Une erreur est survenue lors de la suppression : {str(e)}'
                    if is_ajax:
                        return JsonResponse({
                            'success': False,
                            'message': error_msg
                        })
                    messages.error(request, error_msg)
        
        except ValidationError as e:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': str(e)
                })
            messages.error(request, str(e))
        
        except RendezVous.DoesNotExist:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': 'Rendez-vous non trouvé'
                })
            messages.error(request, 'Rendez-vous non trouvé')
        
        except Exception as e:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': f'Une erreur est survenue : {str(e)}'
                })
            messages.error(request, f'Une erreur est survenue : {str(e)}')
    
    context = {
        'utilisateur': utilisateur,
        'atelier': atelier,
        'rendez_vous': rendez_vous,
        'stats': stats,
        'current_status': status,
        'current_search': search_query,
        'paginator': paginator,
        'page_obj': rendez_vous
    }
    return render(request, 'administration/calendar.html', context)


def dashboard(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')

    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')

    try:
        utilisateur = Utilisateur.objects.select_related('atelier').get(id=request.session['user_id'])
        atelier = utilisateur.atelier
    except (Utilisateur.DoesNotExist, Atelier.DoesNotExist):
        messages.error(request, 'Utilisateur ou atelier non trouvé.')
        return redirect('acceil:connexion')

    # Calcul des statistiques pour le tableau de bord
    total_commandes = Commande.objects.filter(produit__atelier=atelier).count()
    commandes_recuperees = Commande.objects.filter(produit__atelier=atelier, status='recupere')
    chiffre_affaires_recupere = sum(commande.produit.prix for commande in commandes_recuperees if commande.produit)
    total_rendez_vous = RendezVous.objects.filter(atelier=atelier).count()
    
    # Tâches basées sur les commandes et rendez-vous
    commandes_a_valider = Commande.objects.filter(produit__atelier=atelier, status='en_attente').count()
    
    # Commandes en retard: date d'échéance passée et non terminées/récupérées
    commandes_en_retard = Commande.objects.filter(
        produit__atelier=atelier,
        date_echeance__lt=timezone.now().date(),
    ).exclude(status='termine').exclude(status='recupere').count()
    
    rendez_vous_aujourdhui = RendezVous.objects.filter(atelier=atelier, date=timezone.now().date()).count()

    # Récupération des 4 dernières commandes pour l'atelier
    recent_orders = Commande.objects.filter(produit__atelier=atelier).order_by('-date_creation')[:4]

    # Statistiques pour le graphique de répartition des commandes par statut
    commandes_par_statut = {
        'en_attente': Commande.objects.filter(produit__atelier=atelier, status='en_attente').count(),
        'en_cours': Commande.objects.filter(produit__atelier=atelier, status='en_cours').count(),
        'termine': Commande.objects.filter(produit__atelier=atelier, status='termine').count() + Commande.objects.filter(produit__atelier=atelier, status='recupere').count(),
        # Vous pouvez ajouter d'autres statuts si nécessaire, ou une catégorie 'Autres'
    }

    # Chiffre d'affaires par mois pour le graphique
    revenue_par_mois_data = Commande.objects.filter(
        produit__atelier=atelier
    ).filter(
        Q(status='termine') | Q(status='recupere')
    ).annotate(month=ExtractMonth('date_creation')).values('month').annotate(total_revenue=Sum('produit__prix')).order_by('month')

    # Formater les données pour le JS (ex: {'01': 1200, '02': 1500})
    formatted_revenue_data = {item['month']: float(item['total_revenue']) for item in revenue_par_mois_data}
    
    # Générer une liste complète de mois pour les labels du graphique (par ex., 12 derniers mois)
    labels_mois = []
    data_revenue = []
    current_date = datetime.now()
    for i in range(6, -1, -1): # Pour les 7 derniers mois, incluant le mois actuel
        date_iter = current_date - timedelta(days=30*i)
        month_key = date_iter.strftime('%m')
        label_month = date_iter.strftime('%b') # Ex: Jan, Fév
        labels_mois.append(label_month)
        data_revenue.append(formatted_revenue_data.get(month_key, 0.0))

    context = {
        'utilisateur': utilisateur,
        'atelier': atelier,
        'stats': {
            'chiffre_affaires_recupere': chiffre_affaires_recupere,
            'total_commandes': total_commandes,
            'total_rendez_vous': total_rendez_vous,
            'nouveaux_clients': 0, # Placeholder, à implémenter si le champ date_creation existe pour les clients
            'commandes_a_valider': commandes_a_valider,
            'commandes_en_retard': commandes_en_retard,
            'rendez_vous_aujourdhui': rendez_vous_aujourdhui,
            'commandes_par_statut': commandes_par_statut,
            'labels_mois_revenue': labels_mois,
            'data_revenue_chart': data_revenue,
        },
        'recent_orders': recent_orders,
    }
    return render(request, 'administration/index.html', context)

def models(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
    atelier = Atelier.objects.get(utilisateur=utilisateur)
    
    # Récupération des produits avec filtres
    produits = Produit.objects.filter(atelier=atelier)
    
    # Filtre par catégorie
    categorie = request.GET.get('categorie')
    if categorie and categorie != 'all':
        produits = produits.filter(categorie=categorie)
    
    # Filtre par recherche
    search_query = request.GET.get('search')
    if search_query:
        produits = produits.filter(
            Q(nom__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    # Tri des produits
    sort_by = request.GET.get('sort', '-date_ajout')
    produits = produits.order_by(sort_by)
    
    # Pagination
    rows_per_page = int(request.GET.get('rows_per_page', 12))
    page = request.GET.get('page', 1)
    
    paginator = Paginator(produits, rows_per_page)
    try:
        produits_pagines = paginator.page(page)
    except PageNotAnInteger:
        produits_pagines = paginator.page(1)
    except EmptyPage:
        produits_pagines = paginator.page(paginator.num_pages)
    
    # Calcul des informations de pagination
    total_pages = paginator.num_pages
    current_page = produits_pagines.number
    has_previous = produits_pagines.has_previous()
    has_next = produits_pagines.has_next()
    
    # Statistiques pour le tableau de bord
    stats = {
        'total': produits.count(),
        'par_categorie': {
            'femmes': produits.filter(categorie='femmes').count(),
            'hommes': produits.filter(categorie='hommes').count(),
            'enfants': produits.filter(categorie='enfants').count(),
        }
    }
    
    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'add':
            try:
                with transaction.atomic():
                    produit = Produit.objects.create(
                        atelier=atelier,
                        nom=request.POST.get('nom'),
                        categorie=request.POST.get('categorie'),
                        prix=request.POST.get('prix'),
                        description=request.POST.get('description', '')
                    )
                    if 'photo' in request.FILES:
                        produit.photo = request.FILES['photo']
                        produit.save()
                
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': True,
                        'message': 'Produit ajouté avec succès',
                        'redirect': f'?page={total_pages}&rows_per_page={rows_per_page}'
                    })
                messages.success(request, 'Produit ajouté avec succès')
                return redirect(f'?page={total_pages}&rows_per_page={rows_per_page}')
            except Exception as e:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': str(e)
                    })
                messages.error(request, f'Erreur lors de l\'ajout du produit: {str(e)}')
        
        elif action == 'edit':
            try:
                produit_id = request.POST.get('produit_id')
                produit = Produit.objects.get(id=produit_id, atelier=atelier)
                
                with transaction.atomic():
                    # Mise à jour des champs
                    produit.nom = request.POST.get('nom', produit.nom)
                    produit.categorie = request.POST.get('categorie', produit.categorie)
                    produit.prix = request.POST.get('prix', produit.prix)
                    produit.description = request.POST.get('description', produit.description)
                    
                    # Gestion de l'image
                    if 'photo' in request.FILES:
                        # Supprimer l'ancienne image si elle existe
                        if produit.photo:
                            produit.photo.delete()
                        produit.photo = request.FILES['photo']
                    
                    produit.save()
                
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': True,
                        'message': 'Modèle modifié avec succès',
                        'produit': {
                            'id': produit.id,
                            'nom': produit.nom,
                            'categorie': produit.categorie,
                            'prix': str(produit.prix),
                            'description': produit.description,
                            'photo_url': produit.photo.url if produit.photo else None
                        }
                    })
                messages.success(request, 'Modèle modifié avec succès')
            except Produit.DoesNotExist:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': 'Modèle non trouvé'
                    })
                messages.error(request, 'Modèle non trouvé')
            except Exception as e:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': str(e)
                    })
                messages.error(request, f'Erreur lors de la modification du modèle: {str(e)}')
        
        elif action == 'delete':
            try:
                produit_id = request.POST.get('produit_id')
                produit = Produit.objects.get(id=produit_id, atelier=atelier)
                produit.delete()
                
                # Vérifier si la page courante est vide après suppression
                if len(produits_pagines) == 1 and current_page > 1:
                    page = current_page - 1
                
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': True,
                        'message': 'Produit supprimé avec succès',
                        'redirect': f'?page={page}&rows_per_page={rows_per_page}'
                    })
                messages.success(request, 'Produit supprimé avec succès')
                return redirect(f'?page={page}&rows_per_page={rows_per_page}')
            except Produit.DoesNotExist:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': 'Produit non trouvé'
                    })
                messages.error(request, 'Produit non trouvé')
            except Exception as e:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': str(e)
                    })
                messages.error(request, f'Erreur lors de la suppression du produit: {str(e)}')
        
        elif action == 'get_details':
            try:
                produit_id = request.POST.get('produit_id')
                produit = Produit.objects.get(id=produit_id, atelier=atelier)
                
                return JsonResponse({
                    'success': True,
                    'produit': {
                        'id': produit.id,
                        'nom': produit.nom,
                        'categorie': produit.categorie,
                        'prix': str(produit.prix),
                        'description': produit.description,
                        'photo_url': produit.photo.url if produit.photo else None,
                        'date_ajout': produit.date_ajout.strftime('%d/%m/%Y')
                    }
                })
            except Produit.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Produit non trouvé'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': str(e)
                })
    
    context = {
        'utilisateur': utilisateur,
        'atelier': atelier,
        'produits': produits_pagines,
        'stats': stats,
        'current_categorie': categorie,
        'current_search': search_query,
        'current_sort': sort_by,
        'pagination': {
            'current_page': current_page,
            'total_pages': total_pages,
            'has_previous': has_previous,
            'has_next': has_next,
            'rows_per_page': rows_per_page,
            'total_items': paginator.count,
            'page_range': range(1, total_pages + 1)
        }
    }
    
    return render(request, 'administration/models.html', context)

def ateliers(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    try:
        utilisateur = Utilisateur.objects.select_related('atelier').get(id=request.session['user_id'])
        atelier = utilisateur.atelier
    except (Utilisateur.DoesNotExist, Atelier.DoesNotExist):
        messages.error(request, 'Utilisateur ou atelier non trouvé.')
        return redirect('acceil:connexion')
    
    # Récupération optimisée des photos et services avec prefetch_related si nécessaire
    photos = atelier.photos.all().order_by('-date_ajout')
    services = atelier.services.all().order_by('nom')
    
    # Gestion des actions POST
    if request.method == 'POST':
        action = request.POST.get('action')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        try:
            if action == 'add_photo':
                with transaction.atomic():
                    if 'photo' not in request.FILES:
                        raise ValidationError('Veuillez sélectionner une photo')
                    
                    photo = request.FILES['photo']
                    # Validation du type de fichier
                    if not photo.content_type.startswith('image/'):
                        raise ValidationError('Le fichier doit être une image')
                    
                    # Validation de la taille (max 5MB)
                    if photo.size > 5 * 1024 * 1024:
                        raise ValidationError('L\'image ne doit pas dépasser 5MB')
                    
                    # Création de la photo
                    new_photo = Photo.objects.create(
                        atelier=atelier,
                        image=photo,
                        titre=request.POST.get('description', '').strip()
                    )
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Photo ajoutée avec succès',
                            'photo': {
                                'id': new_photo.id,
                                'url': new_photo.image.url if new_photo.image else None,
                                'description': new_photo.titre
                            }
                        })
                    messages.success(request, 'Photo ajoutée avec succès')
            
            elif action == 'delete_photo':
                with transaction.atomic():
                    photo_id = request.POST.get('photo_id')
                    if not photo_id:
                        raise ValidationError('ID de photo manquant')
                    
                    photo = Photo.objects.get(id=photo_id, atelier=atelier)
                    # Suppression du fichier physique
                    if photo.image:
                        try:
                            photo.image.delete(save=False)
                        except Exception as e:
                            print(f"Erreur lors de la suppression du fichier: {str(e)}")
                    photo.delete()
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Photo supprimée avec succès'
                        })
                    messages.success(request, 'Photo supprimée avec succès')
            
            elif action == 'add_service':
                with transaction.atomic():
                    nom = request.POST.get('nom', '').strip()
                    description = request.POST.get('description', '').strip()
                    prix = request.POST.get('prix')
                    
                    # Validations
                    if not nom:
                        raise ValidationError('Le nom du service est requis')
                    if not prix:
                        raise ValidationError('Le prix du service est requis')
                    
                    try:
                        prix = float(prix)
                        if prix <= 0:
                            raise ValidationError('Le prix doit être supérieur à 0')
                    except ValueError:
                        raise ValidationError('Le prix doit être un nombre valide')
                    
                    # Vérification si le service existe déjà (optimisation avec exists())
                    if Service.objects.filter(atelier=atelier, nom__iexact=nom).exists():
                        raise ValidationError('Un service avec ce nom existe déjà')
                    
                    # Création du service avec prix_minimum
                    new_service = Service.objects.create(
                        atelier=atelier,
                        nom=nom,
                        description=description,
                        prix_minimum=prix
                    )
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Service ajouté avec succès',
                            'service': {
                                'id': new_service.id,
                                'nom': new_service.nom,
                                'description': new_service.description,
                                'prix': str(new_service.prix_minimum)
                            }
                        })
                    messages.success(request, 'Service ajouté avec succès')
            
            elif action == 'delete_service':
                with transaction.atomic():
                    service_id = request.POST.get('service_id')
                    if not service_id:
                        raise ValidationError('ID de service manquant')
                    
                    service = Service.objects.get(id=service_id, atelier=atelier)
                    service.delete()
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Service supprimé avec succès'
                        })
                    messages.success(request, 'Service supprimé avec succès')
            
            else:
                raise ValidationError('Action non reconnue')
        
        except ValidationError as e:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': str(e)
                })
            messages.error(request, str(e))
        
        except Photo.DoesNotExist:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': 'Photo non trouvée'
                })
            messages.error(request, 'Photo non trouvée')
        
        except Service.DoesNotExist:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': 'Service non trouvé'
                })
            messages.error(request, 'Service non trouvé')
        
        except Exception as e:
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': f'Une erreur est survenue : {str(e)}'
                })
            messages.error(request, f'Une erreur est survenue : {str(e)}')
    
    context = {
        'utilisateur': utilisateur,
        'atelier': atelier,
        'photos': photos,
        'services': services
    }
    return render(request, 'administration/ateliers.html', context)



def orders(request):
    # Vérifier si l'utilisateur est connecté
    if 'user_id' not in request.session:
        messages.error(request, "Vous devez être connecté pour accéder à cette page.")
        return redirect('acceil:connexion')
    
    try:
        utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
        
        # Vérifier que l'utilisateur est un gérant d'atelier
        if utilisateur.role not in ['gerant', 'gérant']:
            messages.error(request, "Seuls les gérants d'atelier peuvent accéder à cette page.")
            return redirect('acceil:connexion')
        
        # Récupérer l'atelier de l'utilisateur
        try:
            atelier = Atelier.objects.get(utilisateur=utilisateur)
        except Atelier.DoesNotExist:
            messages.error(request, "Aucun atelier trouvé pour cet utilisateur.")
            return redirect('acceil:connexion')
        
        # Gestion des actions AJAX
        if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            action = request.POST.get('action')
            
            if action == 'get_details':
                commande_id = request.POST.get('commande_id')
                try:
                    # Filtrer par atelier pour la sécurité
                    commande = Commande.objects.select_related('client', 'produit').get(
                        id=commande_id, 
                        produit__atelier=atelier
                    )
                    
                    # Récupérer les mesures du client
                    mesures = None
                    if commande.client:
                        mesures = Mesure.objects.filter(utilisateur=commande.client).order_by('-date_modification').first()
                    
                    return JsonResponse({
                        'success': True,
                        'commande': {
                            'reference': commande.reference,
                            'date_creation': commande.date_creation.strftime('%d/%m/%Y'),
                            'date_echeance': commande.date_echeance.strftime('%d/%m/%Y') if commande.date_echeance else None,
                            'status': commande.status,
                            'client_nom': f"{commande.client.prenom} {commande.client.nom}" if commande.client else 'Non défini',
                            'produit_nom': commande.produit.nom if commande.produit else 'Non défini',
                            'montant': str(commande.produit.prix) if commande.produit else 'Non défini',
                            'mesures': {
                                'tour_poitrine': str(mesures.tour_poitrine) if mesures else 'Non définie',
                                'tour_taille': str(mesures.tour_taille) if mesures else 'Non définie',
                                'tour_hanches': str(mesures.tour_hanches) if mesures else 'Non définie',
                                'longueur_epaule': str(mesures.longueur_epaule) if mesures else 'Non définie',
                                'hauteur_epaule': str(mesures.hauteur_epaule) if mesures else 'Non définie',
                                'longueur_buste': str(mesures.longueur_buste) if mesures else 'Non définie',
                                'longueur_bras': str(mesures.longueur_bras) if mesures else 'Non définie',
                                'tour_biceps': str(mesures.tour_biceps) if mesures else 'Non définie',
                                'tour_poignet': str(mesures.tour_poignet) if mesures else 'Non définie',
                                'longueur_epaule_coude': str(mesures.longueur_epaule_coude) if mesures else 'Non définie',
                                'longueur_jambe': str(mesures.longueur_jambe) if mesures else 'Non définie',
                                'entrejambe': str(mesures.entrejambe) if mesures else 'Non définie',
                                'tour_cuisse': str(mesures.tour_cuisse) if mesures else 'Non définie',
                                'tour_genou': str(mesures.tour_genou) if mesures else 'Non définie',
                                'tour_mollet': str(mesures.tour_mollet) if mesures else 'Non définie',
                                'tour_cheville': str(mesures.tour_cheville) if mesures else 'Non définie',
                                'tour_cou': str(mesures.tour_cou) if mesures else 'Non définie',
                                'hauteur_dos': str(mesures.hauteur_dos) if mesures else 'Non définie',
                                'carrure_dos': str(mesures.carrure_dos) if mesures else 'Non définie',
                                'largeur_epaules': str(mesures.largeur_epaules) if mesures else 'Non définie',
                                'date_modification': mesures.date_modification.strftime('%d/%m/%Y') if mesures else 'Non définie',
                            } if mesures else None
                        }
                    })
                except Commande.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Commande non trouvée'
                    })
            
            elif action == 'change_status':
                commande_id = request.POST.get('commande_id')
                new_status = request.POST.get('status')
                
                if not new_status:
                    return JsonResponse({
                        'success': False,
                        'message': 'Statut requis'
                    })
                
                try:
                    # Filtrer par atelier pour la sécurité
                    commande = Commande.objects.get(id=commande_id, produit__atelier=atelier)
                    commande.status = new_status
                    commande.save()
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Statut de la commande {commande.reference} mis à jour avec succès'
                    })
                except Commande.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Commande non trouvée'
                    })
            
            elif action == 'set_deadline':
                commande_id = request.POST.get('commande_id')
                date_echeance = request.POST.get('date_echeance')
                
                if not date_echeance:
                    return JsonResponse({
                        'success': False,
                        'message': 'Date d\'échéance requise'
                    })
                
                try:
                    # Filtrer par atelier pour la sécurité
                    commande = Commande.objects.get(id=commande_id, produit__atelier=atelier)
                    
                    # Convertir la date du format français (dd/mm/yyyy) au format ISO (yyyy-mm-dd)
                    if '/' in date_echeance:
                        # Format français: dd/mm/yyyy
                        day, month, year = date_echeance.split('/')
                        date_echeance = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                    
                    commande.date_echeance = date_echeance
                    commande.save()
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Date d\'échéance de la commande {commande.reference} définie avec succès'
                    })
                except Commande.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Commande non trouvée'
                    })
                except ValueError as e:
                    return JsonResponse({
                        'success': False,
                        'message': f'Format de date invalide: {str(e)}'
                    })
                except Exception as e:
                    return JsonResponse({
                        'success': False,
                        'message': f'Erreur lors de la sauvegarde: {str(e)}'
                    })
            
            elif action == 'delete':
                commande_id = request.POST.get('commande_id')
                
                try:
                    # Filtrer par atelier pour la sécurité
                    commande = Commande.objects.get(id=commande_id, produit__atelier=atelier)
                    reference = commande.reference
                    commande.delete()
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Commande {reference} supprimée avec succès'
                    })
                except Commande.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Commande non trouvée'
                    })
        
        # Récupération des données pour l'affichage avec filtres
        # IMPORTANT: Filtrer par atelier
        commandes = Commande.objects.select_related('client', 'produit').filter(produit__atelier=atelier)
        
        # Filtre par statut
        status_filter = request.GET.get('status')
        if status_filter and status_filter != 'all':
            commandes = commandes.filter(status=status_filter)
        
        # Filtre par recherche
        search_query = request.GET.get('search')
        if search_query:
            commandes = commandes.filter(
                Q(reference__icontains=search_query) |
                Q(client__nom__icontains=search_query) |
                Q(client__prenom__icontains=search_query) |
                Q(produit__nom__icontains=search_query)
            )
        
        # Tri des commandes
        sort_by = request.GET.get('sort', '-date_creation')
        commandes = commandes.order_by(sort_by)
        
        # Pagination
        page = request.GET.get('page', 1)
        paginator = Paginator(commandes, 10)  # 10 commandes par page
        
        try:
            commandes_pagines = paginator.page(page)
        except PageNotAnInteger:
            commandes_pagines = paginator.page(1)
        except EmptyPage:
            commandes_pagines = paginator.page(paginator.num_pages)
        
        # Statistiques (calculées sur toutes les commandes de l'atelier, pas seulement les filtrées)
        all_commandes = Commande.objects.filter(produit__atelier=atelier)
        total_commandes = all_commandes.count()
        commandes_en_attente = all_commandes.filter(status='en_attente').count()
        commandes_en_cours = all_commandes.filter(status='en_cours').count()
        commandes_terminees = all_commandes.filter(status='termine').count()
        commandes_recuperees = all_commandes.filter(status='recupere').count()
        
        # Calcul du revenu total
        revenu_total = sum(commande.produit.prix for commande in all_commandes if commande.produit)
        
        # Données pour les graphiques (simplifiées pour éviter les problèmes SQLite)
        commandes_par_mois = []
        revenus_par_mois = []
        
        # Calculer les statistiques par mois de manière simple
        mois_stats = {}
        for commande in all_commandes:
            mois = commande.date_creation.strftime('%m')
            if mois not in mois_stats:
                mois_stats[mois] = {'count': 0, 'total': 0}
            mois_stats[mois]['count'] += 1
            if commande.produit:
                mois_stats[mois]['total'] += float(commande.produit.prix)
        
        # Convertir en listes pour le template
        for mois in sorted(mois_stats.keys()):
            commandes_par_mois.append({'month': mois, 'count': mois_stats[mois]['count']})
            revenus_par_mois.append({'month': mois, 'total': mois_stats[mois]['total']})
        
        context = {
            'commandes': commandes_pagines,
            'total_commandes': total_commandes,
            'commandes_en_attente': commandes_en_attente,
            'commandes_en_cours': commandes_en_cours,
            'commandes_terminees': commandes_terminees,
            'commandes_recuperees': commandes_recuperees,
            'revenu_total': revenu_total,
            'commandes_par_mois': commandes_par_mois,
            'revenus_par_mois': revenus_par_mois,
            'utilisateur': utilisateur,
            'atelier': atelier,
            'current_status': status_filter,
            'current_search': search_query,
            'current_sort': sort_by,
            'paginator': paginator,
        }
        
        return render(request, 'administration/orders.html', context)
        
    except Utilisateur.DoesNotExist:
        messages.error(request, "Utilisateur non trouvé.")
        return redirect('acceil:connexion')

def settings(request):
    if not request.session.get('user_id'):
        messages.error(request, 'Vous devez être connecté pour accéder à cette page.')
        return redirect('acceil:connexion')
    
    if request.session.get('user_role') != 'gérant':
        messages.error(request, 'Accès non autorisé.')
        return redirect('acceil:connexion')
    
    utilisateur = Utilisateur.objects.get(id=request.session['user_id'])
    atelier = Atelier.objects.get(utilisateur=utilisateur)
    
    if request.method == 'POST':
        print(f"\n=== NOUVELLE REQUÊTE POST ===")
        print(f"Type de formulaire: {request.POST.get('form_type')}")
        print(f"Données POST: {request.POST}")
        print(f"Fichiers: {request.FILES}")
        
        form_type = request.POST.get('form_type')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        try:
            if form_type == 'profile':
                with transaction.atomic():
                    # Mise à jour des informations du profil
                    utilisateur.nom = request.POST.get('nom', utilisateur.nom)
                    utilisateur.prenom = request.POST.get('prenom', utilisateur.prenom)
                    utilisateur.email = request.POST.get('email', utilisateur.email)
                    utilisateur.telephone = request.POST.get('telephone', utilisateur.telephone)
                    
                    if 'photo' in request.FILES:
                        utilisateur.photo = request.FILES['photo']
                    
                    utilisateur.full_clean()  # Validation du modèle
                    utilisateur.save()
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Profil mis à jour avec succès.'
                        })
                    messages.success(request, 'Profil mis à jour avec succès.')
            
            elif form_type == 'password':
                with transaction.atomic():
                    current_password = request.POST.get('currentPassword')
                    new_password = request.POST.get('newPassword')
                    confirm_password = request.POST.get('confirmPassword')
                    
                    if not check_password(current_password, utilisateur.mot_de_passe):
                        if is_ajax:
                            return JsonResponse({
                                'success': False,
                                'message': 'Le mot de passe actuel est incorrect.'
                            })
                        messages.error(request, 'Le mot de passe actuel est incorrect.')
                    elif new_password != confirm_password:
                        if is_ajax:
                            return JsonResponse({
                                'success': False,
                                'message': 'Les nouveaux mots de passe ne correspondent pas.'
                            })
                        messages.error(request, 'Les nouveaux mots de passe ne correspondent pas.')
                    else:
                        utilisateur.mot_de_passe = make_password(new_password)
                        utilisateur.save()
                        if is_ajax:
                            return JsonResponse({
                                'success': True,
                                'message': 'Mot de passe mis à jour avec succès.'
                            })
                        messages.success(request, 'Mot de passe mis à jour avec succès.')
            
            elif form_type == 'company':
                with transaction.atomic():
                    # Mise à jour des informations de l'atelier
                    atelier.nom_atelier = request.POST.get('nom_atelier', atelier.nom_atelier)
                    atelier.adresse = request.POST.get('adresse', atelier.adresse)
                    atelier.ville = request.POST.get('ville', atelier.ville)
                    atelier.description = request.POST.get('description', atelier.description)
                    
                    if 'photo_atelier' in request.FILES:
                        atelier.photo_atelier = request.FILES['photo_atelier']
                    
                    atelier.full_clean()  # Validation du modèle
                    atelier.save()
                    
                    if is_ajax:
                        return JsonResponse({
                            'success': True,
                            'message': 'Informations de l\'atelier mises à jour avec succès.'
                        })
                    messages.success(request, 'Informations de l\'atelier mises à jour avec succès.')
            
            elif form_type == 'delete_account':
                with transaction.atomic():
                    password = request.POST.get('password')
                    if not check_password(password, utilisateur.mot_de_passe):
                        if is_ajax:
                            return JsonResponse({
                                'success': False,
                                'message': 'Mot de passe incorrect.'
                            })
                        messages.error(request, 'Mot de passe incorrect.')
                        return redirect('administration:settings')
                    
                    # Supprimer d'abord l'atelier
                    atelier.delete()
                    # Puis supprimer l'utilisateur
                    utilisateur.delete()
                
                # Déconnecter l'utilisateur
                request.session.flush()
                if is_ajax:
                    return JsonResponse({
                        'success': True,
                        'message': 'Votre compte a été supprimé avec succès.',
                        'redirect': '/connexion/'
                    })
                messages.success(request, 'Votre compte a été supprimé avec succès.')
                return redirect('acceil:connexion')
        
        except ValidationError as e:
            error_message = str(e)
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': f'Erreur de validation : {error_message}'
                })
            messages.error(request, f'Erreur de validation : {error_message}')
        
        except Exception as e:
            error_message = str(e)
            if is_ajax:
                return JsonResponse({
                    'success': False,
                    'message': f'Une erreur est survenue : {error_message}'
                })
            messages.error(request, f'Une erreur est survenue : {error_message}')
        
        if is_ajax:
            return JsonResponse({
                'success': True,
                'message': 'Opération réussie'
            })
    
    return render(request, 'administration/settings.html', {
        'utilisateur': utilisateur,
        'atelier': atelier
    })

def logout_view(request):
    """Vue de déconnexion pour l'administration"""
    return deconnexion(request)
