from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('acceil', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='atelier',
            old_name='nom',
            new_name='nom_atelier',
        ),
    ] 