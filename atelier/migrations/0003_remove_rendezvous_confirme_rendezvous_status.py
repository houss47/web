# Generated by Django 5.2.3 on 2025-06-12 22:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('atelier', '0002_auto_20240611_2133'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rendezvous',
            name='confirme',
        ),
        migrations.AddField(
            model_name='rendezvous',
            name='status',
            field=models.CharField(choices=[('en_attente', 'En attente'), ('confirme', 'Confirmé'), ('annule', 'Annulé')], default='en_attente', max_length=20),
        ),
    ]
