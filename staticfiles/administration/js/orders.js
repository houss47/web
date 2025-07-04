// Gestion des commandes - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders.js chargé');
    
    // ===== DIAGNOSTIC DU DASHBOARD STATS =====
    function diagnoseDashboardStats() {
        console.log('=== DIAGNOSTIC DASHBOARD STATS ===');
        
        const dashboardStats = document.querySelector('.dashboard-stats');
        if (!dashboardStats) {
            console.error('❌ .dashboard-stats non trouvé dans le DOM');
            return;
        }
        
        console.log('✅ .dashboard-stats trouvé');
        console.log('Computed styles:', window.getComputedStyle(dashboardStats));
        console.log('Display:', window.getComputedStyle(dashboardStats).display);
        console.log('Visibility:', window.getComputedStyle(dashboardStats).visibility);
        console.log('Opacity:', window.getComputedStyle(dashboardStats).opacity);
        
        const statCards = dashboardStats.querySelectorAll('.stat-card');
        console.log(`📊 Nombre de stat-cards trouvées: ${statCards.length}`);
        
        statCards.forEach((card, index) => {
            console.log(`--- Stat Card ${index + 1} ---`);
            const icon = card.querySelector('.stat-icon');
            const content = card.querySelector('.stat-content');
            const h3 = content?.querySelector('h3');
            const p = content?.querySelector('p');
            
            console.log('Icon:', icon ? '✅' : '❌');
            console.log('Content:', content ? '✅' : '❌');
            console.log('H3:', h3 ? '✅' : '❌');
            console.log('P:', p ? '✅' : '❌');
            
            if (h3) {
                console.log('H3 text:', h3.textContent);
                console.log('H3 innerHTML:', h3.innerHTML);
            }
            if (p) {
                console.log('P text:', p.textContent);
            }
        });
        
        // Vérifier les variables Django
        const h3Elements = dashboardStats.querySelectorAll('h3');
        h3Elements.forEach((h3, index) => {
            if (!h3.textContent.trim()) {
                console.warn(`⚠️ H3 ${index + 1} vide - Variable Django manquante`);
                h3.style.border = '2px solid red';
                h3.style.padding = '5px';
                h3.style.backgroundColor = '#ffebee';
            }
        });
    }
    
    // Forcer l'affichage du dashboard stats
    function forceDisplayDashboardStats() {
        const dashboardStats = document.querySelector('.dashboard-stats');
        if (dashboardStats) {
            dashboardStats.style.display = 'grid';
            dashboardStats.style.visibility = 'visible';
            dashboardStats.style.opacity = '1';
            dashboardStats.style.minHeight = '120px';
            
            // Forcer l'affichage des stat cards
            const statCards = dashboardStats.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                card.style.display = 'flex';
                card.style.visibility = 'visible';
                card.style.opacity = '1';
                card.style.minHeight = '100px';
            });
            
            console.log('✅ Affichage forcé du dashboard stats');
        }
    }
    
    // Exécuter le diagnostic et forcer l'affichage
    setTimeout(() => {
        diagnoseDashboardStats();
        forceDisplayDashboardStats();
    }, 100);
    
    // Token CSRF pour les requêtes AJAX
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
                     document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    
    // Configuration des headers pour AJAX
    const ajaxHeaders = {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
    };
    
    // Variables globales pour les filtres actifs
    let activeSearchTerm = '';
    let activeStatusFilter = 'all';
    
    // ===== GESTION DES MODALS =====
    
    // Fonction pour ouvrir un modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Fonction pour fermer un modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    // Fermer les modals en cliquant sur le fond
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Fermer les modals avec le bouton X
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
      });
    });
    
    // ===== BOUTONS D'ACTION PRINCIPAUX =====
    
    // Nouvelle commande
    const newOrderBtn = document.getElementById('newOrderBtn');
  if (newOrderBtn) {
  newOrderBtn.addEventListener('click', function() {
            console.log('Ouverture modal nouvelle commande');
            openModal('newOrderModal');
        });
    }
    
    // Actualiser
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Actualisation de la page');
            location.reload();
        });
    }
    
    // Exporter
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            console.log('Export des commandes');
            // TODO: Implémenter l'export
            showNotification('Export en cours de développement', 'info');
        });
    }
    
    // ===== FILTRES AVANCÉS =====
    
    const advancedFiltersBtn = document.getElementById('advancedFiltersBtn');
    const advancedFiltersPanel = document.getElementById('advancedFiltersPanel');
    
    if (advancedFiltersBtn && advancedFiltersPanel) {
        advancedFiltersBtn.addEventListener('click', function() {
            advancedFiltersPanel.classList.toggle('show');
            const icon = this.querySelector('.dropdown-icon');
            if (icon) {
                icon.style.transform = advancedFiltersPanel.classList.contains('show') ? 'rotate(180deg)' : '';
            }
        });
        
        // Fermer le panel avec le bouton X
        const closePanelBtn = advancedFiltersPanel.querySelector('.close-panel');
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', function() {
                advancedFiltersPanel.classList.remove('show');
                const icon = advancedFiltersBtn.querySelector('.dropdown-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        }
        
        // Appliquer les filtres
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                const statusFilter = document.getElementById('statusFilter').value;
                const dateFilter = document.getElementById('dateFilter').value;
                
                console.log('Application des filtres:', { statusFilter, dateFilter });
                applyAdvancedFilters(statusFilter, dateFilter);
                advancedFiltersPanel.classList.remove('show');
            });
        }
        
        // Réinitialiser les filtres
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                document.getElementById('statusFilter').value = 'all';
                document.getElementById('dateFilter').value = 'all';
                console.log('Filtres réinitialisés');
                resetFilters();
            });
        }
    }
    
    // ===== FILTRES RAPIDES =====
    
    // Recherche
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value;
            
            // Attendre 500ms après la dernière frappe avant de faire la requête
            searchTimeout = setTimeout(() => {
                console.log('Recherche côté serveur:', searchTerm);
                applyServerFilter('search', searchTerm);
            }, 500);
        });
    }
    
    // Effacer la recherche
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            applyServerFilter('search', '');
        });
    }
    
    // Filtres par statut
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            // Retirer la classe active de tous les chips
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            // Ajouter la classe active au chip cliqué
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Filtre statut côté serveur:', filter);
            applyServerFilter('status', filter);
        });
    });
    
    // Fonction pour appliquer les filtres côté serveur
    function applyServerFilter(type, value) {
        // Afficher un indicateur de chargement
        showLoadingIndicator();
        
        const currentUrl = new URL(window.location);
        
        if (type === 'search') {
            if (value && value.trim()) {
                currentUrl.searchParams.set('search', value.trim());
            } else {
                currentUrl.searchParams.delete('search');
            }
        } else if (type === 'status') {
            if (value && value !== 'all') {
                currentUrl.searchParams.set('status', value);
            } else {
                currentUrl.searchParams.delete('status');
            }
        }
        
        // Réinitialiser la pagination
        currentUrl.searchParams.delete('page');
        
        console.log('Redirection vers:', currentUrl.toString());
        window.location.href = currentUrl.toString();
    }
    
    function showLoadingIndicator() {
        // Supprimer l'indicateur existant s'il y en a un
        const existingIndicator = document.getElementById('loadingIndicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Créer un indicateur de chargement
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Chargement des données...</p>
                </div>
            </div>
        `;
        
        // Ajouter au body
        document.body.appendChild(loadingDiv);
        
        // Styles pour l'indicateur de chargement
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .loading-spinner {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .loading-spinner i {
                font-size: 2rem;
                color: #e67e22;
                margin-bottom: 1rem;
            }
            
            .loading-spinner p {
                margin: 0;
                color: #333;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // ===== BOUTONS D'ACTION DES COMMANDES =====
    
    // Voir les détails
    document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
            console.log('Voir détails commande:', orderId);
            viewOrderDetails(orderId);
        });
    });
    
    // Changer le statut
    document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
            console.log('Changer statut commande:', orderId);
            openStatusModal(orderId);
        });
    });
    
    // Définir échéance
    document.querySelectorAll('.deadline-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
            console.log('Définir échéance commande:', orderId);
            openDeadlineModal(orderId);
        });
    });
    
    // Supprimer
    document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
            console.log('Supprimer commande:', orderId);
            openDeleteModal(orderId);
        });
    });
    
    // ===== FONCTIONS DE FILTRAGE =====
    
    function filterTableBySearch(searchTerm) {
        activeSearchTerm = searchTerm;
        console.log('Recherche avec le terme:', searchTerm);
        applyAllFilters();
    }
    
    function filterTableByStatus(status) {
        activeStatusFilter = status;
        console.log('Filtrage par statut:', status);
        applyAllFilters();
    }
    
    function applyAllFilters() {
        const rows = document.querySelectorAll('.orders-table tbody tr');
        console.log('Application de tous les filtres:', { search: activeSearchTerm, status: activeStatusFilter });
        
        rows.forEach(row => {
            let shouldShow = true;
            
            // Filtre par statut
            if (activeStatusFilter !== 'all') {
                const statusCell = row.querySelector('.status-badge');
                if (statusCell) {
                    const statusText = statusCell.textContent.toLowerCase().trim();
                    
                    const statusMapping = {
                        'en_attente': ['en attente'],
                        'en_cours': ['en cours'],
                        'termine': ['terminé', 'terminée'],
                        'recupere': ['récupérée', 'récupéré']
                    };
                    
                    const matchingStatuses = statusMapping[activeStatusFilter] || [];
                    const statusMatch = matchingStatuses.some(match => statusText.includes(match));
                    
                    if (!statusMatch) {
                        shouldShow = false;
                    }
                } else {
                    shouldShow = false;
                }
            }
            
            // Filtre par recherche
            if (shouldShow && activeSearchTerm) {
                const cells = row.querySelectorAll('td');
                let found = false;
                
                cells.forEach(cell => {
                    const cellText = cell.textContent.toLowerCase().trim();
                    if (cellText.includes(activeSearchTerm.toLowerCase())) {
                        found = true;
                    }
                });
                
                if (!found) {
                    shouldShow = false;
                }
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
        
        console.log('Filtrage terminé');
    }
    
    function applyAdvancedFilters(status, date) {
        console.log('Application des filtres avancés:', { status, date });
        // TODO: Implémenter la logique de filtrage avancé
        showNotification('Filtres appliqués', 'success');
    }
    
    function resetFilters() {
        // Réinitialiser tous les filtres
        document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
        document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
        
        const rows = document.querySelectorAll('.orders-table tbody tr');
        rows.forEach(row => row.style.display = '');
        
        showNotification('Filtres réinitialisés', 'info');
    }
    
    // ===== FONCTIONS DES MODALS =====
    
    function viewOrderDetails(orderId) {
        // Charger les détails de la commande via AJAX
        console.log('Chargement des détails pour la commande:', orderId);
        
        const formData = new FormData();
        formData.append('action', 'get_details');
        formData.append('commande_id', orderId);
        
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remplir le modal avec les données
                fillOrderDetailsModal(data.commande);
                openModal('viewOrderModal');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showNotification('Erreur lors du chargement des détails', 'error');
        });
    }
    
    function fillOrderDetailsModal(commande) {
        // Remplir les champs du modal avec les données de la commande
        const modal = document.getElementById('viewOrderModal');
        if (!modal) return;
        
        // Remplir les détails de base
        modal.querySelector('#orderReference').textContent = commande.reference;
        modal.querySelector('#orderDate').textContent = commande.date_creation;
        modal.querySelector('#orderStatus').textContent = getStatusDisplay(commande.status);
        modal.querySelector('#orderClient').textContent = commande.client_nom;
        modal.querySelector('#orderProduct').textContent = commande.produit_nom;
        modal.querySelector('#orderAmount').textContent = commande.montant + ' XOF';
        
        if (commande.date_echeance) {
            modal.querySelector('#orderDeadline').textContent = commande.date_echeance;
        } else {
            modal.querySelector('#orderDeadline').textContent = 'À définir';
        }
        
        // Remplir les mesures si disponibles
        if (commande.mesures) {
            const mesuresSection = modal.querySelector('.mesures-section');
            if (mesuresSection) {
                Object.keys(commande.mesures).forEach(key => {
                    const element = mesuresSection.querySelector(`[data-mesure="${key}"]`);
                    if (element) {
                        element.textContent = commande.mesures[key];
                    }
                });
            }
        }
    }
    
    function getStatusDisplay(status) {
        const statusMap = {
            'en_attente': 'En attente',
            'en_cours': 'En cours',
            'termine': 'Terminé',
            'recupere': 'Récupérée'
        };
        return statusMap[status] || status;
    }
    
    function openStatusModal(orderId) {
        console.log('Ouverture modal statut pour la commande:', orderId);
        
        // Pré-remplir l'ID de la commande dans le modal
        const modal = document.getElementById('changeStatusModal');
        if (modal) {
            const commandeIdInput = modal.querySelector('#statusCommandeId');
            if (commandeIdInput) {
                commandeIdInput.value = orderId;
            }
        }
        
        openModal('changeStatusModal');
    }
    
    function openDeadlineModal(orderId) {
        console.log('Ouverture modal échéance pour la commande:', orderId);
        
        // Pré-remplir l'ID de la commande dans le modal
        const modal = document.getElementById('setDeadlineModal');
        if (modal) {
            const commandeIdInput = modal.querySelector('#deadlineCommandeId');
            if (commandeIdInput) {
                commandeIdInput.value = orderId;
            }
        }
        
        openModal('setDeadlineModal');
    }
    
    function openDeleteModal(orderId) {
        console.log('Ouverture modal suppression pour la commande:', orderId);
        
        // Pré-remplir l'ID de la commande dans le modal
        const modal = document.getElementById('deleteOrderModal');
        if (modal) {
            const commandeIdInput = modal.querySelector('#deleteCommandeId');
            if (commandeIdInput) {
                commandeIdInput.value = orderId;
            }
        }
        
        openModal('deleteOrderModal');
    }
    
    // ===== NOTIFICATIONS =====
    
  function showNotification(message, type = 'info') {
        // Créer l'élément de notification
    const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
      </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
        // Ajouter au DOM
    document.body.appendChild(notification);
    
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);
    
        // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Fermer manuellement
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // ===== TRI DES COLONNES =====
    
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;
            const currentSort = getCurrentSort();
            let newSort;
            
            // Déterminer le nouveau tri
            if (currentSort === column) {
                newSort = '-' + column; // Tri descendant
            } else if (currentSort === '-' + column) {
                newSort = column; // Tri ascendant
            } else {
                newSort = column; // Nouveau tri ascendant
            }
            
            console.log('Tri de la colonne:', column, 'nouveau tri:', newSort);
            applyServerSort(newSort);
        });
    });
    
    function getCurrentSort() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('sort') || '-date_creation';
    }
    
    function applyServerSort(sort) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sort', sort);
        
        // Réinitialiser la pagination
        currentUrl.searchParams.delete('page');
        
        console.log('Redirection avec tri:', currentUrl.toString());
        window.location.href = currentUrl.toString();
    }
    
    // ===== INITIALISATION =====
    
    console.log('Orders.js initialisé avec succès');
    
    // Vérifier que tous les éléments sont bien chargés
    const elements = {
        newOrderBtn: !!newOrderBtn,
        refreshBtn: !!refreshBtn,
        exportBtn: !!exportBtn,
        searchInput: !!searchInput,
        advancedFiltersBtn: !!advancedFiltersBtn
    };
    
    console.log('Éléments chargés:', elements);
}); 