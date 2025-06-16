// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des compteurs de statistiques
  function initializeStatCounters() {
    // Animation des compteurs de statistiques
    const totalOrdersElement = document.getElementById('totalOrders');
    const pendingOrdersElement = document.getElementById('pendingOrders');
    const completedOrdersElement = document.getElementById('completedOrders');
    
    if (totalOrdersElement) {
      animateCounter(totalOrdersElement, 0, 24, 1500);
    }
    
    if (pendingOrdersElement) {
      animateCounter(pendingOrdersElement, 0, 10, 1500);
    }
    
    if (completedOrdersElement) {
      animateCounter(completedOrdersElement, 0, 6, 1500);
    }
  }
  
  // Animation de compteur avec style africain
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Utilisation d'une courbe d'accélération inspirée des rythmes africains
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      element.textContent = Math.floor(easeProgress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Initialiser les compteurs au chargement
  initializeStatCounters();

  // Animation des cartes de statistiques
  function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
      // Effet d'entrée décalé
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
      
      // Effet de hover inspiré des tissus africains
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.03)';
        card.style.boxShadow = 'var(--shadow-xl)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-md)';
      });
    });
  }
  
  // Initialiser les animations des cartes de statistiques
  animateStatCards();

  // État moderne de l'application avec gestion avancée
  const appState = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 18,
    filters: {
      search: '',
      status: 'all',
      priority: 'all',
      date: 'all',
      client: 'all',
      priceMin: 0,
      priceMax: 100000,
      dateRange: {
        start: null,
        end: null
      }
    },
    sort: {
      field: 'date',
      direction: 'desc'
    },
    activeFilters: [],
    theme: localStorage.getItem('theme') || 'light',
    animations: {
      enabled: true,
      duration: 300
    },
    stats: {
      total: 24,
      pending: 10,
      completed: 6,
      cancelled: 3,
      revenue: 125000,
      growth: 15
    },
    notifications: [],
    lastUpdate: null
  };

  // Elements for New Order Modal
  const newOrderBtn = document.getElementById('newOrderBtn');
  const newOrderModal = document.getElementById('newOrderModal');
  const cancelOrderBtn = document.getElementById('cancelOrderBtn');
  const saveOrderBtn = document.getElementById('saveOrderBtn');
  const closeBtns = document.querySelectorAll('.close-btn');
  
  // Elements for New Client Modal
  const newClientBtn = document.getElementById('newClientBtn');
  const newClientModal = document.getElementById('newClientModal');
  const cancelClientBtn = document.getElementById('cancelClientBtn');
  const saveClientBtn = document.getElementById('saveClientBtn');
  
  // Elements for Filters
  const searchOrders = document.getElementById('searchOrders');
  const clearSearchBtn = document.getElementById('clearSearch');
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const dateFilter = document.getElementById('dateFilter');
  const resetFilters = document.getElementById('resetFilters');
  
  // Éléments pour les filtres avancés
  const filterChips = document.querySelectorAll('.filter-chip');
  const advancedFiltersBtn = document.getElementById('advancedFiltersBtn');
  const advancedFiltersPanel = document.getElementById('advancedFiltersPanel');
  const closeAdvancedFiltersBtn = document.querySelector('.close-panel');
  const resetAdvancedFiltersBtn = document.getElementById('resetAdvancedFilters');
  const applyAdvancedFiltersBtn = document.getElementById('applyAdvancedFilters');
  const dateRangeFilter = document.getElementById('dateRangeFilter');
  const customDateRange = document.getElementById('customDateRange');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const minPriceRange = document.getElementById('minPriceRange');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const clientFilter = document.getElementById('clientFilter');
  
  // Elements for Order Actions
  const viewBtns = document.querySelectorAll('.view-btn');
  const editBtns = document.querySelectorAll('.edit-btn');
  const statusBtns = document.querySelectorAll('.status-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');
  
  // Amélioration du thème avec transition africaine
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
  themeToggle.addEventListener('click', function() {
    // Créer un effet de transition pour le changement de thème
    const overlay = document.createElement('div');
    overlay.classList.add('theme-transition-overlay');
    document.body.appendChild(overlay);
    
    // Animation de l'overlay
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 50);
    
    // Changer le thème après l'animation
    setTimeout(() => {
      document.body.classList.toggle('dark-theme');
      const icon = themeToggle.querySelector('i');
      if (icon.classList.contains('fa-moon')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      
      // Fermer l'overlay
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 500);
    }, 500);
  });
  }
  
  // Show New Order Modal
  if (newOrderBtn) {
  newOrderBtn.addEventListener('click', function() {
    newOrderModal.classList.add('active');
  });
  }
  
  // Show New Client Modal
  if (newClientBtn) {
  newClientBtn.addEventListener('click', function() {
    newClientModal.classList.add('active');
  });
  }
  
  // Close modals when clicking the cancel buttons
  if (cancelOrderBtn) {
  cancelOrderBtn.addEventListener('click', function() {
    newOrderModal.classList.remove('active');
  });
  }
  
  if (cancelClientBtn) {
  cancelClientBtn.addEventListener('click', function() {
    newClientModal.classList.remove('active');
  });
  }
  
  // Close modals when clicking the X buttons
  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (newOrderModal) newOrderModal.classList.remove('active');
      if (newClientModal) newClientModal.classList.remove('active');
    });
  });
  
  // Close modals when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === newOrderModal) {
      newOrderModal.classList.remove('active');
    }
    if (event.target === newClientModal) {
      newClientModal.classList.remove('active');
    }
  });
  
  // Submit New Order Form
  if (saveOrderBtn) {
  saveOrderBtn.addEventListener('click', function() {
    const form = document.getElementById('newOrderForm');
    
    // Client validation
    const client = document.getElementById('orderClient').value;
    if (!client) {
      alert('Veuillez sélectionner un client');
      return;
    }
    
    // Service validation
    const service = document.getElementById('orderService').value;
    if (!service) {
      alert('Veuillez sélectionner un service');
      return;
    }
    
    // Amount validation
    const amount = document.getElementById('orderAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }
    
    // Deadline validation
    const deadline = document.getElementById('orderDeadline').value;
    if (!deadline) {
      alert('Veuillez sélectionner une date d\'échéance');
      return;
    }
    
    // If validation passes, add the new order (in a real app, this would be an API call)
    alert(`Commande créée pour ${client} : ${service} - ${amount} €`);
    
    // Reset form and close modal
    form.reset();
    newOrderModal.classList.remove('active');
  });
  }
  
  // Submit New Client Form
  if (saveClientBtn) {
  saveClientBtn.addEventListener('click', function() {
    const form = document.getElementById('newClientForm');
    
    // Name validation
    const name = document.getElementById('clientName').value;
    if (!name) {
      alert('Le nom du client est requis');
      return;
    }
    
    // Phone validation
    const phone = document.getElementById('clientPhone').value;
    if (!phone) {
      alert('Le téléphone du client est requis');
      return;
    }
    
    // If validation passes, add the new client
    alert(`Client ajouté : ${name}`);
    
    // Reset form and close modal
    form.reset();
    newClientModal.classList.remove('active');
    
    // Add the new client to the order client select
    const orderClientSelect = document.getElementById('orderClient');
      if (orderClientSelect) {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    orderClientSelect.add(option);
    
    // Select the new client
    orderClientSelect.value = name;
      }
  });
  }
  
  // Reset Filters
  if (resetFilters) {
  resetFilters.addEventListener('click', function() {
      if (searchOrders) searchOrders.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (priorityFilter) priorityFilter.value = 'all';
      if (dateFilter) dateFilter.value = 'all';
    
    // Update app state
    appState.filters = {
      search: '',
      status: 'all',
      priority: 'all',
      date: 'all'
    };
    appState.currentPage = 1;
    
    // Update UI
    updatePaginationInfo();
    highlightActiveFilters();
    
    // Visual feedback for reset
    this.classList.add('btn-animated');
    setTimeout(() => this.classList.remove('btn-animated'), 300);
  });
  }
  
  // Debounce function to limit how often a function can run
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Filter orders as user types in search
  if (searchOrders) {
  searchOrders.addEventListener('input', debounce(function() {
    // Update app state
    appState.filters.search = this.value;
    appState.currentPage = 1;
    
    // Update UI
    updatePaginationInfo();
  }, 300));
  }
  
  // Filter orders when status changes
  if (statusFilter) {
  statusFilter.addEventListener('change', function() {
    // Update app state
    appState.filters.status = this.value;
    appState.currentPage = 1;
    
    // Update UI
    updatePaginationInfo();
    highlightActiveFilters();
    
    // Visual feedback
    animateElement(this);
  });
  }
  
  // Filter orders when priority changes
  if (priorityFilter) {
  priorityFilter.addEventListener('change', function() {
    // Update app state
    appState.filters.priority = this.value;
    appState.currentPage = 1;
    
    // Update UI
    updatePaginationInfo();
    highlightActiveFilters();
    
    // Visual feedback
    animateElement(this);
  });
  }
  
  // Filter orders when date range changes
  if (dateFilter) {
  dateFilter.addEventListener('change', function() {
    // Update app state
    appState.filters.date = this.value;
    appState.currentPage = 1;
    
    // Update UI
    updatePaginationInfo();
    highlightActiveFilters();
    
    // Visual feedback
    animateElement(this);
  });
  }
  
  // View Order Details
  viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
      const row = this.closest('tr');
      const clientName = row.cells[2].textContent;
      const service = row.cells[3].textContent;
      
      // Show notification instead of alert
      showNotification(`Consultation des détails de la commande ${orderId} pour ${clientName}`, 'info');
      
      // Add visual feedback
      row.classList.add('row-highlight');
      setTimeout(() => row.classList.remove('row-highlight'), 1500);
    });
  });
  
  // Edit Order
  editBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
      const row = this.closest('tr');
      const clientName = row.cells[2].textContent;
      
      // Show notification instead of alert
      showNotification(`Modification de la commande ${orderId} pour ${clientName}`, 'info');
      
      // Add visual feedback
      row.classList.add('row-edit');
      setTimeout(() => row.classList.remove('row-edit'), 1500);
    });
  });
  
  // Change Order Status
  statusBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
      const row = this.closest('tr');
      const statusCell = row.cells[4];
      const statusBadge = statusCell.querySelector('.status-badge');
      const currentStatus = statusBadge.textContent.trim();
      
      // Array of possible statuses
      const statuses = ['En attente', 'En cours', 'Terminé', 'Annulé'];
      const currentIndex = statuses.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      
      // Update badge (in a real app, this would be after an API call)
      statusBadge.textContent = statuses[nextIndex];
      
      // Update class
      statusBadge.className = 'status-badge';
      switch(statuses[nextIndex]) {
        case 'En attente':
          statusBadge.classList.add('pending');
          break;
        case 'En cours':
          statusBadge.classList.add('in-progress');
          break;
        case 'Terminé':
          statusBadge.classList.add('completed');
          break;
        case 'Annulé':
          statusBadge.classList.add('canceled');
          break;
      }
      
      // Show notification
      showNotification(`Statut de la commande ${orderId} changé en ${statuses[nextIndex]}`, 'success');
    });
  });
  
  // Delete Order
  deleteBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.id;
      const row = this.closest('tr');
      
      // Add animation class to highlight the row being deleted
      row.classList.add('row-delete-highlight');
      
      // Use a custom confirm dialog instead of the browser's default
      const confirmDialog = document.createElement('div');
      confirmDialog.classList.add('confirm-dialog');
      confirmDialog.innerHTML = `
        <div class="confirm-dialog-content">
          <h3>Confirmer la suppression</h3>
          <p>Êtes-vous sûr de vouloir supprimer la commande ${orderId} ?</p>
          <div class="confirm-actions">
            <button class="btn outline-btn" id="cancelDelete">Annuler</button>
            <button class="btn danger-btn" id="confirmDelete">Supprimer</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(confirmDialog);
      
      // Show the dialog with animation
      setTimeout(() => confirmDialog.classList.add('active'), 10);
      
      // Handle cancel button
      document.getElementById('cancelDelete').addEventListener('click', function() {
        confirmDialog.classList.remove('active');
        row.classList.remove('row-delete-highlight');
        setTimeout(() => confirmDialog.remove(), 300);
      });
      
      // Handle confirm button
      document.getElementById('confirmDelete').addEventListener('click', function() {
        confirmDialog.classList.remove('active');
        
        // Add delete animation
        row.classList.add('row-deleted');
        
        setTimeout(() => {
          // Remove the dialog
          confirmDialog.remove();
          
          // Remove the row (with animation)
          row.style.height = '0';
          row.style.padding = '0';
          row.style.margin = '0';
          row.style.overflow = 'hidden';
          
          setTimeout(() => {
            row.remove();
            // Update pagination info
            appState.totalOrders--;
            updatePaginationInfo();
            showNotification(`Commande ${orderId} supprimée avec succès`, 'success');
          }, 300);
        }, 300);
      });
    });
  });
  
  // Pagination functionality
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  const pageNumbers = document.querySelectorAll('.page-number');
  const rowsPerPageSelect = document.querySelector('.rows-per-page');
  
  // Handle pagination button clicks
  paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.disabled) return;
      
      if (this.innerHTML.includes('fa-chevron-left')) {
        if (appState.currentPage > 1) {
          appState.currentPage--;
          updatePaginationUI();
        }
      } else if (this.innerHTML.includes('fa-chevron-right')) {
        const maxPage = Math.ceil(appState.totalOrders / appState.rowsPerPage);
        if (appState.currentPage < maxPage) {
          appState.currentPage++;
          updatePaginationUI();
        }
      }
    });
  });
  
  // Handle page number clicks
  pageNumbers.forEach(button => {
    button.addEventListener('click', function() {
      appState.currentPage = parseInt(this.textContent);
      updatePaginationUI();
    });
  });
  
  // Handle rows per page selection
  if (rowsPerPageSelect) {
  rowsPerPageSelect.addEventListener('change', function() {
    appState.rowsPerPage = parseInt(this.value);
    appState.currentPage = 1; // Reset to first page when changing rows per page
    updatePaginationUI();
  });
  }
  
  // Update pagination UI
  function updatePaginationUI() {
    // Update active page number
    pageNumbers.forEach(button => {
      if (parseInt(button.textContent) === appState.currentPage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update pagination info
    updatePaginationInfo();
    
    // Update previous/next buttons
    paginationButtons[0].disabled = appState.currentPage === 1;
    const maxPage = Math.ceil(appState.totalOrders / appState.rowsPerPage);
    paginationButtons[1].disabled = appState.currentPage === maxPage;
    
    // Visual feedback
    animateTable();
  }
  
  // Update pagination info text
  function updatePaginationInfo() {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
    const start = (appState.currentPage - 1) * appState.rowsPerPage + 1;
    const end = Math.min(start + appState.rowsPerPage - 1, appState.totalOrders);
    paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${appState.totalOrders} commandes`;
    }
  }
  
  // Visual feedback for filter changes
  function highlightActiveFilters() {
    // Status filter
    if (statusFilter) {
    if (appState.filters.status !== 'all') {
      statusFilter.classList.add('active-filter');
    } else {
      statusFilter.classList.remove('active-filter');
      }
    }
    
    // Priority filter
    if (priorityFilter) {
    if (appState.filters.priority !== 'all') {
      priorityFilter.classList.add('active-filter');
    } else {
      priorityFilter.classList.remove('active-filter');
      }
    }
    
    // Date filter
    if (dateFilter) {
    if (appState.filters.date !== 'all') {
      dateFilter.classList.add('active-filter');
    } else {
      dateFilter.classList.remove('active-filter');
      }
    }
  }
  
  // Animate element for visual feedback
  function animateElement(element) {
    element.classList.add('element-updated');
    setTimeout(() => element.classList.remove('element-updated'), 300);
  }
  
  // Animate table rows when changing pages
  function animateTable() {
    const tableRows = document.querySelectorAll('.orders-table tbody tr');
    tableRows.forEach((row, index) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(10px)';
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, 50 * index); // Staggered animation
    });
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      </div>
      <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Animate out and remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Initialize the UI
  updatePaginationInfo();
  updatePaginationUI();
});
