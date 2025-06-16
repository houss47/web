/**
 * Models Management JavaScript
 * Handles functionality for the models/catalog management page with enhanced African-inspired animations
 * Couture Hub - Plateforme de gestion d'ateliers de couture africaine
 */

// Définition des animations africaines
const africanAnimations = {
  fadeInUp: [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
  fadeInLeft: [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'translateX(0)' }],
  fadeInRight: [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }],
  pulse: [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
  shake: [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }],
  bounce: [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }]
};

// Options d'animation par défaut
const defaultAnimationOptions = {
  duration: 500,
  easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fill: 'forwards'
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing components...');
  
  // Initialize components
  initializeModals();
  initializeFilters();
  initializeImagePreview();
  initializeActions();
  initializeSidebar();
  animatePageElements();
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const icon = this.querySelector('i');
      if (icon) {
      if (icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
      }
      }
    });
  }
});

/**
 * Animer les éléments de la page au chargement
 */
function animatePageElements() {
  // Animer les cartes statistiques
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.animate(africanAnimations.fadeInUp, {
        ...defaultAnimationOptions,
        delay: index * 100
      });
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 100));
  });
  
  // Animer la barre de filtres
  const filtersBar = document.querySelector('.quick-filters-bar');
  if (filtersBar) {
    filtersBar.style.opacity = '0';
    filtersBar.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      filtersBar.animate(africanAnimations.fadeInUp, defaultAnimationOptions);
      filtersBar.style.opacity = '1';
      filtersBar.style.transform = 'translateY(0)';
    }, 600);
  }
  
  // Animer les cartes de modèles
  const modelCards = document.querySelectorAll('.model-card');
  modelCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.animate(africanAnimations.fadeInUp, {
        ...defaultAnimationOptions,
        delay: index * 50
      });
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 800 + (index * 50));
  });
  
  // Ajouter un effet de survol amélioré sur les cartes
  modelCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const image = this.querySelector('.model-image');
      if (image) {
        image.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }],
          { duration: 500, fill: 'forwards', easing: 'ease-out' }
        );
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const image = this.querySelector('.model-image');
      if (image) {
        image.animate(
          [{ transform: 'scale(1.08)' }, { transform: 'scale(1)' }],
          { duration: 300, fill: 'forwards', easing: 'ease-out' }
        );
      }
    });
  });
}

/**
 * Initialize modal functionality with enhanced animations
 */
function initializeModals() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-btn');
  const cancelButtons = document.querySelectorAll('[id$="CancelBtn"]');
  
  // Fonction pour ouvrir un modal
  function openModal(modal) {
    if (!modal) return;
    
    // Réinitialiser le modal
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    
    // Forcer un reflow
    modal.offsetHeight;
    
    // Ajouter la classe show avec un délai pour l'animation
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.classList.add('show');
    }, 10);
    
    // Empêcher le défilement du body
    document.body.style.overflow = 'hidden';
  }
  
  // Fonction pour fermer un modal
  function closeModal(modal) {
    if (!modal) return;
    
    modal.style.opacity = '0';
    modal.classList.remove('show');
    
    // Attendre la fin de l'animation avant de cacher le modal
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Gestionnaire pour les boutons de fermeture
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Gestionnaire pour les boutons d'annulation
  cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Fermer le modal en cliquant en dehors
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  // Gestionnaire pour le bouton "Nouveau modèle"
  const newModelBtn = document.getElementById('newModelBtn');
  const newModelModal = document.getElementById('newModelModal');
  if (newModelBtn && newModelModal) {
    newModelBtn.addEventListener('click', () => {
      const form = document.getElementById('newModelForm');
      if (form) {
        form.reset();
        const imagePreview = form.querySelector('#imagePreview');
        if (imagePreview) {
          imagePreview.style.display = 'none';
        }
      }
      openModal(newModelModal);
    });
  }
  
  // Gestionnaire pour le bouton "Voir les détails"
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        fetchModelDetails(modelId, 'view');
      }
    });
  });
  
  // Gestionnaire pour le bouton "Modifier"
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        fetchModelDetails(modelId, 'edit');
      }
    });
  });
  
  // Gestionnaire pour le bouton "Supprimer"
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        showDeleteConfirmation(modelId);
      }
    });
  });
}

