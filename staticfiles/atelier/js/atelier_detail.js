// Variables globales
let currentFilter = 'all';
let currentPhotoCategory = 'atelier';
let currentPage = 1;
const itemsPerPage = 6;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initCatalogue();
  initPhotos();
  filterPhotos(); // Filtrer les photos au chargement initial
  initRevealAnimations();
  initRdvForm();
  initContactButtons();
  
  // Afficher la section présentation par défaut
  showSection('presentation');
});

// ... keep existing code (navigation, catalogue, photos functions)

// Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      showSection(section);
      
      // Mise à jour des états actifs
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function showSection(sectionName) {
  // Cacher toutes les sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Afficher la section demandée
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

// Catalogue
function initCatalogue() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  // Animation d'entrée pour les filtres
  filterTabs.forEach((tab, index) => {
    // Masquer initialement
    tab.style.opacity = '0';
    tab.style.transform = 'translateY(20px)';
    tab.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    // Afficher avec délai progressif
    setTimeout(() => {
      tab.style.opacity = '1';
      tab.style.transform = 'translateY(0)';
    }, 100 + (index * 80));
    
    // Ajouter l'écouteur d'événement
    tab.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      currentFilter = filter;
      currentPage = 1;
      
      // Mise à jour des états actifs avec animation
      filterTabs.forEach(t => {
        t.classList.remove('active');
        // Petit effet de rebond pour les autres onglets
        if (t !== this) {
          t.style.transform = 'translateY(0) scale(0.95)';
          setTimeout(() => {
            t.style.transform = 'translateY(0) scale(1)';
          }, 300);
        }
      });
      
      // Animation pour l'onglet actif
      this.classList.add('active');
      this.style.transform = 'translateY(-5px) scale(1.05)';
      setTimeout(() => {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      }, 300);
      
      filterCatalogueItems();
    });
  });
  
  // Initialiser le bouton de changement de vue
  initViewToggle();
  
  // Animation d'entrée pour les éléments du catalogue
  const catalogueItems = document.querySelectorAll('.catalogue-item');
  catalogueItems.forEach((item, index) => {
    // Masquer initialement
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    // Afficher avec délai progressif
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 300 + (index * 100)); // Délai plus long pour créer un effet cascade
  });
  
  // Animation d'entrée pour les statistiques
  const statsElement = document.querySelector('.catalogue-stats');
  if (statsElement) {
    statsElement.style.opacity = '0';
    statsElement.style.transform = 'translateY(20px)';
    statsElement.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    setTimeout(() => {
      statsElement.style.opacity = '1';
      statsElement.style.transform = 'translateY(0)';
    }, 200);
  }
  
  // Initialiser les compteurs et statistiques
  updateCatalogueStats();
}

