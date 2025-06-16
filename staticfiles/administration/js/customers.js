// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // État moderne de l'application avec gestion avancée
  const appState = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 24,
    filters: {
      search: '',
      status: 'all',
      region: 'all',
      type: 'all',
      dateRange: {
        start: null,
        end: null
      }
    },
    sort: {
      field: 'name',
      direction: 'asc'
    },
    activeFilters: [],
    theme: localStorage.getItem('theme') || 'light',
    animations: {
      enabled: true,
      duration: 300
    },
    stats: {
      total: 24,
      vip: 6,
      new: 8,
      active: 18
    },
    notifications: [],
    lastUpdate: null
  };
  
  // DOM Elements
  const newClientBtn = document.getElementById('newClientBtn');
  const editClientModal = document.getElementById('editClientModal');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const closeBtns = document.querySelectorAll('.close-btn');
  const gridViewBtn = document.getElementById('gridViewBtn');
  const tableViewBtn = document.getElementById('tableViewBtn');
  const sortableHeaders = document.querySelectorAll('.sortable');
  const paginationBtns = document.querySelectorAll('.pagination-btn');
  const pageNumbers = document.querySelectorAll('.page-number');
  const searchClients = document.getElementById('searchClients');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterChips = document.querySelectorAll('.filter-chip');
  
  // Modal Nouveau Client Elements
  const newClientModal = document.getElementById('newClientModal');
  const newClientForm = document.getElementById('newClientForm'); // Used for form.reset() and submit listener
  const closeNewClientModalHeaderBtn = document.getElementById('closeNewClientModalHeaderBtn'); // For 'X' button in modal header
  const cancelNewBtn = document.getElementById('cancelNewBtn'); // For 'Annuler' button in form actions
  const printClients = document.getElementById('printClients');
  const viewBtns = document.querySelectorAll('.view-btn');
  const editBtns = document.querySelectorAll('.edit-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');

  // Initialisation des compteurs de statistiques
  function initializeStatCounters() {
    // Animation des compteurs de statistiques avec style africain
    const totalClientsElement = document.querySelector('.stat-card:nth-child(1) h3');
    const vipClientsElement = document.querySelector('.stat-card:nth-child(2) h3');
    const newClientsElement = document.querySelector('.stat-card:nth-child(3) h3');
    const activeClientsElement = document.querySelector('.stat-card:nth-child(4) h3');
    
    if (totalClientsElement) {
      animateCounter(totalClientsElement, 0, appState.stats.total, 1500);
    }
    
    if (vipClientsElement) {
      animateCounter(vipClientsElement, 0, appState.stats.vip, 1500);
    }
    
    if (newClientsElement) {
      animateCounter(newClientsElement, 0, appState.stats.new, 1500);
    }
    
    if (activeClientsElement) {
      animateCounter(activeClientsElement, 0, appState.stats.active, 1500);
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
  
  // Fonction de debounce pour limiter les appels aux fonctions
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // Fonction pour mettre à jour les informations de pagination
  function updatePaginationInfo() {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const start = (appState.currentPage - 1) * appState.itemsPerPage + 1;
      const end = Math.min(start + appState.itemsPerPage - 1, appState.totalItems);
      paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${appState.totalItems} clients`;
    }
  }
  
  // Fonction pour mettre à jour l'interface de pagination
  function updatePaginationUI() {
    // Mise à jour des numéros de page
    pageNumbers.forEach(btn => {
      const pageNum = parseInt(btn.textContent);
      if (pageNum === appState.currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Activation/désactivation des boutons précédent/suivant
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (prevBtn) {
      if (appState.currentPage === 1) {
        prevBtn.setAttribute('disabled', true);
      } else {
        prevBtn.removeAttribute('disabled');
      }
    }
    
    if (nextBtn) {
      if (appState.currentPage >= Math.ceil(appState.totalItems / appState.itemsPerPage)) {
        nextBtn.setAttribute('disabled', true);
      } else {
        nextBtn.removeAttribute('disabled');
      }
    }
  }
  
  // Fonction pour mettre à jour la liste des clients en fonction des filtres
  function updateClientsList() {
    // Simuler un chargement
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      tableContainer.classList.add('loading');
      
      setTimeout(() => {
        tableContainer.classList.remove('loading');
        
        // Animation des lignes
        const rows = document.querySelectorAll('.data-table tbody tr');
        rows.forEach((row, index) => {
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, index * 50);
        });
      }, 500);
    }
  }

  // Initialiser les compteurs au chargement
  initializeStatCounters();
  
  // Initialiser les animations des cartes de statistiques
  animateStatCards();
  
  // Gestion des filtres par chips
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      // Retirer la classe active de tous les chips
      filterChips.forEach(c => c.classList.remove('active'));
      
      // Ajouter la classe active au chip cliqué
      this.classList.add('active');
      
      // Mise à jour de l'état de l'application
      appState.filters.status = this.dataset.filter;
      appState.currentPage = 1;
      
      // Animation du chip
      this.classList.add('chip-pulse');
      setTimeout(() => this.classList.remove('chip-pulse'), 300);
      
      // Mise à jour de l'interface
      updatePaginationInfo();
      updateClientsList();
      
      console.log('Filtre par statut:', this.dataset.filter);
    });
  });
  
  // Gestion de la recherche
  if (searchClients) {
    searchClients.addEventListener('input', debounce(function() {
      // Mise à jour de l'état de l'application
      appState.filters.search = this.value;
      appState.currentPage = 1;
      
      // Mise à jour de l'interface
      updatePaginationInfo();
      updateClientsList();
      
      // Afficher/masquer le bouton d'effacement
      if (clearSearchBtn) {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
      }
      
      console.log('Recherche:', this.value);
    }, 300));
  }
  
  // Effacer la recherche
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', function() {
      searchClients.value = '';
      appState.filters.search = '';
      appState.currentPage = 1;
      
      // Masquer le bouton d'effacement
      this.style.display = 'none';
      
      // Mise à jour de l'interface
      updatePaginationInfo();
      updateClientsList();
      
      console.log('Recherche effacée');
    });
  }
  
  // Gestion de la pagination
  pageNumbers.forEach(btn => {
    btn.addEventListener('click', function() {
      // Mise à jour de l'état de l'application
      appState.currentPage = parseInt(this.textContent);
      
      // Mise à jour de l'interface
      updatePaginationUI();
      updatePaginationInfo();
      updateClientsList();
      
      console.log('Page:', appState.currentPage);
    });
  });
  
  // Boutons précédent/suivant de la pagination
  paginationBtns.forEach(btn => {
    if (!btn.classList.contains('page-number')) {
      btn.addEventListener('click', function() {
        // Déterminer si c'est le bouton précédent ou suivant
        const isNext = this.querySelector('.fa-chevron-right');
        
        // Mise à jour de l'état de l'application
        if (isNext && appState.currentPage < Math.ceil(appState.totalItems / appState.itemsPerPage)) {
          appState.currentPage++;
        } else if (!isNext && appState.currentPage > 1) {
          appState.currentPage--;
        }
        
        // Mise à jour de l'interface
        updatePaginationUI();
        updatePaginationInfo();
        updateClientsList();
        
        console.log('Page:', appState.currentPage);
      });
    }
  });
  
  // Mode d'affichage (tableau/grille)
  if (gridViewBtn && tableViewBtn) {
    tableViewBtn.addEventListener('click', function() {
      gridViewBtn.classList.remove('active');
      tableViewBtn.classList.add('active');
      
      // En situation réelle, basculer entre les modes d'affichage
      console.log('Mode tableau activé');
    });
    
    gridViewBtn.addEventListener('click', function() {
      tableViewBtn.classList.remove('active');
      gridViewBtn.classList.add('active');
      
      // En situation réelle, basculer entre les modes d'affichage
      console.log('Mode grille activé');
    });
  }
  
  // Impression de la liste des clients
  if (printClients) {
    printClients.addEventListener('click', function() {
      window.print();
    });
  }
  
  // Nouvelle commande
  if (newClientBtn) {
    newClientBtn.addEventListener('click', function() {
      editClientModal.classList.add('active');
    });
  }
  
  // Fermer les modales
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Annuler l'édition
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function() {
      editClientModal.classList.remove('active');
    });
  }
  
  // Trier les colonnes du tableau
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const sortField = this.dataset.sort;
      
      // Mise à jour de l'état de l'application
      if (appState.sort.field === sortField) {
        // Inverser la direction si on clique sur la même colonne
        appState.sort.direction = appState.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        appState.sort.field = sortField;
        appState.sort.direction = 'asc';
      }
      
      // Mise à jour de l'interface
      updateClientsList();
      
      console.log(`Tri par ${sortField} en ordre ${appState.sort.direction}`);
    });
  });
  
  // Voir les détails d'un client
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const clientId = this.dataset.id;
      console.log(`Voir les détails du client ${clientId}`);
      // Ici, vous pourriez ouvrir une modale de détails ou naviguer vers une page de détails
    });
  });
  
  // Éditer un client
  editBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const clientId = this.dataset.id;
      console.log(`Éditer le client ${clientId}`);
      editClientModal.classList.add('active');
      // Ici, vous pourriez charger les données du client dans le formulaire d'édition
    });
  });
  
  // Supprimer un client
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const clientId = this.dataset.id;
      if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${clientId} ?`)) {
        console.log(`Suppression du client ${clientId}`);
        // Ici, vous pourriez envoyer une requête pour supprimer le client
      }
    });
  });
  
  // Initialisation de l'interface
  updatePaginationInfo();
  updatePaginationUI();
  
  // Animation inspirée des motifs africains pour les cartes clients
  function animateClientCards() {
    const cards = document.querySelectorAll('.client-card');
    
    // Observer pour les animations au scroll avec motifs africains
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            entry.target.classList.add('animate-in');
            
            // Effet d'onde africaine
            const wave = document.createElement('div');
            wave.classList.add('african-wave-effect');
            entry.target.appendChild(wave);
            setTimeout(() => {
              entry.target.removeChild(wave);
            }, 1000);
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.95)';
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(card);
      
      // Effet de parallaxe inspiré des textiles africains
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        // Effet plus doux inspiré des tissus africains
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        card.style.boxShadow = `${(x - centerX) / 30}px ${(y - centerY) / 30}px 20px rgba(var(--color-primary-rgb), 0.15)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.boxShadow = 'var(--shadow-md)';
      });
    });
  }
  
  // Effet de recherche en temps réel amélioré
  function enhancedSearch() {
    const searchInput = document.getElementById('searchClients');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const searchTerm = this.value.toLowerCase().trim();
      
      // Effet de chargement
      document.body.style.cursor = 'progress';
      
      searchTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.client-card');
        
        cards.forEach(card => {
          const name = card.querySelector('.client-name').textContent.toLowerCase();
          const email = card.querySelector('.client-email').textContent.toLowerCase();
          const phone = card.querySelector('.client-phone').textContent.toLowerCase();
          
          if (name.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'slideInUp 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
        
        document.body.style.cursor = 'default';
      }, 300);
    });
  }
  
  // Effet de hover amélioré pour les cartes
  function enhancedCardHover() {
    const cards = document.querySelectorAll('.client-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      });
    });
  }
  
  // Notification toast améliorée
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Auto-suppression
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Bouton de fermeture
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    });
  }
  
  // Initialisation du bouton Nouveau client et gestion du modal
  function initializeNewClientFeature() {
    // Récupération des éléments du DOM
    const newClientBtn = document.getElementById('newClientBtn');
    const newClientModal = document.getElementById('newClientModal');
    const cancelNewBtn = document.getElementById('cancelNewBtn');
    const newClientForm = document.getElementById('newClientForm');
    const closeNewModalBtn = newClientModal.querySelector('.close-btn');
    
    // Vérification de l'existence des éléments avant de poursuivre
    if (!newClientBtn || !newClientModal || !cancelNewBtn || !newClientForm || !closeNewModalBtn) {
      console.error('Un ou plusieurs éléments du modal Nouveau client sont manquants');
      return;
    }
    
    // Fonction pour ouvrir le modal Nouveau client
    function openNewClientModal() {
      console.log('Ouverture du modal:', newClientModal);
      if (!newClientModal) {
        console.error('Le modal newClientModal est introuvable');
        return;
      }
      newClientModal.classList.add('open');
      document.body.classList.add('modal-open');
      // Animation d'entrée
      setTimeout(() => {
        const modalContent = newClientModal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.classList.add('active');
        } else {
          console.error('Impossible de trouver .modal-content dans le modal');
        }
      }, 10);
    }
    
    // Fonction pour fermer le modal Nouveau client
    function closeNewClientModal() {
      console.log('Fermeture du modal:', newClientModal);
      if (!newClientModal) {
        console.error('Le modal newClientModal est introuvable');
        return;
      }
      const modalContent = newClientModal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.classList.remove('active');
      } else {
        console.error('Impossible de trouver .modal-content dans le modal');
      }
      setTimeout(() => {
        newClientModal.classList.remove('open');
        document.body.classList.remove('modal-open');
      }, 300);
    }
    
    // Gestion de la soumission du formulaire Nouveau client
    newClientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Récupération des données du formulaire
      const formData = {
        name: document.getElementById('newName').value,
        email: document.getElementById('newEmail').value,
        phone: document.getElementById('newPhone').value,
        address: document.getElementById('newAddress').value,
        birthday: document.getElementById('newBirthday').value,
        category: document.getElementById('newCategory').value,
        source: document.getElementById('newSource').value,
        notes: document.getElementById('newNotes').value
      };
      
      // Logique de validation et d'enregistrement (simulation)
      console.log('Nouveau client à enregistrer:', formData);
      
      // Affichage d'une notification de succès avec le toast existant
      showToast('Client ajouté avec succès!', 'success', 'fas fa-check-circle');
      
      // Fermeture du modal
      closeNewClientModal();
      
      // Réinitialisation du formulaire
      newClientForm.reset();
    });
    
    // Gestionnaire d'événement pour ouvrir le modal Nouveau client
    console.log('Initialisation du bouton Nouveau client:', newClientBtn);
    if (newClientBtn) {
      newClientBtn.addEventListener('click', function(e) {
        console.log('Bouton Nouveau client cliqué');
        e.preventDefault();
        openNewClientModal();
      });
    } else {
      console.error('Le bouton Nouveau client n\'a pas été trouvé dans le DOM');
    }
    
    // Gestionnaire d'événement pour fermer le modal Nouveau client
    if(closeNewClientModalHeaderBtn) closeNewClientModalHeaderBtn.addEventListener('click', closeNewClientModal);
    if(cancelNewBtn) cancelNewBtn.addEventListener('click', closeNewClientModal);
    
    // Support pour le bouton Ajouter le client (saveNewBtn)
    const saveNewBtn = document.getElementById('saveNewBtn');
    if (saveNewBtn) {
      saveNewBtn.addEventListener('click', function(e) {
        // Le formulaire gère déjà la soumission, donc nous n'avons pas besoin d'ajouter de logique supplémentaire ici
        // Le bouton submit déclenchera l'événement submit du formulaire
      });
    }
    
    console.log('Fonctionnalité Nouveau client initialisée avec succès');
  }

    // Initialisation de l'interface utilisateur
  function initUI() {
    animateCardsEntrance();
    enhancedSearch();
    enhancedCardHover();
    setupPagination();
    initializeNewClientFeature();
  }
  
  // Appel de la fonction d'initialisation au chargement de la page
  initUI();
  
  // Ajout d'événements pour les notifications
  document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.classList.contains('edit') ? 'modifié' : 
                      this.classList.contains('delete') ? 'supprimé' : 'consulté';
        showToast(`Client ${action} avec succès!`);
      });
    });
  });
  
  // Initialiser les compteurs au chargement
  initializeStatCounters();
  
  // Initialiser les animations des cartes de statistiques
  animateStatCards();
  
  // Fonction de debounce pour limiter les appels aux fonctions
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  
  // Fonction pour mettre à jour les informations de pagination
  function updatePaginationInfo() {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      const start = (appState.currentPage - 1) * appState.itemsPerPage + 1;
      const end = Math.min(start + appState.itemsPerPage - 1, appState.totalItems);
      paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${appState.totalItems} clients`;
    }
  }
  
  // Fonction pour mettre à jour l'interface de pagination
  function updatePaginationUI() {
    // Mise à jour des numéros de page
    pageNumbers.forEach(btn => {
      const pageNum = parseInt(btn.textContent);
      if (pageNum === appState.currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Activation/désactivation des boutons précédent/suivant
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (prevBtn) {
      if (appState.currentPage === 1) {
        prevBtn.setAttribute('disabled', true);
      } else {
        prevBtn.removeAttribute('disabled');
      }
    }
    
    if (nextBtn) {
      if (appState.currentPage >= Math.ceil(appState.totalItems / appState.itemsPerPage)) {
        nextBtn.setAttribute('disabled', true);
      } else {
        nextBtn.removeAttribute('disabled');
      }
    }
  }
  
  // Fonction pour mettre à jour la liste des clients en fonction des filtres
  function updateClientsList() {
    // Simuler un chargement
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      tableContainer.classList.add('loading');
      
      setTimeout(() => {
        tableContainer.classList.remove('loading');
        
        // Mise à jour de la pagination
        updatePaginationInfo();
        
        // Animation des lignes
        const rows = document.querySelectorAll('.data-table tbody tr');
        rows.forEach((row, index) => {
          row.style.opacity = '0';
          row.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, index * 50);
        });
      }, 500);
    }
  }
  
  // Gestion des filtres par chips
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      // Retirer la classe active de tous les chips
      filterChips.forEach(c => c.classList.remove('active'));
      
      // Ajouter la classe active au chip cliqué
      this.classList.add('active');
      
      // Mise à jour de l'état de l'application
      appState.filters.status = this.dataset.filter;
      appState.currentPage = 1;
      
      // Animation du chip
      this.classList.add('chip-pulse');
      setTimeout(() => this.classList.remove('chip-pulse'), 300);
      
      // Mise à jour de l'interface
      updatePaginationInfo();
      updateClientsList();
      
      console.log('Filtre par statut:', this.dataset.filter);
    });
  });
  
  // Gestion de la recherche
  if (searchClients) {
    searchClients.addEventListener('input', debounce(function() {
      // Mise à jour de l'état de l'application
      appState.filters.search = this.value;
      appState.currentPage = 1;
      
      // Mise à jour de l'interface
      updatePaginationInfo();
      updateClientsList();
      
      // Afficher/masquer le bouton d'effacement
      if (clearSearchBtn) {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
      }
      
      console.log('Recherche:', this.value);
      
      // Recherche dans les lignes du tableau
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll('.client-table tbody tr').forEach(row => {
        const name = row.querySelector('.name-cell') ? row.querySelector('.name-cell').textContent.toLowerCase() : '';
        const email = row.querySelector('.email-cell') ? row.querySelector('.email-cell').textContent.toLowerCase() : '';
        const phone = row.querySelector('.phone-cell') ? row.querySelector('.phone-cell').textContent.toLowerCase() : '';
        
        if (name.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm)) {
          row.style.display = 'table-row';
          // Animation pour les résultats de recherche
          row.style.opacity = '0';
          row.style.transform = 'translateX(10px)';
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
          }, 150);
        } else {
          row.style.display = 'none';
        }
      });
      
      // Restaurer le curseur
      setTimeout(() => {
        document.body.style.cursor = 'default';
      }, 300);
    }, 300));
  }
  
  
  // Filtrage par catégorie
  if (filterCategory) {
    filterCategory.addEventListener('change', function() {
      const filterValue = this.value;
      const cards = document.querySelectorAll('.client-card');
      
      // Effet de chargement
      document.body.style.cursor = 'progress';
      
      cards.forEach(card => {
        // Dans une application réelle, vous auriez des attributs de données pour ces filtres
        // Ici, nous simulons simplement un comportement de filtre
        if (filterValue === 'all') {
          card.style.display = 'flex';
          card.style.opacity = '0.7';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 200);
        } else {
          // Simuler le filtrage (à remplacer par votre logique réelle)
          const hasCategory = Math.random() > 0.5;
          card.style.display = hasCategory ? 'flex' : 'none';
          if (hasCategory) {
            card.style.opacity = '0.7';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 200);
          }
        }
      });
      
      // Restaurer le curseur
      setTimeout(() => {
        document.body.style.cursor = 'default';
      }, 300);
    });
  }

  // View Toggle Functionality
  viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Remove active class from all view buttons
      viewBtns.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the view type from the data attribute
      const viewType = this.dataset.view;
      
      // Hide all view modes
      document.querySelectorAll('.view-mode').forEach(view => {
        view.classList.remove('active');
      });
      
      // Show the selected view mode
      if (viewType === 'grid') {
        clientsGrid.classList.add('active');
      } else if (viewType === 'table') {
        clientsTable.classList.add('active');
      }
    });
  });
  
  // Show New Client Form avec animation
  newClientBtn.addEventListener('click', function() {
    // Préparation à l'animation
    newClientForm.style.opacity = '0';
    newClientForm.style.transform = 'translateY(-20px)';
    newClientForm.classList.remove('hidden');
    document.getElementById('viewModes').style.display = 'none';
    
    // Animation d'apparition
    setTimeout(() => {
      newClientForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      newClientForm.style.opacity = '1';
      newClientForm.style.transform = 'translateY(0)';
    }, 50);
    
    // Focus sur le premier champ après l'animation
    setTimeout(() => {
      document.getElementById('lastName').focus();
    }, 500);
  });
  
  // Cancel New Client Form avec animation
  cancelNewClient.addEventListener('click', function() {
    // Animation de disparition
    newClientForm.style.opacity = '0';
    newClientForm.style.transform = 'translateY(-20px)';
    
    // Masquer le formulaire après l'animation
    setTimeout(() => {
      newClientForm.classList.add('hidden');
      document.getElementById('viewModes').style.display = 'block';
      
      // Réinitialiser le formulaire
      document.getElementById('clientForm').reset();
      
      // Supprimer les messages d'erreur
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }, 300);
  });
  
  // Also can be canceled with the form button
  if (cancelClientForm) {
    cancelClientForm.addEventListener('click', function() {
      // Animation de disparition
      newClientForm.style.opacity = '0';
      newClientForm.style.transform = 'translateY(-20px)';
      
      // Masquer le formulaire après l'animation
      setTimeout(() => {
        newClientForm.classList.add('hidden');
        document.getElementById('viewModes').style.display = 'block';
        
        // Réinitialiser le formulaire
        document.getElementById('clientForm').reset();
        
        // Supprimer les messages d'erreur
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      }, 300);
    });
  }
  
  // Fonctions pour la validation et la gestion des erreurs
  function showError(inputElement, message) {
    // Supprimer les erreurs existantes
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Ajouter la classe d'erreur
    inputElement.classList.add('input-error');
    
    // Créer et afficher le message d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    inputElement.parentElement.appendChild(errorElement);
  }
  
  function clearError(inputElement) {
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    inputElement.classList.remove('input-error');
  }
  
  // Validation en temps réel sur les champs du formulaire
  const requiredFields = document.querySelectorAll('#clientForm .form-group.required input');
  requiredFields.forEach(field => {
    field.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, 'Ce champ est obligatoire');
      } else {
        clearError(this);
      }
    });
    
    field.addEventListener('input', function() {
      if (this.value.trim()) {
        clearError(this);
      }
    });
  });
  
  // Validation de l'email
  const emailField = document.getElementById('email');
  if (emailField) {
    emailField.addEventListener('blur', function() {
      if (this.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
        showError(this, 'Veuillez entrer une adresse email valide');
      } else {
        clearError(this);
      }
    });
  }
  
  // Initialisation des compteurs de statistiques
  function initializeStatCounters() {
    // Animation des compteurs de statistiques
    const totalClientsElement = document.getElementById('totalClients');
    const vipClientsElement = document.getElementById('vipClients');
    const activeClientsElement = document.getElementById('activeClients');
    
    if (totalClientsElement) {
      animateCounter(totalClientsElement, 0, 24, 1500);
    }
    
    if (vipClientsElement) {
      animateCounter(vipClientsElement, 0, 6, 1500);
    }
    
    if (activeClientsElement) {
      animateCounter(activeClientsElement, 0, 18, 1500);
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
  
  // Submit New Client Form avec validation améliorée
  document.getElementById('clientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Réinitialiser toutes les erreurs
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    
    // Validation des champs obligatoires
    let hasErrors = false;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showError(field, 'Ce champ est obligatoire');
        hasErrors = true;
      }
    });
    
    // Validation de l'email si rempli
    if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      showError(emailField, 'Veuillez entrer une adresse email valide');
      hasErrors = true;
    }
    
    if (hasErrors) {
      // Faire défiler jusqu'à la première erreur
      const firstError = document.querySelector('.input-error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }
    
    // Récupérer les valeurs du formulaire
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const fullName = `${firstName} ${lastName}`;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthday = document.getElementById('birthday').value;
    const address = document.getElementById('address').value;
    
    // Animation de chargement
    const submitButton = this.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
    submitButton.disabled = true;
    
    // Simuler un appel API (remplacer par un vrai appel API dans une application réelle)
    setTimeout(() => {
      // Afficher un message de succès
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Client ${fullName} ajouté avec succès!`;
      this.appendChild(successMessage);
      
      // Faire défiler jusqu'au message
      successMessage.scrollIntoView({ behavior: 'smooth' });
      
      // Fermer le formulaire après un délai
      setTimeout(() => {
        // Réinitialiser le formulaire
        this.reset();
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        successMessage.remove();
        
        // Animation de fermeture
        newClientForm.style.opacity = '0';
        newClientForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          newClientForm.classList.add('hidden');
          document.getElementById('viewModes').style.display = 'block';
          
          // Dans une application réelle, vous ajouteriez le client à la grille et au tableau
          // addClientToGrid(firstName, lastName, email, phone, address, birthday);
          // addClientToTable(firstName, lastName, email, phone, address, birthday);
        }, 300);
      }, 1500);
    }, 1000); // Simuler un délai réseau de 1 seconde
  });
  
  // Open Edit Client Modal when Edit button is clicked
  editBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const clientId = this.dataset.id;
      editClientModal.classList.add('active');
      
      // In a real app, you would fetch the client details by ID
      // and populate the edit form
      // Here, we'll just set some dummy data for demonstration
      populateEditForm(clientId);
    });
  });
  
  // Cancel Edit in modal
  cancelEditBtn.addEventListener('click', function() {
    editClientModal.classList.remove('active');
  });
  
  // Close modals when clicking the X buttons
  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      editClientModal.classList.remove('active');
    });
  });
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === editClientModal) {
      editClientModal.classList.remove('active');
    }
  });
  
  // Sortable Table Headers
  sortableHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      const sortType = this.dataset.sort;
      
      // In a real app, you would sort the data here
      console.log(`Sorting by ${sortType}`);
      
      // Toggle the sort direction
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-sort')) {
        // First click, sort ascending
        sortableHeaders.forEach(h => h.querySelector('i').className = 'fas fa-sort');
        icon.className = 'fas fa-sort-up';
      } else if (icon.classList.contains('fa-sort-up')) {
        // Second click, sort descending
        icon.className = 'fas fa-sort-down';
      } else {
        // Third click, reset
        icon.className = 'fas fa-sort';
      }
    });
  });
  
  // Pagination Buttons
  pageNumbers.forEach(function(btn) {
    btn.addEventListener('click', function() {
      pageNumbers.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // In a real app, you would fetch the corresponding page of data
      const page = this.textContent;
      console.log(`Fetching page ${page}`);
      
      // Update the pagination info
      document.querySelector('.current-range').textContent = `${(page - 1) * 5 + 1}-${page * 5}`;
    });
  });
  
  // Next/Previous pagination
  if (paginationBtns.length > 0) {
    // Previous button
    paginationBtns[0].addEventListener('click', function() {
      if (!this.disabled) {
        const activePage = document.querySelector('.page-number.active');
        const prevPage = activePage.previousElementSibling;
        if (prevPage && prevPage.classList.contains('page-number')) {
          activePage.classList.remove('active');
          prevPage.classList.add('active');
          
          // Update buttons state
          paginationBtns[1].disabled = false;
          if (!prevPage.previousElementSibling || !prevPage.previousElementSibling.classList.contains('page-number')) {
            this.disabled = true;
          }
          
          // Update the pagination info
          const page = parseInt(prevPage.textContent);
          document.querySelector('.current-range').textContent = `${(page - 1) * 5 + 1}-${page * 5}`;
        }
      }
    });
    
    // Next button
    paginationBtns[1].addEventListener('click', function() {
      if (!this.disabled) {
        const activePage = document.querySelector('.page-number.active');
        const nextPage = activePage.nextElementSibling;
        if (nextPage && nextPage.classList.contains('page-number')) {
          activePage.classList.remove('active');
          nextPage.classList.add('active');
          
          // Update buttons state
          paginationBtns[0].disabled = false;
          if (!nextPage.nextElementSibling || !nextPage.nextElementSibling.classList.contains('page-number')) {
            this.disabled = true;
          }
          
          // Update the pagination info
          const page = parseInt(nextPage.textContent);
          document.querySelector('.current-range').textContent = `${(page - 1) * 5 + 1}-${page * 5}`;
        }
      }
    });
  }
  
  // Rows Per Page Change
  if (rowsPerPage) {
    rowsPerPage.addEventListener('change', function() {
      const count = this.value;
      console.log(`Showing ${count} rows per page`);
      
      // In a real app, you would update the table with the new row count
      // and also update the pagination controls
      
      // For demo, just update the pagination info
      const activePage = document.querySelector('.page-number.active').textContent;
      document.querySelector('.current-range').textContent = `${(activePage - 1) * count + 1}-${Math.min(activePage * count, 24)}`;
    });
  }

  // Action buttons in table
  document.querySelectorAll('.action-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('title');
      const row = this.closest('.data-row');
      const clientName = row.querySelector('.client-name').textContent;
      
      if (action === 'Éditer') {
        editClientModal.classList.add('active');
        // In a real app, you would populate the edit form with this client's data
        console.log(`Editing client: ${clientName}`);
      } else if (action === 'Supprimer') {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${clientName} ?`)) {
          // In a real app, you would call an API to delete the client
          console.log(`Deleting client: ${clientName}`);
          // Then remove the row from the DOM
          row.style.opacity = '0';
          setTimeout(() => row.remove(), 300);
        }
      } else if (action === 'Voir détails') {
        // In a real app, you would navigate to the client details page
        console.log(`Viewing details for client: ${clientName}`);
      } else if (action === 'Nouvelle commande') {
        // In a real app, you would open the new order form for this client
        console.log(`Creating new order for client: ${clientName}`);
      }
    });
  });
  
  // Export Clients Button
  const exportBtn = document.getElementById('exportClients');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      // In a real app, you would generate a CSV or Excel file
      alert('Export des clients en cours...');
      console.log('Exporting clients data');
    });
  }
  
  // Save Edit Client form
  saveEditBtn.addEventListener('click', function() {
    // Form validation
    const name = document.getElementById('editName').value;
    if (!name) {
      alert('Le nom du client est requis');
      return;
    }
    
    const phone = document.getElementById('editPhone').value;
    if (!phone) {
      alert('Le téléphone du client est requis');
      return;
    }
    
    // In a real app, this would update the client data
    alert(`Client modifié: ${name}`);
    
    // Close the modal
    editClientModal.classList.remove('active');
    
    // In a production app, you would update the client card in the UI
  });
  
  // Delete Client
  deleteBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const clientId = this.dataset.id;
      // Get the client name from the card
      const clientName = this.closest('.client-card').querySelector('h3').textContent;
      
      if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${clientName}" ?`)) {
        // In a real app, this would be an API call to delete the client
        alert(`Client supprimé: ${clientName}`);
        
        // In a production app, you would remove the client card from the UI
        // this.closest('.client-card').remove();
      }
    });
  });
  
  // Search Clients
  searchClients.addEventListener('input', function() {
    const searchText = this.value.toLowerCase();
    const clientCards = document.querySelectorAll('.client-card');
    
    clientCards.forEach(function(card) {
      const clientName = card.querySelector('h3').textContent.toLowerCase();
      const clientEmail = card.querySelector('.info-item:nth-child(1) span').textContent.toLowerCase();
      const clientPhone = card.querySelector('.info-item:nth-child(2) span').textContent.toLowerCase();
      
      // Show the card if it matches the search
      if (clientName.includes(searchText) || 
          clientEmail.includes(searchText) || 
          clientPhone.includes(searchText)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Function to populate the edit form with client data
  function populateEditForm(clientId) {
    // In a real app, you would fetch the client data by ID
    // For this demo, we'll use hardcoded data
    let clientData;
    
    switch(clientId) {
      case '1':
        clientData = {
          name: 'Marie Dupont',
          email: 'marie.dupont@email.com',
          phone: '06 12 34 56 78',
          address: '15 rue de Paris, 75001 Paris',
          notes: 'Préfère les rendez-vous le matin',
          isVIP: true,
          birthday: '1985-06-15'
        };
        break;
      case '2':
        clientData = {
          name: 'Jean Martin',
          email: 'jean.martin@email.com',
          phone: '07 23 45 67 89',
          address: '8 avenue Victor Hugo, 75016 Paris',
          notes: 'Client fidèle depuis 2018',
          isVIP: false,
          birthday: '1975-03-22'
        };
        break;
      // Add cases for other clients as needed
      default:
        clientData = {
          name: '',
          email: '',
          phone: '',
          address: '',
          notes: '',
          isVIP: false,
          birthday: ''
        };
    }
    
    // Populate the form fields
    document.getElementById('editName').value = clientData.name;
    document.getElementById('editEmail').value = clientData.email;
    document.getElementById('editPhone').value = clientData.phone;
    document.getElementById('editAddress').value = clientData.address;
    document.getElementById('editNotes').value = clientData.notes;
    document.getElementById('editIsVIP').checked = clientData.isVIP;
    document.getElementById('editBirthday').value = clientData.birthday;
  }

