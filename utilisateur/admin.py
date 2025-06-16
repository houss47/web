from django.contrib import admin
from .models import Mesure

@admin.register(Mesure)
class MesureAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'date_modification', 'tour_poitrine', 'tour_taille', 'tour_hanches')
    list_filter = ('date_modification', 'utilisateur')
    search_fields = ('utilisateur__nom', 'utilisateur__prenom', 'utilisateur__email')
    readonly_fields = ('date_creation', 'date_modification')
    ordering = ('-date_modification',)
    
    fieldsets = (
        ('Informations utilisateur', {
            'fields': ('utilisateur', 'date_creation', 'date_modification')
        }),
        ('Mesures du haut du corps', {
            'fields': (
                'tour_poitrine',
                'tour_taille',
                'tour_hanches',
                'longueur_epaule',
                'hauteur_epaule',
                'longueur_buste'
            ),
            'classes': ('collapse',)
        }),
        ('Mesures des bras', {
            'fields': (
                'longueur_bras',
                'tour_biceps',
                'tour_poignet',
                'longueur_epaule_coude'
            ),
            'classes': ('collapse',)
        }),
        ('Mesures des jambes', {
            'fields': (
                'longueur_jambe',
                'entrejambe',
                'tour_cuisse',
                'tour_genou',
                'tour_mollet',
                'tour_cheville'
            ),
            'classes': ('collapse',)
        }),
        ('Autres mesures', {
            'fields': (
                'tour_cou',
                'hauteur_dos',
                'carrure_dos',
                'largeur_epaules'
            ),
            'classes': ('collapse',)
        })
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Si on modifie un objet existant
            return self.readonly_fields + ('utilisateur',)
        return self.readonly_fields
    
    def has_delete_permission(self, request, obj=None):
        # Empêcher la suppression des mesures
        return False
    
    def has_add_permission(self, request):
        # Autoriser l'ajout manuel de mesures
        return True
    
    class Media:
        css = {
            'all': ('admin/css/mesures.css',)
        }
        js = ('admin/js/mesures.js',)
