from django.contrib import admin
from .models import Utilisateur, Atelier, Contact

@admin.register(Utilisateur)
class UtilisateurAdmin(admin.ModelAdmin):
    list_display = ('prenom', 'nom', 'email', 'role', 'telephone', 'date_inscription', 'mot_de_passe')
    list_filter = ('role', 'date_inscription')
    search_fields = ('prenom', 'nom', 'email', 'telephone')
    ordering = ('-date_inscription',)
    readonly_fields = ('date_inscription',)
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('prenom', 'nom', 'email', 'telephone', 'photo')
        }),
        ('Informations de compte', {
            'fields': ('role', 'mot_de_passe', 'date_inscription')
        }),
    )

@admin.register(Atelier)
class AtelierAdmin(admin.ModelAdmin):
    list_display = ('nom_atelier', 'ville', 'utilisateur', 'cree_le')
    list_filter = ('ville', 'cree_le')
    search_fields = ('nom_atelier', 'ville', 'utilisateur__email', 'utilisateur__nom', 'utilisateur__prenom')
    ordering = ('-cree_le',)
    readonly_fields = ('cree_le',)
    fieldsets = (
        ('Informations de l\'atelier', {
            'fields': ('nom_atelier', 'adresse', 'ville', 'description', 'photo_atelier')
        }),
        ('Gérant', {
            'fields': ('utilisateur',)
        }),
        ('Informations système', {
            'fields': ('cree_le',)
        }),
    )

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('nom_complet', 'email', 'sujet', 'date_envoi', 'traite')
    list_filter = ('traite', 'date_envoi')
    search_fields = ('nom_complet', 'email', 'sujet', 'message')
    ordering = ('-date_envoi',)
    readonly_fields = ('date_envoi',)
    list_editable = ('traite',)
    fieldsets = (
        ('Informations de l\'expéditeur', {
            'fields': ('nom_complet', 'email')
        }),
        ('Message', {
            'fields': ('sujet', 'message')
        }),
        ('Suivi', {
            'fields': ('traite', 'date_envoi')
        }),
    )
    actions = ['marquer_comme_traite', 'marquer_comme_non_traite']

    def marquer_comme_traite(self, request, queryset):
        queryset.update(traite=True)
    marquer_comme_traite.short_description = "Marquer les messages sélectionnés comme traités"

    def marquer_comme_non_traite(self, request, queryset):
        queryset.update(traite=False)
    marquer_comme_non_traite.short_description = "Marquer les messages sélectionnés comme non traités"