/**
 * Rafraîchir la grille de modèles avec une animation
 */
function refreshModelGrid() {
  const modelCards = document.querySelectorAll('.model-card');
  
  // Ajouter un nouveau modèle en haut de la grille (simulation)
  const modelsGrid = document.querySelector('.models-grid');
  if (modelsGrid && modelCards.length > 0) {
    // Cloner une carte existante
    const newCard = modelCards[0].cloneNode(true);
    
    // Modifier les informations pour simuler un nouveau modèle
    newCard.querySelector('.model-name').textContent = 'Nouveau Modèle Ajouté';
    
    // Ajouter un badge "nouveau"
    const badgesContainer = newCard.querySelector('.model-badges');
    if (badgesContainer) {
      badgesContainer.innerHTML = '<span class="model-badge new">Nouveau</span>';
    }
    
    // Préparer l'animation
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(-20px)';
    
    // Insérer au début
    modelsGrid.insertBefore(newCard, modelsGrid.firstChild);
    
    // Animer l'entrée
    setTimeout(() => {
      newCard.animate(africanAnimations.fadeInUp, defaultAnimationOptions);
      newCard.style.opacity = '1';
      newCard.style.transform = 'translateY(0)';
      
      // Mettre à jour le compteur de modèles
      updateModelCount();
    }, 100);
  }
}

/**
 * Mettre à jour le compteur de modèles
 */
function updateModelCount() {
  const totalCountElements = document.querySelectorAll('.total-count');
  totalCountElements.forEach(el => {
    const currentCount = parseInt(el.textContent);
    el.textContent = currentCount + 1;
    
    // Animer le changement
    el.animate(africanAnimations.pulse, {
      duration: 500,
      easing: 'ease-out'
    });
  });
  
  // Mettre à jour le premier stat-card
  const firstStatCard = document.querySelector('.stat-card:first-child .stat-content h3');
  if (firstStatCard) {
    const currentCount = parseInt(firstStatCard.textContent);
    firstStatCard.textContent = currentCount + 1;
    
    // Animer le changement
    firstStatCard.animate(africanAnimations.pulse, {
      duration: 500,
      easing: 'ease-out'
    });
  }
}

/**
 * Initialize filter functionality with enhanced animations
 */
