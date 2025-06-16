from django.contrib import admin
from .models import Service, Produit, RendezVous, Photo
from django.utils.html import format_html
from datetime import datetime

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'atelier', 'prix_minimum')
    list_filter = ('atelier',)
    search_fields = ('nom', 'description')
    ordering = ('nom',)
    verbose_name = 'Service'
    verbose_name_plural = 'Services'

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('nom', 'atelier', 'categorie', 'prix', 'date_ajout')
    list_filter = ('atelier', 'categorie')
    search_fields = ('nom', 'description')
    ordering = ('-date_ajout',)
    verbose_name = 'Produit'
    verbose_name_plural = 'Produits'

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('client', 'atelier', 'service', 'date_heure', 'status', 'date_creation_format')
    list_filter = ('atelier', 'service', 'status', 'date')
    search_fields = ('client__nom', 'client__prenom', 'client__email', 'client__telephone')
    ordering = ('-date', '-heure')
    list_editable = ('status',)
    actions = ['marquer_comme_confirme', 'marquer_comme_annule']
    verbose_name = 'Rendez-vous'
    verbose_name_plural = 'Rendez-vous'
    date_hierarchy = 'date'

    def date_heure(self, obj):
        return format_html(
            '<span style="white-space: nowrap;">{}</span>',
            f"{obj.date.strftime('%d/%m/%Y')} à {obj.heure.strftime('%H:%M')}"
        )
    date_heure.short_description = 'Date et heure'
    date_heure.admin_order_field = 'date'

    def date_creation_format(self, obj):
        return format_html(
            '<span style="white-space: nowrap;">{}</span>',
            obj.date_creation.strftime('%d/%m/%Y %H:%M')
        )
    date_creation_format.short_description = 'Date de création'
    date_creation_format.admin_order_field = 'date_creation'

    def marquer_comme_confirme(self, request, queryset):
        queryset.update(status='confirme')
    marquer_comme_confirme.short_description = "Marquer les rendez-vous sélectionnés comme confirmés"

    def marquer_comme_annule(self, request, queryset):
        queryset.update(status='annule')
    marquer_comme_annule.short_description = "Marquer les rendez-vous sélectionnés comme annulés"

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('titre', 'atelier', 'date_ajout')
    list_filter = ('atelier',)
    search_fields = ('titre',)
    ordering = ('-date_ajout',)
    verbose_name = 'Photo'
    verbose_name_plural = 'Photos'
