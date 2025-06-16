/**
 * Script pour le processus de commande sur mesure
 * Permet la navigation entre les étapes, la validation des formulaires
 * et l'enregistrement des données pour la commande finale
 * 
 * @author Couture Hub
 * @version 1.0.0
 */

// Application state
const appState = {
    currentStep: 1,
    totalSteps: 4,
    formData: {
        // Étape 1: Informations personnelles
        prenom: '',
        nom: '',
        telephone: '',
        email: '',
        adresse: '',
        
        // Étape 2: Détails du projet
        projectType: 'custom',
        category: '',
        description: '',
        references: [],
        referenceUrl: '',
        
        // Étape 3: Mesures
        tourPoitrine: '',
        tourTaille: '',
        tourHanches: '',
        largeurEpaules: '',
        longueurManches: '',
        taille: '',
        notesMesures: '',
    },
    errors: {},
    isValid: true,
    animating: false
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAnimations();
});

function initializeApp() {
    bindEventListeners();
    setupValidationCards();
}

function setupAnimations() {
    // Animation des cartes de validation
    const cards = document.querySelectorAll('.validation-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Animation des éléments de contact
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
    });
}

function setupValidationCards() {
    const cards = document.querySelectorAll('.validation-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

function bindEventListeners() {
    // Gestionnaire pour le bouton de confirmation
    const confirmButton = document.getElementById('confirm-order');
    if (confirmButton) {
        confirmButton.addEventListener('click', handleConfirmOrder);
    }

    // Gestionnaire pour les éléments de contact
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(8px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}

function handleConfirmOrder(event) {
    event.preventDefault();
    
    const form = event.target.closest('form');
    if (form) {
        // Animation du bouton
        const button = event.target;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            form.submit();
        }, 200);
    }
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fonction pour gérer les erreurs
function handleError(error) {
    console.error('Erreur:', error);
    showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
}

// Fonction pour valider les données
function validateData(data) {
    const errors = {};
    
    // Validation des informations personnelles
    if (!data.nom) errors.nom = 'Le nom est requis';
    if (!data.prenom) errors.prenom = 'Le prénom est requis';
    if (!data.email) errors.email = 'L\'email est requis';
    if (!data.telephone) errors.telephone = 'Le téléphone est requis';
    
    // Validation des mesures
    if (data.tourPoitrine && (isNaN(data.tourPoitrine) || data.tourPoitrine <= 0)) {
        errors.tourPoitrine = 'Le tour de poitrine doit être un nombre positif';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