function initializeFilters() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('searchModels');
  const clearSearchBtn = document.getElementById('clearSearch');
  
  // Filter by category with ripple effect
  filterChips.forEach(chip => {
    // Ajouter un effet de ripple au clic
    chip.addEventListener('click', function(e) {
      // Créer l'effet de ripple
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Animer le ripple
      this.style.setProperty('--ripple-x', x + 'px');
      this.style.setProperty('--ripple-y', y + 'px');
      
      // Animer le chip
      this.animate(africanAnimations.pulse, {
        duration: 400,
        easing: 'ease-out'
      });
      
      // Remove active class from all chips with animation
      filterChips.forEach(c => {
        if (c.classList.contains('active')) {
          c.classList.remove('active');
          c.animate(
            [{ transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
            { duration: 300, easing: 'ease-out' }
          );
        }
      });
      
      // Add active class to clicked chip with animation
      this.classList.add('active');
      this.animate(
        [{ transform: 'scale(0.95)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
        { duration: 400, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
      );
      
      const filter = this.getAttribute('data-filter');
      filterModelsByCategory(filter);
    });
  });
  
  // Search functionality with animation
  if (searchInput) {
    // Animer l'icône de recherche lors de la saisie
    const searchIcon = document.querySelector('.search-icon');
    
    searchInput.addEventListener('focus', function() {
      if (searchIcon) {
        searchIcon.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
          { duration: 300, easing: 'ease-out' }
        );
      }
      
      // Ajouter une classe pour styliser le champ de recherche actif
      this.parentElement.classList.add('search-active');
    });
    
    searchInput.addEventListener('blur', function() {
      // Retirer la classe active
      this.parentElement.classList.remove('search-active');
    });
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      // Animer l'icône de recherche
      if (searchIcon && searchTerm.length > 0) {
        searchIcon.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
          { duration: 150, easing: 'ease-out' }
        );
      }
      
      // Afficher ou masquer le bouton de suppression
      const clearBtn = document.getElementById('clearSearch');
      if (clearBtn) {
        if (searchTerm.length > 0) {
          clearBtn.style.opacity = '1';
          clearBtn.style.transform = 'translateX(0)';
        } else {
          clearBtn.style.opacity = '0';
          clearBtn.style.transform = 'translateX(5px)';
        }
      }
      
      filterModelsBySearch(searchTerm);
    });
  }
  
  // Clear search with animation
  if (clearSearchBtn && searchInput) {
    // Style initial
    clearSearchBtn.style.opacity = '0';
    clearSearchBtn.style.transform = 'translateX(5px)';
    
    clearSearchBtn.addEventListener('click', function() {
      // Animer le bouton
      this.animate(africanAnimations.pulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Animer l'effacement du texte
      searchInput.value = '';
      searchInput.focus();
      
      // Masquer le bouton
      this.style.opacity = '0';
      this.style.transform = 'translateX(5px)';
      
      filterModelsBySearch('');
      
      // Reset category filter to "All" avec animation
      setTimeout(() => {
        document.querySelector('.filter-chip[data-filter="all"]').click();
      }, 100);
    });
  }
  
  // Ajouter un style CSS pour l'effet de ripple
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      .filter-chip {
        position: relative;
        overflow: hidden;
      }
      .filter-chip::after {
        content: '';
        position: absolute;
        top: var(--ripple-y, 50%);
        left: var(--ripple-x, 50%);
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.7);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1);
        transform-origin: 50% 50%;
      }
      .filter-chip:active::after {
        opacity: 0.3;
        transform: scale(100);
        transition: transform 0.5s, opacity 0.3s;
      }
      .search-container.search-active input {
        box-shadow: 0 0 0 2px rgba(94, 53, 177, 0.2);
        border-color: var(--primary-color, #5e35b1);
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Filter models by category with animations
 */
function filterModelsByCategory(category) {
  const modelCards = document.querySelectorAll('.model-card');
  const container = document.querySelector('.models-grid');
  
  // Animer le conteneur
  if (container) {
    container.animate(
      [{ opacity: 0.8 }, { opacity: 1 }],
      { duration: 300, easing: 'ease-out' }
    );
  }
  
  // Compter les cartes visibles avant le filtrage
  const visibleBefore = Array.from(modelCards).filter(card => 
    card.style.display !== 'none'
  ).length;
  
  // Appliquer le filtre avec animation
  modelCards.forEach(card => {
    const shouldShow = category === 'all' || card.getAttribute('data-category') === category;
    
    if (shouldShow && (card.style.display === 'none' || !card.style.display)) {
      // Animer l'apparition
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      card.style.display = 'block';
      
      setTimeout(() => {
        card.animate(
          [{ opacity: 0, transform: 'scale(0.9)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 300, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', fill: 'forwards' }
        );
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
    } else if (!shouldShow && card.style.display !== 'none') {
      // Animer la disparition
      card.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.9)' }],
        { duration: 200, easing: 'ease-out', fill: 'forwards' }
      );
      
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
  
  // Mettre à jour le compteur avec animation
  updateFilteredCount(category);
  
  // Animer le titre de la section en fonction de la catégorie
  const gridHeader = document.querySelector('.grid-header h3');
  if (gridHeader) {
    let categoryName = 'Tous les modèles';
    
    switch(category) {
      case 'robes': categoryName = 'Robes'; break;
      case 'costumes': categoryName = 'Costumes'; break;
      case 'hauts': categoryName = 'Hauts'; break;
      case 'jupes': categoryName = 'Jupes'; break;
      case 'accessoires': categoryName = 'Accessoires'; break;
    }
    
    gridHeader.animate(
      [{ opacity: 0.5 }, { opacity: 1 }],
      { duration: 300, easing: 'ease-out' }
    );
    
    setTimeout(() => {
      gridHeader.innerHTML = `<i class="fas fa-th-large"></i> ${categoryName}`;
    }, 150);
  }
}

/**
 * Filter models by search term with animations
 */
function filterModelsBySearch(searchTerm) {
  const modelCards = document.querySelectorAll('.model-card');
  const container = document.querySelector('.models-grid');
  
  // Animer le conteneur
  if (container) {
    container.animate(
      [{ opacity: 0.9 }, { opacity: 1 }],
      { duration: 200, easing: 'ease-out' }
    );
  }
  
  // Appliquer le filtre avec animation
  let matchCount = 0;
  let animationDelay = 0;
  
  modelCards.forEach(card => {
    // Vérifier si la carte est déjà cachée par le filtre de catégorie
    if (card.style.display === 'none' && searchTerm.length === 0) {
      return; // Ne pas afficher les cartes déjà filtrées par catégorie
    }
    
    const modelName = card.querySelector('.model-name').textContent.toLowerCase();
    const modelCategory = card.querySelector('.model-category').textContent.toLowerCase();
    const modelPrice = card.querySelector('.model-price').textContent.toLowerCase();
    
    // Recherche améliorée qui inclut également le prix
    const isMatch = modelName.includes(searchTerm.toLowerCase()) || 
                   modelCategory.includes(searchTerm.toLowerCase()) || 
                   modelPrice.includes(searchTerm.toLowerCase());
    
    if (isMatch) {
      matchCount++;
      
      if (card.style.display === 'none') {
        // Animer l'apparition
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.display = 'block';
        
        setTimeout(() => {
          card.animate(
            [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 300, easing: 'ease-out', fill: 'forwards', delay: animationDelay }
          );
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          animationDelay += 50; // Ajouter un délai pour chaque carte
        }, 10);
      } else if (searchTerm.length > 0) {
        // Mettre en évidence les correspondances
        card.animate(
          africanAnimations.pulse,
          { duration: 400, easing: 'ease-out', delay: animationDelay }
        );
        animationDelay += 50;
      }
    } else {
      // Animer la disparition
      card.animate(
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(20px)' }],
        { duration: 200, easing: 'ease-out', fill: 'forwards' }
      );
      
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
  
  // Mettre à jour le compteur avec animation
  updateFilteredCount();
  
  // Afficher un message si aucun résultat
  const noResultsMsg = document.getElementById('noResultsMessage');
  if (matchCount === 0 && searchTerm.length > 0) {
    if (!noResultsMsg) {
      const msg = document.createElement('div');
      msg.id = 'noResultsMessage';
      msg.className = 'no-results-message';
      msg.innerHTML = `
        <i class="fas fa-search"></i>
        <p>Aucun modèle ne correspond à "${searchTerm}"</p>
        <button class="btn outline-btn reset-search-btn">Réinitialiser la recherche</button>
      `;
      
      // Ajouter le style
      if (!document.querySelector('#no-results-style')) {
        const style = document.createElement('style');
        style.id = 'no-results-style';
        style.textContent = `
          .no-results-message {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted, #757575);
            background: var(--bg-light, #f5f5f5);
            border-radius: 12px;
            margin: 20px auto;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            animation: fadeIn 0.5s ease-out;
          }
          .no-results-message i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: var(--primary-color, #5e35b1);
            opacity: 0.5;
          }
          .no-results-message p {
            font-size: 1.1rem;
            margin-bottom: 20px;
          }
          .reset-search-btn {
            margin-top: 10px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
      
      // Ajouter à la grille
      container.appendChild(msg);
      
      // Ajouter l'événement au bouton de réinitialisation
      msg.querySelector('.reset-search-btn').addEventListener('click', function() {
        document.getElementById('searchModels').value = '';
        filterModelsBySearch('');
        document.querySelector('.filter-chip[data-filter="all"]').click();
      });
    }
  } else if (noResultsMsg) {
    // Supprimer le message s'il existe et qu'il y a des résultats
    noResultsMsg.animate(
      [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(20px)' }],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
    
    setTimeout(() => {
      noResultsMsg.remove();
    }, 300);
  }
}

/**
 * Update the count of filtered items with animation
 */
function updateFilteredCount(category) {
  const visibleCards = document.querySelectorAll('.model-card[style="display: block;"]').length || 
                      document.querySelectorAll('.model-card:not([style="display: none;"])').length;
  
  const totalCount = document.querySelector('.total-count');
  const paginationText = document.querySelector('.pagination-text');
  const paginationInfo = document.querySelector('.pagination-info');
  
  // Animer le compteur
  if (paginationInfo) {
    paginationInfo.animate(
      [{ opacity: 0.5 }, { opacity: 1 }],
      { duration: 300, easing: 'ease-out' }
    );
  }
  
  if (totalCount) {
    // In a real app, this would be the total count from the database
    const totalModels = 32;
    totalCount.textContent = totalModels;
  }
  
  if (paginationText) {
    const start = visibleCards > 0 ? 1 : 0;
    const end = Math.min(visibleCards, 6); // Assuming 6 per page
    
    // Animer le changement de texte
    paginationText.animate(
      [{ opacity: 0.5, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 300, easing: 'ease-out' }
    );
    
    setTimeout(() => {
      paginationText.innerHTML = `Affichage de <strong>${start}-${end}</strong> sur <strong class="total-count">32</strong> modèles`;
    }, 150);
  }
  
  // Mettre à jour les statistiques en fonction de la catégorie
  if (category) {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Animer la carte de statistiques correspondante
    statCards.forEach((card, index) => {
      if ((category === 'all' && index === 0) ||
          (category === 'robes' && index === 0) ||
          (category === 'costumes' && index === 1) ||
          (category === 'hauts' && index === 2) ||
          (category === 'jupes' && index === 3) ||
          (category === 'accessoires' && index === 3)) {
        
        card.animate(africanAnimations.pulse, {
          duration: 400,
          easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
      }
    });
  }
  
  // Mettre à jour la pagination
  updatePagination(visibleCards);
}

/**
 * Mettre à jour la pagination avec des animations améliorées
 * Intégration cohérente avec le style de Couture Hub
 */
function updatePagination(visibleCount) {
  const pageNumbers = document.querySelector('.page-numbers');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const paginationInfo = document.querySelector('.pagination-info');
  
  if (!pageNumbers) return;
  
  // Calculer le nombre de pages
  const itemsPerPage = 6; // Nombre d'éléments par page
  const totalPages = Math.ceil(visibleCount / itemsPerPage);
  const currentPage = 1; // Page par défaut, à modifier si on implémente la navigation entre pages
  
  // Mettre à jour l'info de pagination
  if (paginationInfo) {
    paginationInfo.textContent = `Page ${currentPage} sur ${totalPages || 1} (${visibleCount} modèles)`;
    paginationInfo.animate(africanAnimations.fadeInRight, {
      duration: 400,
      fill: 'forwards'
    });
  }
  
  // Animer les boutons de pagination avec un effet plus soigné
  if (prevBtn) {
    if (totalPages <= 1 || currentPage === 1) {
      prevBtn.disabled = true;
      prevBtn.classList.add('disabled');
      prevBtn.style.opacity = '0.5';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.remove('disabled');
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }
  }
  
  if (nextBtn) {
    if (totalPages <= 1 || currentPage === totalPages) {
      nextBtn.disabled = true;
      nextBtn.classList.add('disabled');
      nextBtn.style.opacity = '0.5';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.disabled = false;
      nextBtn.classList.remove('disabled');
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }
  
  // Mettre à jour les numéros de page avec animation
  if (pageNumbers) {
    pageNumbers.animate(
      africanAnimations.fadeInUp,
      { duration: 400, easing: 'ease-out', fill: 'forwards' }
    );
    
    // Générer les numéros de page
    if (totalPages > 0) {
      let pageNumbersHTML = '';
      
      // Première page toujours visible
      pageNumbersHTML += `<button class="page-number active" aria-current="page">1</button>`;
      
      if (totalPages > 1) {
        // Afficher jusqu'à 3 pages
        for (let i = 2; i <= Math.min(totalPages, 3); i++) {
          pageNumbersHTML += `<button class="page-number">${i}</button>`;
        }
        
        // Afficher les points de suspension si nécessaire
        if (totalPages > 3) {
          pageNumbersHTML += `
            <div class="page-separator-wrapper" aria-hidden="true">
              <span class="page-separator">...</span>
            </div>
          `;
          pageNumbersHTML += `<button class="page-number">${totalPages}</button>`;
        }
      }
      
      // Mettre à jour le HTML avec animation séquentielle
      setTimeout(() => {
        pageNumbers.innerHTML = pageNumbersHTML;
        
        // Ajouter les événements aux boutons de page avec animation
        document.querySelectorAll('.page-number').forEach((btn, index) => {
          // Animation séquentielle pour chaque bouton
          setTimeout(() => {
            btn.animate(africanAnimations.fadeInUp, {
              duration: 300, 
              delay: index * 50,
              fill: 'forwards'
            });
          }, index * 50);
          
          btn.addEventListener('click', function() {
            // Effet de ripple lors du clic
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
            ripple.style.left = `${event.clientX - rect.left - ripple.clientWidth / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - ripple.clientHeight / 2}px`;
            
            // Nettoyer l'effet après l'animation
            setTimeout(() => ripple.remove(), 600);
            
            // Mise à jour des classes actives
            document.querySelectorAll('.page-number').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
            
            // Animer le bouton sélectionné
            this.animate(africanAnimations.pulse, {
              duration: 400,
              easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            
            // Mise à jour de l'information de pagination
            if (paginationInfo) {
              const selectedPage = parseInt(this.textContent);
              paginationInfo.textContent = `Page ${selectedPage} sur ${totalPages} (${visibleCount} modèles)`;
              paginationInfo.animate(africanAnimations.fadeInRight, {
                duration: 300,
                fill: 'forwards'
              });
            }
          });
        });
      }, 150);
    }
  }
}

/**
 * Initialize image preview functionality
 */
function initializeImagePreview() {
  const modelImage = document.getElementById('modelImage');
  const imagePreview = document.getElementById('imagePreview');
  
  if (modelImage && imagePreview) {
    modelImage.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
      }
    });
  }
}

/**
 * Initialize action buttons (view, edit, delete)
 */
function initializeActions() {
  console.log('Initializing model actions...');
  
  // Boutons d'action sur les cartes de modèles
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        fetchModelDetails(modelId, 'edit');
      }
    });
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        fetchModelDetails(modelId, 'view');
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modelId = this.getAttribute('data-id');
      if (modelId) {
        showDeleteConfirmation(modelId);
      }
    });
  });
}

// Fonction pour obtenir le token CSRF
function getCSRFToken() {
  const name = 'csrftoken';
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

// Modifier la fonction fetchModelDetails pour inclure le token CSRF
function fetchModelDetails(modelId, action) {
  const formData = new FormData();
  formData.append('action', 'get_details');
  formData.append('produit_id', modelId);

  fetch(window.location.href, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      if (action === 'edit') {
        populateEditForm(data.produit);
      } else if (action === 'view') {
        showModelDetails(data.produit);
      }
    } else {
      showToast(data.message, 'error');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    showToast('Une erreur est survenue', 'error');
  });
}

// Remplir le formulaire d'édition
function populateEditForm(produit) {
  const form = document.getElementById('editModelForm');
  if (!form) return;

  form.querySelector('#editProduitId').value = produit.id;
  form.querySelector('#editModelName').value = produit.nom;
  form.querySelector('#editModelCategory').value = produit.categorie;
  form.querySelector('#editModelPrice').value = produit.prix;
  form.querySelector('#editModelDescription').value = produit.description || '';
  
  const imagePreview = form.querySelector('#editImagePreview');
  if (produit.photo_url) {
    imagePreview.src = produit.photo_url;
    imagePreview.style.display = 'block';
  } else {
    imagePreview.style.display = 'none';
  }
  
  const modal = document.getElementById('editModelModal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
}

// Afficher les détails d'un modèle
function showModelDetails(produit) {
  const modal = document.getElementById('viewModelModal');
  if (!modal) return;
  
  // Remplir les détails du modèle
  const image = modal.querySelector('#detailModelImage');
  const name = modal.querySelector('.model-name');
  const category = modal.querySelector('.model-category');
  const price = modal.querySelector('.model-price');
  const description = modal.querySelector('.model-description');
  const date = modal.querySelector('.model-date');
  
  if (image) image.src = produit.photo_url || '';
  if (name) name.textContent = produit.nom;
  if (category) category.textContent = produit.categorie;
  if (price) price.textContent = `${produit.prix} €`;
  if (description) description.textContent = produit.description || 'Aucune description disponible';
  
  // Gestion améliorée de la date
  if (date) {
    let dateText = 'Date non disponible';
    if (produit.date_creation) {
      try {
        // Vérifier si la date est déjà un objet Date
        const dateObj = produit.date_creation instanceof Date ? 
          produit.date_creation : 
          new Date(produit.date_creation);
        
        // Vérifier si la date est valide
        if (!isNaN(dateObj.getTime())) {
          dateText = `Ajouté le ${dateObj.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}`;
        }
      } catch (error) {
        console.error('Erreur de format de date:', error);
      }
    }
    date.textContent = dateText;
  }
  
  // Afficher le modal
  modal.style.display = 'flex';
  modal.style.opacity = '0';
  
  // Forcer un reflow
  modal.offsetHeight;
  
  // Ajouter la classe show avec un délai pour l'animation
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.classList.add('show');
  }, 10);
}

// Confirmation de suppression
function showDeleteConfirmation(modelId) {
  const modal = document.getElementById('deleteModelModal');
  if (!modal) return;
  
  // Mettre à jour l'ID du produit à supprimer
  const produitIdInput = modal.querySelector('#deleteProduitId');
  if (produitIdInput) {
    produitIdInput.value = modelId;
  }
  
  // Afficher le modal
  modal.style.display = 'flex';
  modal.style.opacity = '0';
  
  // Forcer un reflow
  modal.offsetHeight;
  
  // Ajouter la classe show avec un délai pour l'animation
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.classList.add('show');
  }, 10);
}

// Modifier le gestionnaire de soumission du formulaire d'édition
document.getElementById('saveEditBtn').addEventListener('click', function() {
  const form = document.getElementById('editModelForm');
  const formData = new FormData(form);
  
  fetch(window.location.href, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(data.message, 'error');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    showToast('Une erreur est survenue', 'error');
  });
});

// Modifier le gestionnaire de confirmation de suppression
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  const form = document.getElementById('deleteModelForm');
  const formData = new FormData(form);
  
  fetch(window.location.href, {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCSRFToken()
    },
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(data.message, 'error');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    showToast('Une erreur est survenue', 'error');
  });
});

/**
 * Validate the model form
 */
function validateModelForm() {
    const modelName = document.getElementById('modelName').value;
    const modelCategory = document.getElementById('modelCategory').value;
    const modelPrice = document.getElementById('modelPrice').value;
    const modelImage = document.getElementById('modelImage');
    
    let errorMessage = '';
    
    if (!modelName.trim()) {
        errorMessage = 'Veuillez saisir un nom pour le modèle';
    } else if (!modelCategory) {
        errorMessage = 'Veuillez sélectionner une catégorie';
    } else if (!modelPrice.trim()) {
        errorMessage = 'Veuillez saisir un prix';
    } else if (modelImage.files.length === 0 && document.getElementById('imagePreview').style.display === 'none') {
        errorMessage = 'Veuillez sélectionner une image';
    }
    
    if (errorMessage) {
        showToast(errorMessage, 'error');
        return false;
    }
    
    return true;
}

/**
 * Affiche un message toast avec animation
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message (success, error, warning, info)
 */
function showToast(message, type = 'info') {
  // Créer le conteneur de toast s'il n'existe pas
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Créer le toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Ajouter l'icône selon le type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }
  
  // Construire le contenu du toast
  toast.innerHTML = `
    ${icon}
    <span class="toast-message">${message}</span>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  // Ajouter le toast au conteneur
  toastContainer.appendChild(toast);
  
  // Animer l'entrée du toast
  toast.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards'
  });
  
  // Ajouter l'événement de fermeture
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    // Animer la sortie du toast
    toast.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' }
    ], {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards'
    }).onfinish = () => {
      toast.remove();
    };
  });
  
  // Auto-supprimer le toast après 5 secondes
  setTimeout(() => {
    if (toast.parentNode) {
      toast.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-20px)' }
      ], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards'
      }).onfinish = () => {
          toast.remove();
      };
    }
  }, 5000);
}

/**
 * Gère les erreurs de manière élégante
 * @param {Error} error - L'erreur à gérer
 * @param {string} context - Le contexte de l'erreur
 */
function handleError(error, context) {
  console.error(`Erreur dans ${context}:`, error);
  
  // Afficher un message d'erreur à l'utilisateur
  showToast(`Une erreur est survenue: ${error.message}`, 'error');
  
  // Enregistrer l'erreur pour analyse ultérieure
  if (typeof errorLog === 'function') {
    errorLog({
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString()
    });
  }
}

// Add CSS for toast notifications if not already in the main CSS
if (!document.querySelector('#toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    
    .toast {
      background: white;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transform: translateX(120%);
      transition: transform 0.3s ease;
      overflow: hidden;
    }
    
    .toast.show {
      transform: translateX(0);
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .toast-icon {
      font-size: 1.2rem;
    }
    
    .toast-message {
      font-size: 0.95rem;
    }
    
    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    
    .toast-close:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .toast-success {
      border-left: 4px solid #4caf50;
    }
    
    .toast-success .toast-icon {
      color: #4caf50;
    }
    
    .toast-error {
      border-left: 4px solid #f44336;
    }
    
    .toast-error .toast-icon {
      color: #f44336;
    }
    
    .toast-warning {
      border-left: 4px solid #ff9800;
    }
    
    .toast-warning .toast-icon {
      color: #ff9800;
    }
    
    .toast-info {
      border-left: 4px solid #2196f3;
    }
    
    .toast-info .toast-icon {
      color: #2196f3;
    }
    
    /* Animation for card removal */
    .fade-out {
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    /* Dark theme adjustments */
    .dark-theme .toast {
      background: #333;
      color: #fff;
    }
    
    .dark-theme .toast-close {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .dark-theme .toast-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(style);
}

// Initialisation des gestionnaires d'événements pour les modales
document.addEventListener('DOMContentLoaded', function() {
  // Gestionnaire pour fermer les modales
  document.querySelectorAll('.modal .close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Fermer les modales en cliquant en dehors
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Boutons d'annulation
  document.getElementById('cancelEditBtn')?.addEventListener('click', function() {
    closeModal(document.getElementById('editModelModal'));
  });
  
  document.getElementById('cancelDeleteBtn')?.addEventListener('click', function() {
    closeModal(document.getElementById('deleteModelModal'));
  });
  
  document.getElementById('closeViewBtn')?.addEventListener('click', function() {
    closeModal(document.getElementById('viewModelModal'));
  });
});
