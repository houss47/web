from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from acceil.models import Utilisateur, Atelier
from atelier.models import Service, Produit, RendezVous, Photo
from utilisateur.models import Mesure
from commande.models import Commande
from faker import Faker
import random
from datetime import datetime, timedelta, time

class Command(BaseCommand):
    help = 'Populate the database with Abidjan data'

    def handle(self, *args, **kwargs):
        fake = Faker('fr_FR')
        
        # Liste étendue des communes d'Abidjan avec leurs quartiers populaires
        quartiers_abidjan = {
            'Cocody': ['Deux Plateaux', 'Riviera', 'Ambassade', 'Angré', 'Palmeraie', 'Les Vallons', 'Ambassade', 'Angré 8ème', 'Angré 7ème', 'Angré 6ème', 'Angré 5ème', 'Angré 4ème', 'Angré 3ème', 'Angré 2ème', 'Angré 1er', 'Ambassade', 'Palmeraie', 'Les Vallons', 'Ambassade', 'Angré 8ème', 'Angré 7ème', 'Angré 6ème', 'Angré 5ème', 'Angré 4ème', 'Angré 3ème', 'Angré 2ème', 'Angré 1er'],
            'Marcory': ['Zone Portuaire', 'Biétry', 'Remblais', 'Les Deux Plateaux', 'Remblais', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10', 'Zone 11', 'Zone 12', 'Zone 13', 'Zone 14', 'Zone 15'],
            'Treichville': ['Akouédo', 'Port', 'Marché', 'Zone Industrielle', 'Quartier Commerce', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Port-Bouët': ['Aéroport', 'Gonzagueville', 'Zone Industrielle', 'Akouédo', 'Zone Portuaire', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Yopougon': ['Port Bouët 2', 'Niangon', 'Selmer', 'Maroc', 'Sicogi', 'Saint André', 'Maroc', 'Selmer', 'Niangon', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Adjamé': ['Liberté', 'Saint Jean', 'Forum', 'Gare Routière', 'Commerce', 'Saint Michel', 'Liberté', 'Forum', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Plateau': ['Commerce', 'Administration', 'Banque', 'Centre Administratif', 'Quartier des Affaires', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Abobo': ['Avocatier', 'Samaké', 'Gare', 'Anador', 'Abobo Gare', 'Avocatier', 'Samaké', 'Anador', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Koumassi': ['Prodomo', 'Zone Industrielle', 'Grand Marché', 'Prodomo', 'Zone 4', 'Grand Marché', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Songon': ['Akouédo', 'Port', 'Marché', 'Zone Industrielle', 'Centre', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Bingerville': ['Centre', 'Résidentiel', 'Zone Administrative', 'Quartier Résidentiel', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Anyama': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Grand-Bassam': ['Centre', 'Plage', 'Quartier France', 'Zone Touristique', 'Quartier Colonial', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Bouaké': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'San Pedro': ['Centre', 'Zone Portuaire', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Korhogo': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Daloa': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Man': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Gagnoa': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'],
            'Abengourou': ['Centre', 'Zone Industrielle', 'Quartier Résidentiel', 'Zone Administrative', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10']
        }

        # Liste des services de couture avec leurs prix moyens en FCFA
        services_couture = [
            ('Retouches', 'Service de retouches rapides et précises', (5000, 15000)),
            ('Sur-mesure', 'Création de vêtements sur mesure', (25000, 100000)),
            ('Broderie', 'Service de broderie personnalisée', (15000, 50000)),
            ('Conseil', 'Conseil en style et devis personnalisés', (10000, 30000)),
            ('Couture Traditionnelle', 'Création de vêtements traditionnels', (30000, 120000)),
            ('Couture Moderne', 'Création de vêtements modernes', (20000, 80000)),
            ('Couture de Mariage', 'Création de tenues de mariage', (50000, 200000)),
            ('Couture d\'Enfants', 'Création de vêtements pour enfants', (15000, 40000)),
            ('Couture de Cérémonie', 'Création de tenues de cérémonie', (40000, 150000)),
            ('Couture de Soirée', 'Création de tenues de soirée', (35000, 120000))
        ]

        # Création des gérants et ateliers
        for commune, quartiers in quartiers_abidjan.items():
            for quartier in quartiers:
                # Créer 2 ateliers par quartier
                for i in range(2):
                    # Générer un email unique
                    base_email = f"gerant_{quartier.lower().replace(' ', '_')}_{i+1}"
                    email = f"{base_email}@example.com"
                    counter = 1
                    while Utilisateur.objects.filter(email=email).exists():
                        email = f"{base_email}_{counter}@example.com"
                        counter += 1

                    # Création du gérant avec nom ivoirien
                    gerant = Utilisateur.objects.create(
                        nom=fake.last_name(),
                        prenom=fake.first_name(),
                        email=email,
                        role="gérant",
                        telephone=f"+225 0{random.randint(1, 9)}{random.randint(10000000, 99999999)}",
                        mot_de_passe=make_password("houessou")
                    )

                    # Création de l'atelier
                    atelier = Atelier.objects.create(
                        utilisateur=gerant,
                        nom_atelier=f"Atelier de Couture {quartier} {i+1}",
                        adresse=f"{random.randint(1, 100)} Rue {fake.street_name()}, {quartier}, {commune}",
                        ville=commune,
                        description=f"Atelier de couture professionnel situé à {quartier}, {commune}, spécialisé dans la création de vêtements sur mesure et les retouches."
                    )

                    # Création des services pour chaque atelier
                    services = []
                    for nom_service, description, (prix_min, prix_max) in services_couture:
                        service = Service.objects.create(
                            atelier=atelier,
                            nom=nom_service,
                            description=description,
                            prix_minimum=random.randint(prix_min, prix_max)
                        )
                        services.append(service)

                    # Création des produits avec prix réalistes en FCFA
                    categories = ['femmes', 'hommes', 'enfants']
                    types_vetements = {
                        'femmes': ['Boubou', 'Kaba', 'Pagne', 'Robe de soirée', 'Tenue traditionnelle', 'Robe de mariée', 'Jupe', 'Blouse', 'Tenue de cérémonie', 'Robe cocktail', 'Robe de bal', 'Robe de gala', 'Robe de soirée', 'Robe de cocktail'],
                        'hommes': ['Boubou', 'Costume', 'Chemise', 'Pantalon', 'Tenue traditionnelle', 'Costume de mariage', 'Veste', 'Tenue de cérémonie', 'Costume trois pièces', 'Costume de soirée', 'Costume de gala', 'Costume de cocktail'],
                        'enfants': ['Boubou', 'Robe', 'Pantalon', 'Chemise', 'Tenue traditionnelle', 'Costume', 'Jupe', 'Blouse', 'Robe de cérémonie', 'Costume de cérémonie', 'Tenue de fête', 'Tenue de gala']
                    }
                    
                    produits = []
                    for _ in range(50):  # 50 produits par atelier
                        categorie = random.choice(categories)
                        type_vetement = random.choice(types_vetements[categorie])
                        prix_base = {
                            'femmes': random.randint(15000, 50000),
                            'hommes': random.randint(15000, 45000),
                            'enfants': random.randint(10000, 30000)
                        }[categorie]
                        
                        produit = Produit.objects.create(
                            atelier=atelier,
                            nom=f"{type_vetement} {quartier} {i+1}",
                            description=f"Magnifique {type_vetement} créé par l'atelier {quartier} {i+1}",
                            categorie=categorie,
                            prix=prix_base,
                            photo=None,
                            date_ajout=datetime.now()
                        )
                        produits.append(produit)

                    # Création des clients pour les rendez-vous et commandes
                    for _ in range(200):  # 200 clients par atelier
                        client = Utilisateur.objects.create(
                            nom=fake.last_name(),
                            prenom=fake.first_name(),
                            email=fake.unique.email(),
                            role="client",
                            telephone=f"+225 0{random.randint(1, 9)}{random.randint(10000000, 99999999)}",
                            mot_de_passe=make_password("houessou")
                        )

                        # Création des mesures pour chaque client
                        for _ in range(3):  # 3 mesures par client
                            Mesure.objects.create(
                                utilisateur=client,
                                tour_poitrine=random.uniform(80, 120),
                                tour_taille=random.uniform(60, 100),
                                tour_hanches=random.uniform(80, 120),
                                longueur_epaule=random.uniform(10, 15),
                                hauteur_epaule=random.uniform(10, 15),
                                longueur_buste=random.uniform(20, 30),
                                longueur_bras=random.uniform(50, 70),
                                tour_biceps=random.uniform(25, 35),
                                tour_poignet=random.uniform(15, 20),
                                longueur_epaule_coude=random.uniform(30, 40),
                                longueur_jambe=random.uniform(70, 90),
                                entrejambe=random.uniform(70, 85),
                                tour_cuisse=random.uniform(45, 65),
                                tour_genou=random.uniform(35, 45),
                                tour_mollet=random.uniform(30, 40),
                                tour_cheville=random.uniform(20, 25),
                                tour_cou=random.uniform(35, 45),
                                hauteur_dos=random.uniform(40, 50),
                                carrure_dos=random.uniform(35, 45),
                                largeur_epaules=random.uniform(40, 50)
                            )

                        # Création des rendez-vous pour chaque client
                        for _ in range(5):  # 5 rendez-vous par client
                            date = fake.date_between(start_date='-30d', end_date='+30d')
                            # Générer une heure entre 8h et 18h
                            heure = time(hour=random.randint(8, 17), minute=random.choice([0, 15, 30, 45]))
                            
                            # Vérifier si le créneau est déjà pris
                            while RendezVous.objects.filter(
                                atelier=atelier,
                                date=date,
                                heure=heure
                            ).exists():
                                heure = time(hour=random.randint(8, 17), minute=random.choice([0, 15, 30, 45]))
                            
                            RendezVous.objects.create(
                                atelier=atelier,
                                client=client,
                                service=random.choice(services),
                                date=date,
                                heure=heure,
                                message=fake.text(max_nb_chars=200),
                                status=random.choice(['en_attente', 'confirme', 'annule']),
                                date_creation=datetime.now()
                            )

                        # Création des commandes pour chaque client
                        for _ in range(10):  # 10 commandes par client
                            # Générer une date de création dans le passé
                            date_creation = fake.date_time_between(start_date='-60d', end_date='now')
                            # Générer une date d'échéance dans le futur (entre 7 et 30 jours à partir d'aujourd'hui)
                            date_echeance = datetime.now().date() + timedelta(days=random.randint(7, 30))
                            
                            # Sélectionner un produit aléatoire
                            produit = random.choice(produits)
                            
                            # Créer la commande
                            commande = Commande.objects.create(
                                client=client,
                                atelier=atelier,
                                produit=produit,
                                date_echeance=date_echeance,
                                status=random.choice(['en_attente', 'en_cours', 'termine', 'recupere'])
                            )
                            # La référence sera générée automatiquement par le modèle

                    # Création des photos pour l'atelier
                    for _ in range(50):  # 50 photos par atelier
                        Photo.objects.create(
                            atelier=atelier,
                            titre=f"Collection {quartier} {i+1} {fake.word()}",
                            image=None,
                            date_ajout=datetime.now()
                        )

        self.stdout.write(self.style.SUCCESS('Données d\'Abidjan ajoutées avec succès!')) 