// Script spécifique pour la page Mes Rendez-vous

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    // Gestion des filtres
    const toggleFiltersBtn = document.getElementById('toggleFilters');
    const filtersContainer = document.getElementById('filtersContainer');
    
    if (toggleFiltersBtn && filtersContainer) {
        toggleFiltersBtn.addEventListener('click', function() {
            filtersContainer.classList.toggle('d-none');
        });
    }

    // Gestion du bouton nouveau rendez-vous
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', function() {
            window.location.href = "../rendez-vous.html";
        });
    }

    // Interaction avec le calendrier
    const calendarDays = document.querySelectorAll('.table-calendar td:not(.text-muted)');
    
    if (calendarDays.length > 0) {
        calendarDays.forEach(day => {
            day.addEventListener('click', function() {
                // Retirer la classe 'selected' de tous les jours
                calendarDays.forEach(d => d.classList.remove('selected'));
                
                // Ajouter la classe 'selected' au jour cliqué
                this.classList.add('selected');
                
                // Ici on pourrait filtrer les rendez-vous en fonction du jour sélectionné
                const selectedDate = this.textContent.trim();
                console.log(`Jour sélectionné: ${selectedDate}`);
                
                // Exemple de filtrage (à adapter selon la structure réelle)
                const appointments = document.querySelectorAll('.appointment-item');
                appointments.forEach(app => {
                    const dateElement = app.querySelector('.badge.bg-info, .badge.bg-primary');
                    if (dateElement) {
                        const dateText = dateElement.textContent;
                        // Vérifier si la date correspond au jour sélectionné (logique à adapter)
                        if (dateText.includes(selectedDate) || (dateText.includes('Aujourd\'hui') && day.classList.contains('today'))) {
                            app.style.display = '';
                        } else {
                            app.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Ouverture des modals de détail
    const detailButtons = document.querySelectorAll('[data-bs-target="#appointmentDetailsModal"]');
    
    if (detailButtons.length > 0) {
        detailButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Ici on pourrait charger des données spécifiques au rendez-vous sélectionné
                console.log('Ouverture du modal de détail pour le rendez-vous');
            });
        });
    }

    // Gestion du modal de reprogrammation
    const rescheduleButtons = document.querySelectorAll('[data-bs-target="#rescheduleModal"]');
    
    if (rescheduleButtons.length > 0) {
        rescheduleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Récupérer les informations du rendez-vous à reprogrammer
                const appointmentItem = this.closest('.appointment-item');
                if (appointmentItem) {
                    const title = appointmentItem.querySelector('h6').textContent;
                    console.log(`Reprogrammation pour: ${title}`);
                }
            });
        });
    }

    // Gestion du modal d'annulation
    const cancelButtons = document.querySelectorAll('[data-bs-target="#cancelModal"]');
    
    if (cancelButtons.length > 0) {
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Récupérer les informations du rendez-vous à annuler
                const appointmentItem = this.closest('.appointment-item');
                if (appointmentItem) {
                    const title = appointmentItem.querySelector('h6').textContent;
                    console.log(`Annulation pour: ${title}`);
                }
            });
        });
    }

    // Animation pour les rendez-vous
    const appointmentItems = document.querySelectorAll('.appointment-item');
    
    if (appointmentItems.length > 0) {
        // Ajout d'effet stagger pour les animations d'entrée
        appointmentItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
                
                // Mettre en évidence les boutons d'action
                const buttons = this.querySelectorAll('.btn');
                buttons.forEach(btn => {
                    btn.style.opacity = '1';
                });
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                
                // Remettre les boutons à leur état initial
                const buttons = this.querySelectorAll('.btn');
                buttons.forEach(btn => {
                    btn.style.opacity = '';
                });
            });
        });
    }
    
    // Ajout de styles dynamiques pour le calendrier
    const style = document.createElement('style');
    style.textContent = `
        .table-calendar .selected:not(.today) {
            background-color: rgba(225, 121, 33, 0.3);
            font-weight: bold;
            color: #9C4506;
            border-radius: 50%;
        }
        
        .appointment-item {
            cursor: pointer;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .appointment-list .appointment-item {
            animation: fadeIn 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
