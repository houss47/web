// Script spécifique pour la page Mes Commandes

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
            
            // Animation pour l'ouverture/fermeture
            if (!filtersContainer.classList.contains('d-none')) {
                filtersContainer.style.maxHeight = '0';
                setTimeout(() => {
                    filtersContainer.style.maxHeight = filtersContainer.scrollHeight + 'px';
                }, 10);
            } else {
                filtersContainer.style.maxHeight = null;
            }
        });
    }

    // Ouvrir modal détail commande lors du clic sur le bouton voir
    const viewButtons = document.querySelectorAll('.btn-outline-primary');
    const orderDetailModal = document.getElementById('orderDetailModal');
    
    if (viewButtons.length > 0 && orderDetailModal) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const orderModal = new bootstrap.Modal(orderDetailModal);
                orderModal.show();
            });
        });
    }
    
    // Effet d'ondulation pour les boutons
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
    
    // Animation pour les badges de statut
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            badge.style.transform = 'scale(1.1)';
        });
        
        badge.addEventListener('mouseleave', function() {
            badge.style.transform = 'scale(1)';
        });
    });
    
    // Style CSS pour les éléments dynamiques
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
    `;
    document.head.appendChild(style);
    
    // Ajout de la fonctionnalité de recherche instantanée
    const searchInput = document.getElementById('commandeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const orderRows = document.querySelectorAll('tbody tr');
            
            orderRows.forEach(row => {
                const orderNumber = row.querySelector('td:first-child').textContent.toLowerCase();
                const orderDesc = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (orderNumber.includes(searchTerm) || orderDesc.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Extension de la fonctionnalité des badges de statut - Filtrage par clic
    statusBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Filtre par statut au clic sur un badge
            const status = this.textContent.trim().toLowerCase();
            const orderRows = document.querySelectorAll('tbody tr');
            
            orderRows.forEach(row => {
                const rowStatus = row.querySelector('.status-badge').textContent.trim().toLowerCase();
                
                if (rowStatus === status || status === 'tous') {
                    row.style.display = '';
                    // Ajouter une classe d'animation pour les éléments filtrés
                    row.classList.add('highlighted-row');
                    setTimeout(() => {
                        row.classList.remove('highlighted-row');
                    }, 1000);
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
});
