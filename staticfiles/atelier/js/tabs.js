/**
 * tabs.js - Gestion des onglets pour les pages du site
 * Ce script permet de gérer l'affichage des contenus d'onglets
 * lorsque l'utilisateur clique sur un onglet.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les onglets et contenus
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Ajouter l'attribut --tab-index pour l'animation séquentielle
    tabs.forEach((tab, index) => {
        tab.style.setProperty('--tab-index', index);
        
        // Ajouter un écouteur d'événement à chaque onglet
        tab.addEventListener('click', function() {
            // Récupérer l'identifiant du contenu à afficher
            const tabId = this.getAttribute('data-tab');
            
            // Supprimer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Suppression de l'effet de pulsation au clic
            
            // Masquer tous les contenus sans animation
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Afficher le contenu correspondant à l'onglet sans animation
            const targetContent = document.getElementById(tabId);
            targetContent.classList.add('active');
            
            // Sauvegarder l'onglet actif dans le stockage local pour persistance
            localStorage.setItem('activeTab', tabId);
            
            // Faire défiler jusqu'au contenu si on est sur mobile
            if (window.innerWidth < 768) {
                const targetContent = document.getElementById(tabId);
                setTimeout(() => {
                    targetContent.scrollIntoView({behavior: 'smooth', block: 'start'});
                }, 350);
            }
        });
    });
    
    // Restaurer l'onglet actif si sauvegardé précédemment
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        // Trouver l'onglet correspondant
        const tabToActivate = document.querySelector(`.tab[data-tab="${activeTab}"]`);
        if (tabToActivate) {
            // Simuler un clic sur cet onglet
            tabToActivate.click();
        }
    }
});