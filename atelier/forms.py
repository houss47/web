from django import forms
from .models import RendezVous, Service
from django.utils import timezone
from datetime import datetime

class RendezVousForm(forms.Form):
    service = forms.ModelChoiceField(
        queryset=None,  # Sera défini dans __init__
        empty_label="Sélectionnez un service",
        required=True,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'service',
            'name': 'service'
        })
    )
    
    date = forms.DateField(
        required=True,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'id': 'date',
            'name': 'date'
        })
    )
    
    heure = forms.TimeField(
        required=True,
        widget=forms.TimeInput(attrs={
            'class': 'form-control',
            'type': 'time',
            'id': 'heure',
            'name': 'heure'
        })
    )
    
    message = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': '4',
            'placeholder': 'Précisez vos besoins ou questions...',
            'id': 'message',
            'name': 'message'
        })
    )
    
    def __init__(self, *args, **kwargs):
        self.atelier = kwargs.pop('atelier', None)
        super().__init__(*args, **kwargs)
        if self.atelier:
            self.fields['service'].queryset = Service.objects.filter(atelier=self.atelier)
    
    def clean_date(self):
        date = self.cleaned_data.get('date')
        if date < timezone.now().date():
            raise forms.ValidationError('La date du rendez-vous doit être dans le futur.')
        return date
    
    def clean_heure(self):
        heure = self.cleaned_data.get('heure')
        if heure.hour < 9 or heure.hour >= 18:
            raise forms.ValidationError('Les rendez-vous sont disponibles uniquement entre 9h et 18h.')
        return heure
    
    def clean(self):
        cleaned_data = super().clean()
        date = cleaned_data.get('date')
        heure = cleaned_data.get('heure')
        service = cleaned_data.get('service')
        
        if date and heure and service:
            # Vérifier si le créneau est déjà pris
            if RendezVous.objects.filter(
                atelier=self.atelier,
                date=date,
                heure=heure
            ).exists():
                raise forms.ValidationError('Ce créneau est déjà réservé. Veuillez en choisir un autre.')
        
        return cleaned_data 