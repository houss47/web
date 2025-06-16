/**
 * Mes Commandes JavaScript - Couture Hub
 * Gestion complète de la page des commandes avec modal et filtres
 */

/**
 * Fonction globale pour ouvrir le modal avec les données de la commande
 * Définie immédiatement pour être disponible dès le chargement
 */
window.openCommandeModal = function(button) {
    const modalElement = document.getElementById('commandeModal');
    if (!modalElement) {
        return;
    }
    
    const commandeId = button.getAttribute('data-commande-id');
    const reference = button.getAttribute('data-commande-reference');
    const date = button.getAttribute('data-commande-date');
    const produit = button.getAttribute('data-commande-produit');
    const atelier = button.getAttribute('data-commande-atelier');
    const prix = button.getAttribute('data-commande-prix');
    const status = button.getAttribute('data-commande-status');
    const progression = button.getAttribute('data-commande-progression');
    const description = button.getAttribute('data-commande-description');
    const categorie = button.getAttribute('data-commande-categorie');
    const echeance = button.getAttribute('data-commande-echeance');
    const progressionText = button.getAttribute('data-commande-progression-text');
    const joursRestants = button.getAttribute('data-commande-jours-restants');
    const retard = button.getAttribute('data-commande-retard') === 'true';
    const atelierTelephone = button.getAttribute('data-commande-atelier-telephone');
    const atelierEmail = button.getAttribute('data-commande-atelier-email');
    const progressionColor = button.getAttribute('data-commande-progression-color');
    const progressionClass = button.getAttribute('data-commande-progression-class');

    const elements = {
        'modal-reference': reference || 'Non disponible',
        'modal-date': date || 'Non disponible',
        'modal-produit': produit || 'Non disponible',
        'modal-atelier': atelier || 'Non disponible',
        'modal-prix': prix ? prix + ' XOF' : 'Non disponible',
        'modal-categorie': categorie || 'Non disponible',
        'modal-description': description || 'Aucune description disponible',
        'modal-echeance': echeance || 'Non disponible'
    };

    Object.keys(elements).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = elements[elementId];
        }
    });

    const statusElement = document.getElementById('modal-status');
    if (statusElement) {
        let statusBadge = '';
        if (status === 'en_attente') {
            statusBadge = '<span class="badge bg-warning" style="background-color: #ffc107 !important;">En attente</span>';
        } else if (status === 'en_cours') {
            statusBadge = '<span class="badge bg-warning" style="background-color: #E17921 !important;">En cours</span>';
        } else if (status === 'termine') {
            statusBadge = '<span class="badge bg-success" style="background-color: #28a745 !important;">Terminée</span>';
        } else if (status === 'recupere') {
            statusBadge = '<span class="badge bg-info" style="background-color: #17a2b8 !important;">Récupérée</span>';
        } else {
            statusBadge = '<span class="badge bg-secondary">Statut inconnu</span>';
        }
        statusElement.innerHTML = statusBadge;
    }

    const progressionBar = document.getElementById('modal-progression-bar');
    const progressionTextElement = document.getElementById('modal-progression-text');
    const progressionDetails = document.getElementById('modal-progression-details');
    
    if (progressionBar && progression) {
        progressionBar.style.width = progression + '%';
        progressionBar.setAttribute('aria-valuenow', progression);
        
        if (progressionColor) {
            progressionBar.style.backgroundColor = progressionColor;
        }
        
        progressionBar.classList.remove('progress-warning', 'progress-primary', 'progress-success', 'progress-info', 'progress-danger', 'progress-secondary');
        if (progressionClass) {
            progressionBar.classList.add(progressionClass);
        }
    }
    
    if (progressionTextElement) {
        if (progressionText) {
            progressionTextElement.textContent = progressionText;
        } else if (progression) {
            progressionTextElement.textContent = progression + '% complété';
        } else {
            progressionTextElement.textContent = 'Progression non disponible';
        }
    }
    
    if (progressionDetails) {
        progressionDetails.innerHTML = '';
        if (joursRestants !== null && joursRestants !== 'null' && joursRestants !== '') {
            const joursRestantsInt = parseInt(joursRestants);
            let detailsHtml = '';
            
            if (retard) {
                detailsHtml = `<small class="text-danger">
                    <i class="fas fa-exclamation-triangle"></i> En retard de ${Math.abs(joursRestantsInt)} jours
                </small>`;
            } else if (joursRestantsInt === 0) {
                detailsHtml = `<small class="text-warning">
                    <i class="fas fa-clock"></i> Échéance aujourd'hui
                </small>`;
            } else if (joursRestantsInt <= 3) {
                detailsHtml = `<small class="text-warning">
                    <i class="fas fa-clock"></i> ${joursRestantsInt} jours restants
                </small>`;
            } else {
                detailsHtml = `<small class="text-success">
                    <i class="fas fa-calendar"></i> ${joursRestantsInt} jours restants
                </small>`;
            }
            
            progressionDetails.innerHTML = detailsHtml;
        }
    }

    const contactBtn = document.getElementById('modal-contact-btn');
    const downloadBtn = document.getElementById('modal-download-btn');
    
    if (contactBtn && downloadBtn) {
        if (status === 'termine' || status === 'recupere') {
            contactBtn.style.display = 'none';
            downloadBtn.style.display = 'inline-block';
            downloadBtn.href = `/utilisateur/telecharger-commande/${commandeId}/`;
            downloadBtn.download = `commande_${reference}.pdf`;
            downloadBtn.target = '_blank';
            downloadBtn.rel = 'noopener noreferrer';
            
            downloadBtn.onclick = function(e) {
                e.preventDefault();
                
                const link = document.createElement('a');
                link.href = downloadBtn.href;
                link.download = downloadBtn.download;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            
        } else {
            contactBtn.style.display = 'inline-block';
            downloadBtn.style.display = 'none';
        }
    }

    const atelierContactElement = document.getElementById('modal-atelier-contact');
    const atelierTelephoneElement = document.getElementById('modal-atelier-telephone');
    const atelierEmailElement = document.getElementById('modal-atelier-email');
    
    if (atelierContactElement) {
        atelierContactElement.textContent = atelier || 'Non disponible';
    }
    
    if (atelierTelephoneElement) {
        if (atelierTelephone && atelierTelephone !== 'null' && atelierTelephone !== '') {
            atelierTelephoneElement.innerHTML = `
                <a href="tel:${atelierTelephone}" class="text-decoration-none">${atelierTelephone}</a>
            `;
        } else {
            atelierTelephoneElement.innerHTML = '<em>Non disponible</em>';
        }
    }
    
    if (atelierEmailElement) {
        if (atelierEmail && atelierEmail !== 'null' && atelierEmail !== '') {
            atelierEmailElement.innerHTML = `
                <a href="mailto:${atelierEmail}" class="text-decoration-none">${atelierEmail}</a>
            `;
        } else {
            atelierEmailElement.innerHTML = '<em>Non disponible</em>';
        }
    }

    const callBtn = document.getElementById('modal-call-btn');
    const emailBtn = document.getElementById('modal-email-btn');
    
    if (callBtn) {
        if (atelierTelephone && atelierTelephone !== 'null' && atelierTelephone !== '') {
            callBtn.onclick = function() {
                window.open(`tel:${atelierTelephone}`, '_self');
            };
            callBtn.disabled = false;
        } else {
            callBtn.disabled = true;
            callBtn.title = 'Numéro de téléphone non disponible';
        }
    }
    
    if (emailBtn) {
        if (atelierEmail && atelierEmail !== 'null' && atelierEmail !== '') {
            emailBtn.onclick = function() {
                window.open(`mailto:${atelierEmail}?subject=Question sur ma commande ${reference}`, '_self');
            };
            emailBtn.disabled = false;
        } else {
            emailBtn.disabled = true;
            emailBtn.title = 'Adresse email non disponible';
        }
    }

    try {
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            document.body.classList.add('modal-open');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ouverture du modal:', error);
    }
    
    if (progressionBar) {
        animateProgressBar(progressionBar, status);
    }
};