// Fonction pour initialiser le bouton de changement de vue
function initViewToggle() {
  const viewToggleBtn = document.querySelector('.stats-view-toggle');
  const catalogueGrid = document.querySelector('.catalogue-grid');
  
  if (viewToggleBtn && catalogueGrid) {
    // Définir la vue par défaut
    let currentView = 'grid'; // Peut être 'grid' ou 'list'
    
    viewToggleBtn.addEventListener('click', function() {
      // Ajouter une animation au bouton
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
      
      // Basculer entre les vues
      if (currentView === 'grid') {
        // Passer à la vue liste
        catalogueGrid.classList.add('list-view');
        catalogueGrid.classList.remove('grid-view');
        currentView = 'list';
        
        // Changer l'icône du bouton
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      } else {
        // Revenir à la vue grille
        catalogueGrid.classList.add('grid-view');
        catalogueGrid.classList.remove('list-view');
        currentView = 'grid';
        
        // Changer l'icône du bouton
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        `;
      }
      
      // Animer les éléments du catalogue lors du changement de vue
      const items = document.querySelectorAll('.catalogue-item');
      items.forEach((item, index) => {
        // Masquer brièvement
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        
        // Réafficher avec délai
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50 + (index * 30));
      });
    });
    
    // Initialiser avec la vue grille par défaut
    catalogueGrid.classList.add('grid-view');
  }
}

function filterCatalogueItems() {
  const items = document.querySelectorAll('.catalogue-item');
  let visibleCount = 0;
  let delay = 0;
  
  // D'abord, masquer tous les éléments avec une animation
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px) scale(0.95)';
    item.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
  });
  
  // Attendre un court instant avant d'afficher les éléments filtrés
  setTimeout(() => {
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (currentFilter === 'all' || category === currentFilter) {
        // Afficher avec animation et délai progressif
        setTimeout(() => {
          item.style.display = '';
          // Forcer un reflow pour que la transition fonctionne
          void item.offsetWidth;
          item.style.opacity = '1';
          item.style.transform = 'translateY(0) scale(1)';
        }, delay);
        
        delay += 50; // Ajouter un délai pour chaque élément
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    // Mettre à jour les stats avec animation
    updateCatalogueStats(visibleCount);
    
    // Animer le compteur de résultats
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
      resultsCount.classList.add('highlight');
      setTimeout(() => {
        resultsCount.classList.remove('highlight');
      }, 1000);
    }
  }, 300);
}

function updateCatalogueStats(visibleCount) {
  const statsInfo = document.querySelector('.stats-info');
  if (statsInfo) {
    const resultsCount = statsInfo.querySelector('.results-count');
    if (resultsCount) {
      // Si visibleCount est défini, l'utiliser, sinon compter tous les éléments visibles
      if (visibleCount === undefined) {
        visibleCount = document.querySelectorAll('.catalogue-item').length;
      }
      
      // Animation du compteur
      const currentCount = parseInt(resultsCount.textContent) || 0;
      const diff = visibleCount - currentCount;
      
      // Si le nombre change, animer le changement
      if (diff !== 0) {
        // Ajouter une classe pour l'animation
        resultsCount.classList.add('updating');
        
        // Animation de comptage
        let startTime;
        const duration = 800; // ms
        
        function updateCounter(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Fonction d'easing pour un effet plus naturel
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          // Calculer la valeur actuelle
          const currentValue = Math.round(currentCount + (diff * easeOutQuart));
          resultsCount.textContent = currentValue;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            // Animation terminée
            resultsCount.textContent = visibleCount;
            resultsCount.classList.remove('updating');
            
            // Ajouter un effet de pulsation à la fin
            resultsCount.classList.add('highlight');
            setTimeout(() => {
              resultsCount.classList.remove('highlight');
            }, 600);
          }
        }
        
        requestAnimationFrame(updateCounter);
      } else {
        // Pas de changement, juste mettre à jour le texte
        resultsCount.textContent = visibleCount;
      }
      
      // Mettre à jour le texte d'accompagnement en fonction du nombre
      const statsText = statsInfo.querySelector('.stats-text');
      if (statsText) {
        let message = '';
        if (visibleCount === 0) {
          message = 'Aucun élément trouvé';
        } else if (visibleCount === 1) {
          message = '1 élément trouvé';
        } else {
          message = `${visibleCount} éléments trouvés`;
        }
        
        // Animation du texte
        statsText.style.opacity = '0';
        statsText.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          statsText.textContent = message;
          statsText.style.opacity = '1';
          statsText.style.transform = 'translateY(0)';
        }, 200);
      }
    }
  }
}

// La pagination n'est plus nécessaire car tous les éléments sont déjà dans le HTML

// Photos
function initPhotos() {
  const categories = document.querySelectorAll('.photo-category');
  categories.forEach(category => {
    category.addEventListener('click', function() {
      const categoryName = this.getAttribute('data-category');
      currentPhotoCategory = categoryName;
      
      // Mise à jour des états actifs
      categories.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      filterPhotos();
    });
  });
}

function filterPhotos() {
  const photos = document.querySelectorAll('.photo-item');
  
  photos.forEach(photo => {
    const category = photo.getAttribute('data-category');
    
    if (category === currentPhotoCategory) {
      photo.style.display = '';
    } else {
      photo.style.display = 'none';
    }
  });
}

// Formulaire RDV - Version corrigée
function initRdvForm() {
  const form = document.getElementById('rdvForm');
  if (!form) return;
  
  // Validation en temps réel
  setupRealTimeValidation();
  
  // Gestion de la soumission
  form.addEventListener('submit', function(e) {
    console.log('Form submission in JS');
    // Ne pas empêcher la soumission par défaut
    return true;
  });
  
  // Définir la date minimum à aujourd'hui
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.min = formattedDate;
  }
  
  // Gestion des créneaux disponibles
  setupAvailableSlots();
}

function setupRealTimeValidation() {
  const form = document.getElementById('rdvForm');
  if (!form) return;
  
  // Validation du service
  const serviceSelect = form.querySelector('#service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
      validateField(this, 'service', 'Veuillez sélectionner un service');
    });
  }
  
  // Validation de la date
  const dateInput = form.querySelector('#date');
  if (dateInput) {
    dateInput.addEventListener('change', function() {
      validateDate(this);
    });
  }
  
  // Validation de l'heure
  const heureInput = form.querySelector('#heure');
  if (heureInput) {
    heureInput.addEventListener('change', function() {
      validateField(this, 'heure', 'Veuillez sélectionner une heure');
    });
  }
}

function validateField(input, fieldName, errorMessage) {
  if (!input) return true;
  
  const value = input.value.trim();
  let isValid = true;
  
  switch (fieldName) {
    case 'service':
      isValid = value !== '';
      break;
    case 'heure':
      isValid = value !== '';
      break;
    default:
      isValid = true;
  }
  
  if (!isValid) {
    showFieldError(input, errorMessage);
  } else {
    clearFieldError(input);
  }
  
  return isValid;
}

function validateDate(input) {
  if (!input) return true;
  
  const selectedDate = new Date(input.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showFieldError(input, 'La date ne peut pas être dans le passé');
    return false;
  }
  
  clearFieldError(input);
  return true;
}

function showFieldError(input, message) {
  if (!input) return;
  
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  input.classList.add('error');
}

function clearFieldError(input) {
  if (!input) return;
  
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
  input.classList.remove('error');
}

function setupAvailableSlots() {
  const dateInput = document.getElementById('date');
  const heureSelect = document.getElementById('heure');
  
  if (dateInput && heureSelect) {
    dateInput.addEventListener('change', function() {
      const selectedDate = new Date(this.value);
      updateAvailableSlots(selectedDate);
    });
  }
}

function updateAvailableSlots(selectedDate) {
  const heureSelect = document.getElementById('heure');
  if (!heureSelect) return;
  
  const dayOfWeek = selectedDate.getDay();
  const allSlots = [
    { value: '09:00', text: '9h00' },
    { value: '10:00', text: '10h00' },
    { value: '11:00', text: '11h00' },
    { value: '14:00', text: '14h00' },
    { value: '15:00', text: '15h00' },
    { value: '16:00', text: '16h00' },
    { value: '17:00', text: '17h00' }
  ];
  
  let availableSlots = [...allSlots];
  
  // Samedi : créneaux réduits
  if (dayOfWeek === 6) {
    availableSlots = allSlots.filter(slot => 
      ['10:00', '11:00', '14:00', '15:00', '16:00'].includes(slot.value)
    );
  }
  
  // Dimanche : fermé
  if (dayOfWeek === 0) {
    availableSlots = [];
  }
  
  // Mise à jour des options
  heureSelect.innerHTML = '<option value="">Choisir un créneau</option>';
  
  if (availableSlots.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Fermé ce jour';
    option.disabled = true;
    heureSelect.appendChild(option);
  } else {
    availableSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot.value;
      option.textContent = slot.text;
      heureSelect.appendChild(option);
    });
  }
}

function handleRdvSubmit() {
  const form = document.getElementById('rdvForm');
  if (!form) return;
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Réinitialiser les erreurs précédentes
  clearFormErrors();
  
  // Validation complète
  const validations = [
    validateField(form.querySelector('#nom'), 'nom', 'Le nom et prénom sont obligatoires'),
    validateEmail(form.querySelector('#email')),
    validateField(form.querySelector('#service'), 'service', 'Veuillez sélectionner un service'),
    validateDate(form.querySelector('#date')),
    validateField(form.querySelector('#heure'), 'heure', 'Veuillez choisir un créneau horaire')
  ];
  
  const isFormValid = validations.every(validation => validation === true);
  
  if (!isFormValid) {
    showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
    
    // Faire défiler vers la première erreur
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
    return;
  }
  
  // Afficher un indicateur de chargement
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.classList.add('loading');
  
  // Simulation d'envoi
  setTimeout(() => {
    // Changer l'état du bouton en succès
    submitButton.classList.remove('loading');
    submitButton.classList.add('success');
    submitButton.textContent = 'Rendez-vous confirmé';
    
    showNotification('Demande de rendez-vous envoyée avec succès ! Nous vous confirmerons par email dans les plus brefs délais.', 'success');
    form.reset();
    clearFormErrors();
    
    // Optionnel : rediriger vers une page de confirmation après un délai
    setTimeout(() => {
      // Restaurer le bouton à son état initial
      submitButton.disabled = false;
      submitButton.classList.remove('success');
      submitButton.textContent = originalText;
      
      showSection('presentation');
      updateNavigation('presentation');
    }, 3000);
    
  }, 1500);
}

function clearFormErrors() {
  const form = document.getElementById('rdvForm');
  if (!form) return;
  
  // Retirer toutes les classes d'erreur et de succès
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('error', 'success');
  });
  
  // Retirer tous les messages d'erreur
  const errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(error => error.remove());
}

function updateNavigation(sectionName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(nav => nav.classList.remove('active'));
  
  const targetNav = document.querySelector(`[data-section="${sectionName}"]`);
  if (targetNav) {
    targetNav.classList.add('active');
  }
}

// Boutons de contact
function initContactButtons() {
  const rdvButtons = document.querySelectorAll('.rdv-button, .cta-button');
  rdvButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('rendez-vous');
      updateNavigation('rendez-vous');
      
      // Faire défiler vers le formulaire
      setTimeout(() => {
        const form = document.getElementById('rdvForm');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  });
}

// Fonctions utilitaires
function orderItem(itemId) {
  showNotification('Redirection vers la prise de rendez-vous pour votre commande...', 'info');
  setTimeout(() => {
    showSection('rendez-vous');
    updateNavigation('rendez-vous');
    
    // Pré-remplir le service
    setTimeout(() => {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        serviceSelect.value = 'sur-mesure';
      }
      
      const form = document.getElementById('rdvForm');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }, 1000);
}

function viewDetails(itemId) {
  // Comme nous n'avons plus de tableau catalogueItems, nous utilisons les éléments HTML directement
  const itemElement = document.querySelector(`.catalogue-item[data-id="${itemId}"]`);
  if (itemElement) {
    showNotification(`${itemElement.querySelector('.item-name').textContent} - ${itemElement.querySelector('.item-description').textContent} | ${itemElement.querySelector('.item-price').textContent}`, 'info');
  }
}

function openPhotoModal(photoId) {
  showNotification('Galerie photo - Fonctionnalité à développer', 'info');
}

function showNotification(message, type = 'info') {
  // Supprimer les notifications existantes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Créer la nouvelle notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Ajouter au DOM
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Suppression automatique
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, type === 'success' ? 8000 : 5000);
}

// Fonction pour gérer les animations de révélation au défilement
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.catalogue-item, .photo-item, .service-card, .info-item');
  
  // Ajouter la classe reveal à tous les éléments concernés
  revealElements.forEach(el => {
    el.classList.add('reveal');
  });
  
  // Fonction pour vérifier si un élément est visible dans la fenêtre
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(el => {
      const revealTop = el.getBoundingClientRect().top;
      
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });
  }
  
  // Vérifier au chargement initial
  checkReveal();
  
  // Vérifier au défilement
  window.addEventListener('scroll', checkReveal);
  
  // Initialiser l'effet de parallaxe
  initParallaxEffect();
}

// Fonction pour gérer l'effet de parallaxe au mouvement de la souris
function initParallaxEffect() {
  const presentationSection = document.getElementById('presentation');
  const parallaxBg = document.querySelector('.parallax-bg');
  const presentationImage = document.querySelector('.presentation-image');
  
  if (!presentationSection || !parallaxBg || !presentationImage) return;
  
  // Gérer le mouvement de la souris pour l'effet de parallaxe
  presentationSection.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = presentationSection.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Appliquer la transformation aux points de parallaxe
    const dots = document.querySelectorAll('.parallax-dot');
    dots.forEach((dot, index) => {
      const factor = (index + 1) * 10;
      dot.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
    
    // Effet 3D sur l'image
    if (presentationImage) {
      presentationImage.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    }
  });
  
  // Réinitialiser la position lorsque la souris quitte la section
  presentationSection.addEventListener('mouseleave', () => {
    const dots = document.querySelectorAll('.parallax-dot');
    dots.forEach(dot => {
      dot.style.transform = 'translate(0, 0)';
    });
    
    if (presentationImage) {
      presentationImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
    }
  });
}
