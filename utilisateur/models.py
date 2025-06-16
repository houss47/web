from django.db import models
from acceil.models import Utilisateur

class Mesure(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='mesures')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    # Mesures du haut du corps
    tour_poitrine = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de poitrine (cm)")
    tour_taille = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de taille (cm)")
    tour_hanches = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de hanches (cm)")
    longueur_epaule = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Longueur d'épaule (cm)")
    hauteur_epaule = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Hauteur d'épaule (cm)")
    longueur_buste = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Longueur du buste (cm)")

    # Mesures des bras
    longueur_bras = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Longueur de bras (cm)")
    tour_biceps = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de biceps (cm)")
    tour_poignet = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de poignet (cm)")
    longueur_epaule_coude = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Longueur épaule à coude (cm)")

    # Mesures des jambes
    longueur_jambe = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Longueur de jambe (cm)")
    entrejambe = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Entrejambe (cm)")
    tour_cuisse = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de cuisse (cm)")
    tour_genou = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de genou (cm)")
    tour_mollet = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de mollet (cm)")
    tour_cheville = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de cheville (cm)")

    # Autres mesures
    tour_cou = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Tour de cou (cm)")
    hauteur_dos = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Hauteur du dos (cm)")
    carrure_dos = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Carrure du dos (cm)")
    largeur_epaules = models.DecimalField(max_digits=5, decimal_places=1, verbose_name="Largeur des épaules (cm)")

    class Meta:
        verbose_name = "Mesure"
        verbose_name_plural = "Mesures"
        ordering = ['-date_modification']

    def __str__(self):
        return f"Mesures de {self.utilisateur.nom} - {self.date_modification.strftime('%d/%m/%Y')}"

    def get_absolute_url(self):
        return reverse('utilisateur:mes_mesures')