/**
 * Ajouter les gestionnaires d'événements pour les boutons
 */
function addEventListeners() {
    document.addEventListener('click', function(event) {
        const button = event.target.closest('[data-action="open-modal"]');
        if (button) {
            event.preventDefault();
            openCommandeModal(button);
        }
    });
    
    document.addEventListener('click', function(event) {
        const button = event.target.closest('[onclick*="confirmerAnnulation"]');
        if (button) {
            event.preventDefault();
            const commandeId = button.getAttribute('onclick').match(/confirmerAnnulation\((\d+)/)[1];
            const reference = button.getAttribute('onclick').match(/\'([^\']+)\'/)[1];
            confirmerAnnulation(commandeId, reference);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        addEventListeners();
        initializeTooltips();
        initializeFilters();
        initializeModal();
        initializeAnimations();
        initializeResponsiveTable();
        initializeVisualEffects();
        animateAllProgressBars();
    }, 100);
});

/**
 * Initialisation des tooltips Bootstrap
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialisation des filtres
 */
function initializeFilters() {
    const toggleFiltersBtn = document.getElementById('toggleFilters');
    const filtersContainer = document.getElementById('filtersContainer');
    
    if (toggleFiltersBtn && filtersContainer) {
        toggleFiltersBtn.addEventListener('click', function() {
            const isHidden = filtersContainer.style.display === 'none';
            filtersContainer.style.display = isHidden ? 'block' : 'none';
            
            if (!isHidden) {
                filtersContainer.style.maxHeight = '0';
                setTimeout(() => {
                    filtersContainer.style.maxHeight = filtersContainer.scrollHeight + 'px';
                }, 10);
            } else {
                filtersContainer.style.maxHeight = null;
            }
        });
    }
}

/**
 * Initialisation du modal
 */
function initializeModal() {
    const commandeModal = document.getElementById('commandeModal');
    
    if (commandeModal) {
        commandeModal.addEventListener('show.bs.modal', function (event) {
        });

        commandeModal.addEventListener('hidden.bs.modal', function (event) {
            resetModalData();
        });
        
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
        
        commandeModal.addEventListener('click', function(event) {
            if (event.target === commandeModal) {
                closeModal();
            }
        });
        
        const closeButtons = commandeModal.querySelectorAll('[data-bs-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal();
            });
        });
    }
    
    const modalContactBtn = document.getElementById('modal-contact-btn');
    if (modalContactBtn) {
        modalContactBtn.addEventListener('click', function() {
        });
    }
}

