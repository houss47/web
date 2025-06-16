from django.db import migrations, models
import django.db.models.deletion

def convert_service_to_foreignkey(apps, schema_editor):
    RendezVous = apps.get_model('atelier', 'RendezVous')
    Service = apps.get_model('atelier', 'Service')
    
    # Pour chaque rendez-vous existant
    for rdv in RendezVous.objects.all():
        # Utiliser un nom par défaut si le nom du service est vide ou nul
        service_nom = rdv.service if rdv.service else 'Service inconnu'
        # Trouver ou créer le service correspondant
        service, created = Service.objects.get_or_create(
            atelier=rdv.atelier,
            nom=service_nom,
            defaults={
                'description': f'Service de {service_nom}',
                'prix_minimum': 0
            }
        )
        # Mettre à jour le rendez-vous avec le nouveau service
        rdv.service = service
        rdv.save()

class Migration(migrations.Migration):

    dependencies = [
        ('atelier', '0003_remove_rendezvous_confirme_rendezvous_status'),
    ]

    operations = [
        # D'abord, sauvegarder l'ancien champ service
        migrations.RenameField(
            model_name='rendezvous',
            old_name='service',
            new_name='service_old',
        ),
        
        # Ajouter le nouveau champ service comme ForeignKey
        migrations.AddField(
            model_name='rendezvous',
            name='service',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='rendez_vous_service',
                to='atelier.service'
            ),
        ),
        
        # Convertir les données
        migrations.RunPython(convert_service_to_foreignkey),
        
        # Rendre le champ service obligatoire
        migrations.AlterField(
            model_name='rendezvous',
            name='service',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='rendez_vous_service',
                to='atelier.service'
            ),
        ),
        
        # Supprimer l'ancien champ
        migrations.RemoveField(
            model_name='rendezvous',
            name='service_old',
        ),
    ] 