from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Commande

# Register your models here.

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ('reference', 'client_info', 'atelier_info', 'produit_info', 'status', 'date_creation', 'date_echeance', 'jours_restants')
    list_filter = ('status', 'date_creation', 'date_echeance', 'atelier', 'produit__categorie')
    search_fields = ('reference', 'client__nom', 'client__prenom', 'client__email', 'produit__nom', 'atelier__nom_atelier')
    readonly_fields = ('reference', 'date_creation')
    list_editable = ('status',)
    date_hierarchy = 'date_creation'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('reference', 'client', 'atelier', 'produit', 'status')
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_echeance'),
            'description': 'La date d\'échéance est obligatoire et doit être dans le futur.'
        }),
    )
    
    def client_info(self, obj):
        if obj.client:
            return format_html(
                '<strong>{}</strong><br><small>{}</small><br><small>{}</small>',
                f"{obj.client.prenom} {obj.client.nom}",
                obj.client.email,
                obj.client.telephone
            )
        return "-"
    client_info.short_description = "Client"
    
    def atelier_info(self, obj):
        if obj.atelier:
            return format_html(
                '<strong>{}</strong><br><small>{}</small>',
                obj.atelier.nom_atelier,
                obj.atelier.ville
            )
        return "-"
    atelier_info.short_description = "Atelier"
    
    def produit_info(self, obj):
        if obj.produit:
            return format_html(
                '<strong>{}</strong><br><small>{}</small><br><small>{}</small>',
                obj.produit.nom,
                obj.produit.get_categorie_display(),
                f"{obj.produit.prix} FCFA"
            )
        return "-"
    produit_info.short_description = "Produit"
    
    def jours_restants(self, obj):
        if obj.date_echeance:
            jours = (obj.date_echeance - timezone.now().date()).days
            if jours < 0:
                return format_html(
                    '<span style="color: #dc3545; font-weight: bold;">En retard ({} jours)</span>',
                    abs(jours)
                )
            elif jours == 0:
                return format_html(
                    '<span style="color: #ffc107; font-weight: bold;">Échéance aujourd\'hui</span>'
                )
            elif jours <= 7:
                return format_html(
                    '<span style="color: #fd7e14; font-weight: bold;">{} jours</span>',
                    jours
                )
            else:
                return format_html(
                    '<span style="color: #28a745;">{} jours</span>',
                    jours
                )
        return "-"
    jours_restants.short_description = "Jours restants"
    
    def get_queryset(self, request):
        """Optimiser les requêtes avec select_related"""
        return super().get_queryset(request).select_related(
            'client', 'atelier', 'produit'
        )
    
    def save_model(self, request, obj, form, change):
        """Validation avant sauvegarde"""
        if not change:  # Nouvelle commande
            if not obj.date_echeance:
                obj.date_echeance = timezone.now().date() + timezone.timedelta(days=30)  # Par défaut 30 jours
        
        super().save_model(request, obj, form, change)
    
    actions = ['marquer_termine', 'marquer_recupere', 'prolonger_echeance']
    
    def marquer_termine(self, request, queryset):
        updated = queryset.update(status='termine')
        self.message_user(request, f'{updated} commande(s) marquée(s) comme terminée(s).')
    marquer_termine.short_description = "Marquer comme terminées"
    
    def marquer_recupere(self, request, queryset):
        updated = queryset.update(status='recupere')
        self.message_user(request, f'{updated} commande(s) marquée(s) comme récupérée(s).')
    marquer_recupere.short_description = "Marquer comme récupérées"
    
    def prolonger_echeance(self, request, queryset):
        for commande in queryset:
            commande.date_echeance = commande.date_echeance + timezone.timedelta(days=7)
            commande.save()
        self.message_user(request, f'Échéance prolongée de 7 jours pour {queryset.count()} commande(s).')
    prolonger_echeance.short_description = "Prolonger l'échéance de 7 jours"
