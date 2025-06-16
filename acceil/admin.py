from django.contrib import admin
from .models import Utilisateur, Atelier

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