/**
 * Fonction pour fermer le modal
 */
function closeModal() {
    const modalElement = document.getElementById('commandeModal');
    if (modalElement) {
        if (typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                const newModal = new bootstrap.Modal(modalElement);
                newModal.hide();
            }
        } else {
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
    }
}

/**
 * Réinitialiser les données du modal
 */
function resetModalData() {
    const modalFields = [
        'modal-reference', 'modal-date', 'modal-produit', 'modal-atelier',
        'modal-prix', 'modal-categorie', 'modal-description', 'modal-echeance'
    ];
    
    modalFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.textContent = '';
        }
    });

    const progressionBar = document.getElementById('modal-progression-bar');
    const progressionText = document.getElementById('modal-progression-text');
    if (progressionBar) {
        progressionBar.style.width = '0%';
        progressionBar.setAttribute('aria-valuenow', '0');
    }
    if (progressionText) {
        progressionText.textContent = '';
    }

    const statusElement = document.getElementById('modal-status');
    if (statusElement) {
        statusElement.innerHTML = '';
    }
}

/**
 * Fonction pour animer les barres de progression selon le statut
 */
function animateProgressBar(progressBar, status) {
    progressBar.classList.remove('animate');
    
    if (status === 'en_cours') {
        progressBar.classList.add('animate');
    } else if (status === 'termine') {
        progressBar.style.animation = 'progress-success-animation 2s ease-in-out infinite';
    } else if (status === 'recupere') {
        progressBar.style.animation = 'progress-info-animation 2s ease-in-out infinite';
    }
}

/**
 * Fonction pour animer toutes les barres de progression du tableau
 */
