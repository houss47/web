from django.db import migrations, models
import django.db.models.deletion

def create_users_from_rendezvous(apps, schema_editor):
    RendezVous = apps.get_model('atelier', 'RendezVous')
    Utilisateur = apps.get_model('acceil', 'Utilisateur')
    
    # Pour chaque rendez-vous existant
    for rdv in RendezVous.objects.all():
        # Créer un nouvel utilisateur si nécessaire
        user, created = Utilisateur.objects.get_or_create(
            email=rdv.email,
            defaults={
                'nom': rdv.nom_client,
                'prenom': rdv.nom_client.split()[0] if rdv.nom_client else '',
                'telephone': rdv.telephone or '',
                'role': 'client'
            }
        )
        # Mettre à jour le rendez-vous avec l'utilisateur
        rdv.client = user
        rdv.save()

class Migration(migrations.Migration):

    dependencies = [
        ('acceil', '0001_initial'),
        ('atelier', '0001_initial'),
    ]

    operations = [
        # Ajouter le nouveau champ client
        migrations.AddField(
            model_name='rendezvous',
            name='client',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='rendez_vous',
                to='acceil.utilisateur'
            ),
        ),
        # Exécuter la fonction de migration des données
        migrations.RunPython(create_users_from_rendezvous),
        # Rendre le champ client obligatoire
        migrations.AlterField(
            model_name='rendezvous',
            name='client',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='rendez_vous',
                to='acceil.utilisateur'
            ),
        ),
        # Supprimer les anciens champs
        migrations.RemoveField(
            model_name='rendezvous',
            name='nom_client',
        ),
        migrations.RemoveField(
            model_name='rendezvous',
            name='email',
        ),
        migrations.RemoveField(
            model_name='rendezvous',
            name='telephone',
        ),
    ] 