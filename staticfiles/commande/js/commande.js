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
        category: '',
        description: '',
        
        // Step 3: Measurements
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
});

function initializeApp() {
    bindEventListeners();
    populateValidationSummary();
}

function bindEventListeners() {
    // Gestionnaire pour le bouton de confirmation
    const confirmButton = document.getElementById('confirm-order');
    if (confirmButton) {
        confirmButton.addEventListener('click', handleConfirmOrder);
    }

    // Gestionnaire pour les commentaires additionnels
    const additionalComments = document.getElementById('additional-comments');
    if (additionalComments) {
        additionalComments.addEventListener('input', function() {
            // Sauvegarder les commentaires dans le localStorage
            localStorage.setItem('additionalComments', this.value);
        });
    }
}

function populateValidationSummary() {
    // Récupérer les données du localStorage
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
    
    // Mettre à jour les informations personnelles
    document.getElementById('val-nom').textContent = formData.nom || '-';
    document.getElementById('val-email').textContent = formData.email || '-';
    document.getElementById('val-telephone').textContent = formData.telephone || '-';
    document.getElementById('val-adresse').textContent = formData.adresse || '-';
    
    // Mettre à jour les détails du projet
    document.getElementById('val-project-type').textContent = formData.projectType || 'Création sur-mesure';
    document.getElementById('val-category').textContent = formData.category || '-';
    document.getElementById('val-description').textContent = formData.description || '-';
    
    // Mettre à jour les mesures
    document.getElementById('val-tour-poitrine').textContent = formData.tourPoitrine || '-';
    document.getElementById('val-tour-taille').textContent = formData.tourTaille || '-';
    document.getElementById('val-tour-hanches').textContent = formData.tourHanches || '-';
    document.getElementById('val-largeur-epaules').textContent = formData.largeurEpaules || '-';
    document.getElementById('val-longueur-manches').textContent = formData.longueurManches || '-';
    document.getElementById('val-taille').textContent = formData.taille || '-';
    
    // Mettre à jour les commentaires additionnels
    const additionalComments = document.getElementById('additional-comments');
    if (additionalComments) {
        additionalComments.value = localStorage.getItem('additionalComments') || '';
    }
}

function handleConfirmOrder() {
    // Récupérer les données du formulaire
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
    const additionalComments = document.getElementById('additional-comments').value;
    
    // Ajouter les commentaires aux données
    formData.additionalComments = additionalComments;
    
    // Simuler l'envoi des données au serveur
    console.log('Envoi des données au serveur:', formData);
    
    // Afficher un message de confirmation
    showNotification('Votre commande a été confirmée avec succès !', 'success');
    
    // Rediriger vers la page de confirmation
    setTimeout(() => {
        window.location.href = '/confirmation.html';
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