function animateAllProgressBars() {
    const progressBars = document.querySelectorAll('.table .progress-bar');
    
    progressBars.forEach(progressBar => {
        const row = progressBar.closest('tr');
        const statusCell = row.querySelector('td:nth-child(6) .badge');
        
        if (statusCell) {
            const statusText = statusCell.textContent.trim().toLowerCase();
            let status = '';
            
            if (statusText.includes('attente')) {
                status = 'en_attente';
            } else if (statusText.includes('cours')) {
                status = 'en_cours';
            } else if (statusText.includes('terminée')) {
                status = 'termine';
            } else if (statusText.includes('récupérée')) {
                status = 'recupere';
            }
            
            animateProgressBar(progressBar, status);
        }
    });
}

/**
 * Initialisation des animations
 */
function initializeAnimations() {
    const primaryButtons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    
    primaryButtons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            badge.style.transform = 'scale(1.1)';
        });
        
        badge.addEventListener('mouseleave', function() {
            badge.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialisation de la table responsive
 */
function initializeResponsiveTable() {
    function adjustTableForMobile() {
        if (window.innerWidth < 768) {
            const table = document.querySelector('.table');
            if (table && !table.classList.contains('table-compact')) {
                table.classList.add('table-compact');

                const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
                const rows = table.querySelectorAll('tbody tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, index) => {
                        if (headers[index]) {
                            cell.setAttribute('data-label', headers[index]);
                        }
                    });
                });
            }
        } else {
            const table = document.querySelector('.table');
            if (table) {
                table.classList.remove('table-compact');
            }
        }
    }

    window.addEventListener('load', adjustTableForMobile);
    window.addEventListener('resize', adjustTableForMobile);
}

/**
 * Initialisation des effets visuels
 */
function initializeVisualEffects() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animation d'ondulation pour les boutons */
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.7);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple-animation 0.6s linear;
            transform: scale(0);
            opacity: 1;
        }
        
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }
        
        /* Animation pour les transitions */
        .card, .btn, .badge, .progress-bar {
            transition: all 0.3s ease;
        }
        
        /* Style pour l'expansion des filtres */
        #filtersContainer {
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.5s ease;
        }
        
        /* Animation pour les lignes de tableau au survol */
        .table-hover tbody tr {
            transition: transform 0.2s ease;
        }
        
        .table-hover tbody tr:hover {
            transform: translateX(5px);
        }
        
        /* Animation d'entrée des commandes */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .table-hover tbody tr {
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
        }
        
        .table-hover tbody tr:nth-child(1) { animation-delay: 0.1s; }
        .table-hover tbody tr:nth-child(2) { animation-delay: 0.2s; }
        .table-hover tbody tr:nth-child(3) { animation-delay: 0.3s; }
        .table-hover tbody tr:nth-child(4) { animation-delay: 0.4s; }
        .table-hover tbody tr:nth-child(5) { animation-delay: 0.5s; }

        /* Animation pour les éléments filtrés */
        .highlighted-row {
            background-color: rgba(225, 121, 33, 0.1) !important;
            transition: background-color 0.3s ease;
        }

        /* Style pour le modal */
        .modal.fade .modal-dialog {
            transition: transform 0.3s ease-out;
            transform: translate(0, -50px);
        }

        .modal.show .modal-dialog {
            transform: none;
        }

        /* Animation pour les boutons du modal */
        .modal .btn {
            transition: all 0.2s ease;
        }

        .modal .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Fonction pour confirmer l'annulation d'une commande
 */
window.confirmerAnnulation = function(commandeId, reference) {
    document.getElementById('commande-reference-confirm').textContent = reference;
    
    const confirmBtn = document.getElementById('confirmAnnulationBtn');
    confirmBtn.onclick = function() {
        annulerCommande(commandeId);
    };
    
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
};

/**
 * Fonction pour annuler une commande
 */
function annulerCommande(commandeId) {
    const confirmBtn = document.getElementById('confirmAnnulationBtn');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Annulation en cours...';
    confirmBtn.disabled = true;
    
    fetch(`/utilisateur/annuler-commande/${commandeId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showNotification('success', data.message);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
            modal.hide();
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);
                } else {
            showNotification('error', data.message);
            
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'annulation:', error);
        showNotification('error', 'Une erreur est survenue lors de l\'annulation.');
        
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    });
}

/**
 * Fonction pour afficher des notifications
 */
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
                    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Fonction pour récupérer le cookie CSRF
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
