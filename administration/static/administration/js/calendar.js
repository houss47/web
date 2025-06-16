/**
 * Calendar Management JavaScript
 * Handles functionality for the appointments/calendar management page
 * Couture Hub - Plateforme de gestion d'ateliers de couture africaine
 */

// Définition des animations africaines inspirées par les motifs et mouvements traditionnels
const africanAnimations = {
  // Animations de base
  fadeInUp: [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
  fadeInLeft: [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'translateX(0)' }],
  fadeInRight: [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }],
  
  // Animations inspirées des danses africaines
  pulse: [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
  shake: [{ transform: 'translateX(0) rotate(0deg)' }, { transform: 'translateX(-5px) rotate(-1deg)' }, { transform: 'translateX(5px) rotate(1deg)' }, { transform: 'translateX(0) rotate(0deg)' }],
  bounce: [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }],
  
  // Animations inspirées des motifs kente
  kenteWave: [{ transform: 'skewX(0)' }, { transform: 'skewX(3deg)' }, { transform: 'skewX(-3deg)' }, { transform: 'skewX(0)' }],
  
  // Animation pour les boutons
  buttonPulse: [{ boxShadow: '0 4px 8px rgba(94, 53, 177, 0.3)' }, { boxShadow: '0 6px 12px rgba(94, 53, 177, 0.5)' }, { boxShadow: '0 4px 8px rgba(94, 53, 177, 0.3)' }],
  
  // Animation pour les ajouts d'éléments
  growIn: [{ opacity: 0, transform: 'scale(0.8)' }, { opacity: 1, transform: 'scale(1.05)' }, { opacity: 1, transform: 'scale(1)' }],
  
  // Animation pour les notifications
  notify: [{ transform: 'scale(1)' }, { transform: 'scale(1.2) rotate(5deg)' }, { transform: 'scale(1) rotate(0deg)' }],
  
  // Animation pour les transitions entre vues
  adinkraTransition: [{ opacity: 0, transform: 'scale(0.9) rotate(-3deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }]
};

// Options d'animation par défaut - inspirées des mouvements rythmiques africains
const defaultAnimationOptions = {
  duration: 600,
  easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bounce éasing pour un effet plus dynamique
  fill: 'forwards',
  iterations: 1
};

// Options pour les animations plus subtiles
const subtleAnimationOptions = {
  duration: 400,
  easing: 'ease-in-out',
  fill: 'forwards'
};

// Options pour les animations festives (notifications, succès)
const festiveAnimationOptions = {
  duration: 800,
  easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fill: 'forwards',
  iterations: 1
};

document.addEventListener('DOMContentLoaded', function() {
  // Animer l'entrée des éléments de la page
  animatePageElements();
  
  // Initialiser le calendrier
  initializeCalendar();
  
  // Initialiser les filtres
  initializeFilters();
  
  // Initialiser les actions
  initializeActions();
  
  // Theme toggle functionality with animation
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const icon = this.querySelector('i');
      
      // Animer l'icône
      icon.animate(africanAnimations.pulse, {
        duration: 600,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });
      
      if (icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
      }
      
      // Animer la transition du thème
      document.querySelectorAll('.appointment-card, .stat-card, .filter-chip').forEach(el => {
        el.animate(africanAnimations.pulse, {
          duration: 400,
          easing: 'ease-in-out'
        });
      });
      
      // Save preference to localStorage
      const isDarkTheme = document.body.classList.contains('dark-theme');
      localStorage.setItem('darkTheme', isDarkTheme);
      
      // Afficher un toast pour confirmer le changement
      showToast(isDarkTheme ? 'Mode sombre activé' : 'Mode clair activé', 'info');
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      document.body.classList.add('dark-theme');
      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
  }
});

/**
 * Initialise le calendrier en utilisant les templates HTML
 */
function initializeCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const dayTemplate = document.getElementById('calendarDayTemplate');
  const appointmentTemplate = document.getElementById('appointmentTemplate');
  
  // Animation d'entrée pour le conteneur du calendrier
  calendarGrid.style.opacity = '0';
  calendarGrid.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    calendarGrid.style.transition = 'all 0.5s ease';
    calendarGrid.style.opacity = '1';
    calendarGrid.style.transform = 'translateY(0)';
  }, 100);

  // Générer le calendrier avec animation
  const today = new Date();
  generateCalendarDays(calendarGrid, dayTemplate, appointmentTemplate, today.getFullYear(), today.getMonth());
  
  // Ajouter des animations aux jours
  const days = calendarGrid.querySelectorAll('.calendar-day');
  days.forEach((day, index) => {
    day.style.opacity = '0';
    day.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      day.style.transition = 'all 0.3s ease';
      day.style.opacity = '1';
      day.style.transform = 'scale(1)';
    }, 100 + (index * 30));
  });
}

/**
 * Génère les jours du calendrier pour un mois donné
 */
function generateCalendarDays(calendarGrid, dayTemplate, appointmentTemplate, year, month) {
  // Vider la grille existante
  calendarGrid.innerHTML = '';
  
  // Obtenir le premier jour du mois et le nombre de jours
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Obtenir le jour de la semaine du premier jour (0 = Dimanche, 1 = Lundi, etc.)
  let firstDayOfWeek = firstDay.getDay();
  // Ajuster pour commencer par Lundi (0 = Lundi, 6 = Dimanche)
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  // Obtenir le dernier jour du mois précédent
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Générer les jours du mois précédent (pour remplir la première ligne)
  for (let i = 0; i < firstDayOfWeek; i++) {
    const dayNumber = prevMonthLastDay - firstDayOfWeek + i + 1;
    const dayElement = createDayElement(dayTemplate, dayNumber, 'other-month');
    
    // Définir les attributs data pour le jour
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    dayElement.dataset.date = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;
    dayElement.dataset.day = dayNumber;
    dayElement.dataset.month = prevMonth;
    dayElement.dataset.year = prevYear;
    
    calendarGrid.appendChild(dayElement);
    animateDayElement(dayElement, i);
  }
  
  // Générer les jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = createDayElement(dayTemplate, i, '');
    
    // Vérifier si c'est aujourd'hui
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
      dayElement.classList.add('today');
    }
    
    // Définir les attributs data pour le jour
    dayElement.dataset.date = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    dayElement.dataset.day = i;
    dayElement.dataset.month = month;
    dayElement.dataset.year = year;
    
    // Ajouter des rendez-vous exemple (à remplacer par des données réelles)
    if (i === 15 || i === 22 || i === 8) {
      addSampleAppointments(dayElement, appointmentTemplate, i);
    }
    
    calendarGrid.appendChild(dayElement);
    animateDayElement(dayElement, firstDayOfWeek + i - 1);
  }
  
  // Calculer combien de jours du mois suivant sont nécessaires pour compléter la grille
  const totalDaysDisplayed = firstDayOfWeek + daysInMonth;
  const remainingCells = 42 - totalDaysDisplayed; // 6 semaines x 7 jours = 42 cellules au total
  
  // Générer les jours du mois suivant
  for (let i = 1; i <= remainingCells; i++) {
    const dayElement = createDayElement(dayTemplate, i, 'other-month');
    
    // Définir les attributs data pour le jour
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    dayElement.dataset.date = `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    dayElement.dataset.day = i;
    dayElement.dataset.month = nextMonth;
    dayElement.dataset.year = nextYear;
    
    calendarGrid.appendChild(dayElement);
    animateDayElement(dayElement, totalDaysDisplayed + i - 1);
  }
  
  // Ajouter des animations aux rendez-vous
  const appointments = calendarGrid.querySelectorAll('.appointment');
  appointments.forEach((appointment, index) => {
    appointment.style.opacity = '0';
    appointment.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      appointment.style.transition = 'all 0.3s ease';
      appointment.style.opacity = '1';
      appointment.style.transform = 'translateX(0)';
    }, 200 + (index * 50));
  });
}

/**
 * Crée un élément jour à partir du template
 */
function createDayElement(template, dayNumber, additionalClass) {
  const dayElement = template.content.cloneNode(true).querySelector('.calendar-day');
  if (additionalClass) {
    dayElement.classList.add(additionalClass);
  }
  
  const dayHeader = dayElement.querySelector('.day-header');
  if (dayHeader) {
    dayHeader.textContent = dayNumber;
  }
  
  return dayElement;
}

/**
 * Ajoute des rendez-vous exemple à un jour
 */
function addSampleAppointments(dayElement, template, day) {
  const dayContent = dayElement.querySelector('.day-content');
  if (!dayContent) return;
  
  // Exemples de rendez-vous (à remplacer par des données réelles)
  const appointments = [
    { time: '09:00', client: 'Marie Dupont', type: 'Création sur-mesure', status: 'confirmed' },
    { time: '11:30', client: 'Jean Martin', type: 'Consultation', status: 'pending' }
  ];
  
  // Ajouter uniquement si c'est un jour spécifique (pour l'exemple)
  if (day === 15) {
    appointments.push({ time: '14:00', client: 'Sophie Leclerc', type: 'Retouches', status: 'confirmed' });
  } else if (day === 22) {
    appointments.push({ time: '16:30', client: 'Pierre Dubois', type: 'Prise de mesures', status: 'canceled' });
  }
  
  // Créer les éléments de rendez-vous
  appointments.forEach((apt, index) => {
    const appointmentElement = template.content.cloneNode(true).querySelector('.appointment');
    appointmentElement.classList.add(apt.status);
    
    const timeElement = appointmentElement.querySelector('.time');
    const clientElement = appointmentElement.querySelector('.client');
    const typeElement = appointmentElement.querySelector('.type');
    
    if (timeElement) timeElement.textContent = apt.time;
    if (clientElement) clientElement.textContent = apt.client;
    if (typeElement) typeElement.textContent = apt.type;
    
    dayContent.appendChild(appointmentElement);
    
    // Animation avec délai
    setTimeout(() => {
      appointmentElement.animate(africanAnimations.growIn, {
        duration: 400,
        fill: 'forwards'
      });
    }, 1200 + (index * 100));
  });
}

/**
 * Anime un élément jour avec un effet de tissage
 */
function animateDayElement(dayElement, index) {
  const row = Math.floor(index / 7);
  const col = index % 7;
  const delay = (row * 60) + (col * 40); // Effet de tissage
  
  dayElement.style.opacity = '0';
  setTimeout(() => {
    dayElement.animate([
      { opacity: 0, transform: 'scale(0.9) rotate(-1deg)' },
      { opacity: 1, transform: 'scale(1.02) rotate(0.5deg)' },
      { opacity: 1, transform: 'scale(1) rotate(0deg)' }
    ], {
      duration: 500,
      delay: delay,
      fill: 'forwards',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
    dayElement.style.opacity = '1';
  }, 1000 + delay);
}

/**
 * Navigue dans le calendrier (mois précédent, suivant ou aujourd'hui)
 */
function navigateCalendar(direction) {
  // Cette fonction serait implémentée pour permettre la navigation entre les mois
  console.log(`Navigation calendrier: ${direction}`);
  // À implémenter avec les données réelles
}

/**
 * Initialise les filtres du calendrier
 */
function initializeFilters() {
  const searchInput = document.getElementById('searchAppointment');
  const filterChips = document.querySelectorAll('.filter-chip');
  let searchTimeout;

  // Gestion de la recherche avec délai
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const search = this.value.trim();
        if (search.length >= 2 || search.length === 0) {  // Recherche seulement si 2 caractères ou plus, ou vide
          const currentUrl = new URL(window.location.href);
          if (search) {
            currentUrl.searchParams.set('search', search);
          } else {
            currentUrl.searchParams.delete('search');
          }
          window.location.href = currentUrl.toString();
        }
      }, 800);  // Augmentation du délai à 800ms
    });
  }

  // Gestion des filtres de statut
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const filter = this.dataset.filter;
      const currentUrl = new URL(window.location.href);
      if (filter === 'all') {
        currentUrl.searchParams.delete('status');
      } else {
        currentUrl.searchParams.set('status', filter);
      }
      window.location.href = currentUrl.toString();
    });
  });
}

/**
 * Initialise les actions du calendrier
 */
function initializeActions() {
  // Nouveau rendez-vous
  const newAppointmentBtn = document.getElementById('newAppointmentBtn');
  if (newAppointmentBtn) {
    newAppointmentBtn.addEventListener('click', () => {
      // Animation du bouton
      newAppointmentBtn.animate(africanAnimations.buttonPulse, festiveAnimationOptions);
      
      // Ici, on ouvrirait normalement un modal pour créer un nouveau rendez-vous
      console.log('Nouveau rendez-vous');
    });
  }
  
  // Exporter le calendrier
  const exportCalendarBtn = document.getElementById('exportCalendarBtn');
  if (exportCalendarBtn) {
    exportCalendarBtn.addEventListener('click', () => {
      // Animation du bouton
      exportCalendarBtn.animate(africanAnimations.buttonPulse, festiveAnimationOptions);
      
      // Logique d'exportation (à implémenter)
      console.log('Exporter le calendrier');
    });
  }
  
  // Changement de vue
  const viewButtons = document.querySelectorAll('.view-switcher .btn');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Retirer la classe active de tous les boutons
      viewButtons.forEach(b => b.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      btn.classList.add('active');
      
      // Animation du bouton
      btn.animate(africanAnimations.pulse, subtleAnimationOptions);
      
      // Changer la vue (à implémenter)
      const viewId = btn.id;
      console.log(`Vue changée: ${viewId}`);
    });
  });
  
  // Recherche de rendez-vous
  const searchInput = document.getElementById('searchAppointment');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Logique de recherche (à implémenter)
      console.log(`Recherche: ${searchInput.value}`);
    });
  }

  // Gestion des boutons de suppression
  const deleteButtons = document.querySelectorAll('.delete-appointment-btn');
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  let currentRdvId = null;

  deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
          const rdvId = this.getAttribute('data-id');
          const row = this.closest('tr');
          
          // Récupérer les informations du rendez-vous
          const clientName = row.querySelector('.appointment-client').textContent;
          const serviceName = row.querySelector('.appointment-type').textContent;
          const date = row.querySelector('.appointment-date').textContent;
          const time = row.querySelector('.appointment-time').textContent;

          // Remplir le modal avec les informations
          document.getElementById('deleteClientName').textContent = clientName;
          document.getElementById('deleteServiceName').textContent = serviceName;
          document.getElementById('deleteDate').textContent = date;
          document.getElementById('deleteTime').textContent = time;

          // Stocker l'ID du rendez-vous
          currentRdvId = rdvId;

          // Afficher le modal
          deleteModal.style.display = 'flex';
      });
  });

  // Gestion de la confirmation de suppression
  confirmDeleteBtn.addEventListener('click', function() {
      if (!currentRdvId) return;

      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('rdv_id', currentRdvId);
      formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

      fetch(window.location.href, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Supprimer la ligne du tableau
              const row = document.querySelector(`[data-id="${currentRdvId}"]`);
              if (row) {
                  row.remove();
              }
              // Fermer le modal
              deleteModal.style.display = 'none';
              // Afficher le message de succès
              showToast(data.message, 'success');
              // Mettre à jour les statistiques si nécessaire
              updateStats();
          } else {
              showToast(data.message, 'error');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          showToast('Une erreur est survenue lors de la suppression', 'error');
      });
  });

  // Gestion de l'annulation de la suppression
  cancelDeleteBtn.addEventListener('click', function() {
      deleteModal.style.display = 'none';
      currentRdvId = null;
  });

  // Gestion de la fermeture du modal
  const closeButtons = deleteModal.querySelectorAll('.close-btn');
  closeButtons.forEach(button => {
      button.addEventListener('click', function() {
          deleteModal.style.display = 'none';
          currentRdvId = null;
      });
  });

  // Fermer le modal si on clique en dehors
  window.addEventListener('click', function(event) {
      if (event.target === deleteModal) {
          deleteModal.style.display = 'none';
          currentRdvId = null;
      }
  });
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const stats = document.querySelectorAll('.stat-card .stat-content p:first-child');
    if (stats.length >= 4) {
        // Mettre à jour le nombre total de rendez-vous
        const totalAppointments = document.querySelectorAll('.appointment-row').length;
        stats[0].textContent = totalAppointments;

        // Mettre à jour les autres statistiques
        const enAttente = document.querySelectorAll('.status-badge.en_attente').length;
        const confirme = document.querySelectorAll('.status-badge.confirme').length;
        const aujourdhui = document.querySelectorAll('.appointment-row').length; // À ajuster selon la logique métier

        stats[1].textContent = enAttente;
        stats[2].textContent = aujourdhui;
        stats[3].textContent = confirme;
    }
}

/**
 * Animer les éléments de la page au chargement avec des animations inspirées
 * des motifs et mouvements traditionnels africains
 */
function animatePageElements() {
  const elements = document.querySelectorAll('.stat-card, .filter-chip, .appointment-row');
  
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

/**
 * Initialiser le calendrier avec fonctionnalités interactives
 */
function initializeCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  const prevDateBtn = document.getElementById('prevDateBtn');
  const nextDateBtn = document.getElementById('nextDateBtn');
  const todayBtn = document.getElementById('todayBtn');
  
  // Obtenir la date actuelle
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let currentView = 'month'; // 'month', 'week', ou 'day'
  
  // Configuration des vues du calendrier
  const viewButtons = document.querySelectorAll('.view-switcher .btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Récupérer le type de vue à partir de l'ID du bouton
      const viewType = this.id.replace('ViewBtn', '').toLowerCase();
      switchCalendarView(viewType);
    });
  });
  
  // Mettre à jour l'affichage de la date
  updateDateDisplay();
  
  // Générer le calendrier pour le mois en cours
  generateCalendar(currentMonth, currentYear);
  
  // Gestionnaires d'événements pour la navigation
  if (prevDateBtn) {
    prevDateBtn.addEventListener('click', function() {
      const prevButton = this;
      
      // Animation du bouton
      prevButton.animate(africanAnimations.pulse, subtleAnimationOptions);
      
      // Préparer l'animation de transition
      if (calendarGrid) {
        calendarGrid.animate(
          [{ opacity: 1 }, { opacity: 0.5, transform: 'translateX(20px)' }, { opacity: 0 }],
          { duration: 200, fill: 'forwards', easing: 'ease-out' }
        );
      }
      
      setTimeout(() => {
        // Changer le mois
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        
        updateDateDisplay();
        generateCalendar(currentMonth, currentYear);
        
        // Animer l'entrée du nouveau mois
        if (calendarGrid) {
          calendarGrid.animate(
            [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 0.5, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'translateX(0)' }],
            { duration: 300, fill: 'forwards', easing: 'ease-out' }
          );
        }
      }, 250);
    });
  }
  
  if (nextDateBtn) {
    nextDateBtn.addEventListener('click', function() {
      const nextButton = this;
      
      // Animation du bouton
      nextButton.animate(africanAnimations.pulse, subtleAnimationOptions);
      
      // Préparer l'animation de transition
      if (calendarGrid) {
        calendarGrid.animate(
          [{ opacity: 1 }, { opacity: 0.5, transform: 'translateX(-20px)' }, { opacity: 0 }],
          { duration: 200, fill: 'forwards', easing: 'ease-out' }
        );
      }
      
      setTimeout(() => {
        // Changer le mois
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        
        updateDateDisplay();
        generateCalendar(currentMonth, currentYear);
        
        // Animer l'entrée du nouveau mois
        if (calendarGrid) {
          calendarGrid.animate(
            [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 0.5, transform: 'translateX(10px)' }, { opacity: 1, transform: 'translateX(0)' }],
            { duration: 300, fill: 'forwards', easing: 'ease-out' }
          );
        }
      }, 250);
    });
  }
  
  if (todayBtn) {
    todayBtn.addEventListener('click', function() {
      const todayButton = this;
      
      // Animation du bouton
      todayButton.animate(africanAnimations.pulse, subtleAnimationOptions);
      
      // Animation de transition
      if (calendarGrid) {
        calendarGrid.animate(
          africanAnimations.adinkraTransition,
          { duration: 400, direction: 'alternate', fill: 'forwards' }
        );
      }
      
      setTimeout(() => {
        // Revenir à aujourd'hui
        currentDate = new Date();
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        
        updateDateDisplay();
        generateCalendar(currentMonth, currentYear);
        
        // Mettre en évidence la date du jour
        highlightToday();
      }, 300);
    });
  }
  
  // Fonction pour changer de vue de calendrier
  function switchCalendarView(viewType) {
    if (viewType === currentView) return;
    
    // Animation de transition
    if (calendarGrid) {
      calendarGrid.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.95)' }],
        { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
      );
    }
    
    setTimeout(() => {
      currentView = viewType;
      
      // Générer la vue appropriée
      switch(viewType) {
        case 'month':
          generateCalendar(currentMonth, currentYear);
          break;
        case 'week':
          generateWeekView(currentDate);
          break;
        case 'day':
          generateDayView(currentDate);
          break;
        case 'list':
          generateListView(currentMonth, currentYear);
          break;
      }
      
      // Animation d'entrée
      if (calendarGrid) {
        calendarGrid.animate(
          [{ opacity: 0, transform: 'scale(1.05)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 300, fill: 'forwards', easing: 'ease-out' }
        );
      }
      
      // Afficher un toast pour indiquer le changement de vue
      showToast(`Vue ${viewType === 'month' ? 'mensuelle' : viewType === 'week' ? 'hebdomadaire' : viewType === 'day' ? 'quotidienne' : 'liste'} activée`, 'info');
    }, 300);
  }
  
  // ...
  
  /**
   * Mettre à jour l'affichage de la date actuelle avec animation
   */
  function updateDateDisplay() {
    if (currentDateDisplay) {
      // Animation de transition
      currentDateDisplay.animate(
        [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }],
        { duration: 150, fill: 'forwards', easing: 'ease-out' }
      );
      
      setTimeout(() => {
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        currentDateDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Animation d'apparition
        currentDateDisplay.animate(
          [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 200, fill: 'forwards', easing: 'ease-out' }
        );
      }, 150);
    }
  }
  
  /**
   * Mettre en évidence le jour actuel dans le calendrier
   */
  function highlightToday() {
    const today = new Date();
    const todayCell = document.querySelector(`.calendar-day[data-date="${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}"]`);
    
    if (todayCell) {
      // Supprimer les autres mises en évidence
      document.querySelectorAll('.calendar-day.today').forEach(day => {
        day.classList.remove('today');
      });
      
      // Ajouter la classe today
      todayCell.classList.add('today');
      
      // Animation de mise en évidence
      todayCell.animate(
        [{ boxShadow: '0 0 0 4px rgba(94, 53, 177, 0.2)' }, { boxShadow: '0 0 0 8px rgba(94, 53, 177, 0)' }],
        { duration: 1500, iterations: 2, easing: 'ease-in-out' }
      );
    }
  }
  
  // ...
  
  /**
   * Générer le calendrier pour un mois spécifique
   * @param {number} month - Le mois (0-11)
   * @param {number} year - L'année
   */
  /**
 * Crée une cellule de jour pour le calendrier
 * @param {number} day - Le numéro du jour
 * @param {boolean} isOtherMonth - Indique si le jour fait partie d'un autre mois
 * @param {Date} date - L'objet Date correspondant au jour
 * @return {HTMLElement} - L'élément DOM représentant la cellule du jour
 */
function createDayCell(day, isOtherMonth, date) {
  // Créer la cellule du jour
  const dayCell = document.createElement('div');
  dayCell.className = 'calendar-day';
  if (isOtherMonth) {
    dayCell.classList.add('other-month');
  }
  
  // Créer l'en-tête du jour (numéro)
  const dayHeader = document.createElement('div');
  dayHeader.className = 'day-header';
  dayHeader.textContent = day;
  dayCell.appendChild(dayHeader);
  
  // Créer le conteneur pour les rendez-vous
  const dayContent = document.createElement('div');
  dayContent.className = 'day-content';
  dayCell.appendChild(dayContent);
  
  // Ajouter des attributs de données pour faciliter l'accès aux infos de date
  dayCell.dataset.date = date.toISOString().split('T')[0];
  dayCell.dataset.day = day;
  dayCell.dataset.month = date.getMonth();
  dayCell.dataset.year = date.getFullYear();
  
  // Ajouter un événement de clic pour créer un rendez-vous
  dayCell.addEventListener('click', function() {
    // Animer la cellule au clic
    this.animate(africanAnimations.pulse, subtleAnimationOptions);
    // Ouvrir le modal pour créer un nouveau rendez-vous à cette date
    openNewAppointmentModal(date);
  });
  
  // Effet de survol élégant
  dayCell.addEventListener('mouseenter', function() {
    this.animate(africanAnimations.buttonPulse, {
      duration: 400,
      easing: 'ease-in-out'
    });
  });
  
  return dayCell;
}

/**
 * Génère le calendrier pour un mois spécifique
 * @param {number} month - Le mois (0-11)
 * @param {number} year - L'année
 */
function generateCalendar(month, year) {
  const calendarGrid = document.getElementById('calendarGrid');
  if (!calendarGrid) return;
  
  // Mettre à jour l'affichage du mois et de l'année courants
  updateMonthYearDisplay(month, year);
  
  // Vider le contenu actuel avec animation de transition
  fadeOutElement(calendarGrid, () => {
    calendarGrid.innerHTML = '';
    
    // Générer l'en-tête des jours de la semaine en français avec animation séquentielle
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    // Créer une ligne d'en-tête distincte pour les jours de la semaine
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    calendarGrid.appendChild(headerRow);
    
    // Ajouter chaque jour avec une animation séquentielle
    daysOfWeek.forEach((day, index) => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      headerRow.appendChild(dayHeader);
      
      // Animation séquentielle avec délai progressif
      setTimeout(() => {
        dayHeader.animate(
          [
            { opacity: 0, transform: 'translateY(-10px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 300, fill: 'forwards', easing: 'ease-out' }
        );
      }, index * 50);
    });
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Nombre de jours dans le mois
    const daysInMonth = lastDay.getDate();
    
    // Jour de la semaine du premier jour (0 = Dimanche, 1 = Lundi, ...)
    // Nous voulons que la semaine commence le lundi, donc nous ajustons
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Si c'est dimanche (0), on le met à la fin (6)
    
    // Créer un conteneur pour les cellules des jours
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-days-container';
    calendarGrid.appendChild(daysContainer);
    
    // Animation d'entrée pour le conteneur
    setTimeout(() => {
      daysContainer.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 400, fill: 'forwards', easing: 'ease-out' }
      );
    }, 200);
    
    // Créer les cellules pour les jours du mois précédent
    const prevMonth = month - 1 < 0 ? 11 : month - 1;
    const prevYear = month - 1 < 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const dayNum = prevMonthLastDay - firstDayOfWeek + i + 1;
      const dayCell = createDayCell(dayNum, true, new Date(prevYear, prevMonth, dayNum));
      daysContainer.appendChild(dayCell);
      
      // Animation séquentielle pour les jours du mois précédent
      animateDayCell(dayCell, i, 'fadeIn');
    }
    
    // Créer les cellules pour les jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = createDayCell(i, false, new Date(year, month, i));
      daysContainer.appendChild(dayCell);
      
      // Animation séquentielle pour les jours du mois en cours
      animateDayCell(dayCell, firstDayOfWeek + i - 1, 'scaleIn');
      
      // Vérifier si c'est aujourd'hui
      const today = new Date();
      if (today.getDate() === i && today.getMonth() === month && today.getFullYear() === year) {
        dayCell.classList.add('today');
        // Animation spéciale pour mettre en évidence le jour courant
        setTimeout(() => {
          dayCell.animate(africanAnimations.pulse, {
            duration: 1000,
            easing: 'ease-in-out',
            iterations: 2
          });
        }, 800);
      }
    }
    
    // Créer les cellules pour les jours du mois suivant
    const nextMonth = month + 1 > 11 ? 0 : month + 1;
    const nextYear = month + 1 > 11 ? year + 1 : year;
    let nextMonthDate = 1;
    
    // S'assurer que la grille est complète (multiple de 7)
    const remainingCells = (7 - ((firstDayOfWeek + daysInMonth) % 7)) % 7;
    
    for (let i = 0; i < remainingCells; i++) {
      const dayCell = createDayCell(nextMonthDate, true, new Date(nextYear, nextMonth, nextMonthDate));
      daysContainer.appendChild(dayCell);
      nextMonthDate++;
      
      // Animation séquentielle pour les jours du mois suivant
      animateDayCell(dayCell, firstDayOfWeek + daysInMonth + i, 'fadeIn');
    }
    
    /**
     * Anime une cellule de jour avec un délai progressif
     * @param {HTMLElement} cell - La cellule à animer
     * @param {number} index - L'index de la cellule pour calculer le délai
     * @param {string} type - Le type d'animation ('fadeIn' ou 'scaleIn')
     */
    function animateDayCell(cell, index, type) {
      // Délai progressif basé sur la position dans la grille
      const delay = 30 + (index % 7) * 30 + Math.floor(index / 7) * 70;
      
      setTimeout(() => {
        if (type === 'fadeIn') {
          cell.animate(
            [
              { opacity: 0, transform: 'translateY(5px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 200, fill: 'forwards', easing: 'ease-out' }
          );
        } else if (type === 'scaleIn') {
          cell.animate(
            [
              { opacity: 0, transform: 'scale(0.9)' },
              { opacity: 1, transform: 'scale(1)' }
            ],
            { duration: 250, fill: 'forwards', easing: 'ease-out' }
          );
        }
      }, delay);
    }
    
    // Animation d'entrée pour le nouveau contenu
    fadeInElement(calendarGrid);
    
    // Charger les rendez-vous pour ce mois
    loadAppointments(year, month);
  });
}

/**
 * Met à jour l'affichage du mois et de l'année
 * @param {number} month - Le mois (0-11)
 * @param {number} year - L'année
 */
function updateMonthYearDisplay(month, year) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const currentDateElement = document.querySelector('.current-date');
  if (currentDateElement) {
    // Animation de transition pour le changement de mois
    fadeOutElement(currentDateElement, () => {
      currentDateElement.textContent = `${monthNames[month]} ${year}`;
      fadeInElement(currentDateElement);
    });
  }
}

/**
 * Anime la disparition d'un élément avec un fondu
 * @param {HTMLElement} element - L'élément à animer
 * @param {Function} callback - Fonction à exécuter après l'animation
 */
function fadeOutElement(element, callback) {
  const animation = element.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 300, easing: 'ease-out', fill: 'forwards' }
  );
  
  animation.onfinish = callback || null;
}

/**
 * Anime l'apparition d'un élément avec un fondu
 * @param {HTMLElement} element - L'élément à animer
 */
function fadeInElement(element) {
  element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300, easing: 'ease-in', fill: 'forwards' }
  );
}
  
  /**
   * Crée un élément de rendez-vous avec boutons d'action
   * @param {Object} appointmentData - Les données du rendez-vous
   * @return {HTMLElement} - L'élément DOM représentant le rendez-vous
   */
  function createAppointment(appointmentData) {
    const appointment = document.createElement('div');
    
    // Standardiser sur l'orthographe britannique "cancelled" au lieu de "canceled"
    let status = appointmentData.status || 'pending';
    if (status === 'canceled') {
      status = 'cancelled';
    }
    
    appointment.className = `appointment ${status}`;
    appointment.setAttribute('data-id', appointmentData.id || 'temp-' + Date.now());
    
    // Créer le conteneur d'information principal
    const infoContainer = document.createElement('div');
    infoContainer.className = 'appointment-info';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = appointmentData.time || '12:00';
    
    const clientSpan = document.createElement('span');
    clientSpan.className = 'client';
    clientSpan.textContent = appointmentData.client || 'Client';
    
    const typeSpan = document.createElement('span');
    typeSpan.className = 'type';
    typeSpan.textContent = appointmentData.type || 'Consultation';
    
    infoContainer.appendChild(timeSpan);
    infoContainer.appendChild(clientSpan);
    infoContainer.appendChild(typeSpan);
    
    // Ajouter le conteneur d'information à l'élément de rendez-vous
    appointment.appendChild(infoContainer);
    
    // Créer le conteneur pour les boutons d'action
    const actionButtons = document.createElement('div');
    actionButtons.className = 'appointment-actions';
    
    // Bouton d'édition avec style africain
    const editButton = document.createElement('button');
    editButton.className = 'action-btn edit-btn';
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.setAttribute('title', 'Modifier ce rendez-vous');
    
    // Bouton d'annulation avec style africain
    const cancelButton = document.createElement('button');
    cancelButton.className = 'action-btn cancel-btn';
    cancelButton.innerHTML = '<i class="fas fa-times"></i>';
    cancelButton.setAttribute('title', 'Annuler ce rendez-vous');
    
    // Ajouter les boutons au conteneur d'actions
    actionButtons.appendChild(editButton);
    actionButtons.appendChild(cancelButton);
    
    // Ajouter le conteneur d'actions à l'élément de rendez-vous
    appointment.appendChild(actionButtons);
    
    // Ajouter l'effet de survol avec animation africaine
    appointment.addEventListener('mouseenter', function() {
      this.classList.add('appointment-hover');
      this.animate(africanAnimations.pulse, subtleAnimationOptions);
      
      // Animation d'entrée pour les boutons d'action
      actionButtons.animate(
        [
          { opacity: 0, transform: 'translateX(10px)' },
          { opacity: 1, transform: 'translateX(0)' }
        ],
        { duration: 300, fill: 'forwards', easing: 'ease-out' }
      );
    });
    
    appointment.addEventListener('mouseleave', function() {
      this.classList.remove('appointment-hover');
      
      // Animation de sortie pour les boutons d'action
      actionButtons.animate(
        [
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(10px)' }
        ],
        { duration: 200, fill: 'forwards', easing: 'ease-in' }
      );
    });
    
    // Événement de clic sur le rendez-vous pour afficher les détails
    infoContainer.addEventListener('click', function(event) {
      event.stopPropagation(); // Empêcher le déclenchement de l'événement sur la cellule
      showAppointmentDetails(appointmentData);
    });
    
    // Événement de clic sur le bouton d'édition
    editButton.addEventListener('click', function(event) {
      event.stopPropagation();
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      editAppointment(appointmentData);
    });
    
    // Événement de clic sur le bouton d'annulation
    cancelButton.addEventListener('click', function(event) {
      event.stopPropagation();
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      showCancelConfirmation(appointmentData);
    });
    
    return appointment;
  }

}

/**
 * Affiche les détails d'un rendez-vous dans un modal
 * @param {Object} appointmentData - Les données du rendez-vous
 */
function showAppointmentDetails(appointmentData) {
  const modal = document.getElementById('appointmentDetailsModal');
  modal.style.display = 'flex';
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '1';
  }, 50);
  
  // Animation du contenu
  const modalContentElement = modal.querySelector('.modal-content');
  modalContentElement.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    modalContentElement.style.transition = 'transform 0.3s ease';
    modalContentElement.style.transform = 'translateY(0)';
  }, 100);
  
  // Mettre à jour le contenu avec les détails du rendez-vous
  const content = modal.querySelector('#appointmentDetailsContent');
  
  if (content) {
    // Formater la date du rendez-vous
    const appointmentDate = new Date(appointmentData.date);
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // Générer le contenu HTML avec un style africain
    content.innerHTML = `
      <div class="appointment-details">
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-user"></i> Client:</span>
          <span class="detail-value">${appointmentData.client || 'Non spécifié'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-calendar-day"></i> Date:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-clock"></i> Heure:</span>
          <span class="detail-value">${appointmentData.time || 'Non spécifiée'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-tag"></i> Type:</span>
          <span class="detail-value">${appointmentData.type || 'Consultation'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-info-circle"></i> Statut:</span>
          <span class="detail-value status-badge ${appointmentData.status || 'pending'}">
            ${getStatusLabel(appointmentData.status || 'pending')}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label"><i class="fas fa-comment-alt"></i> Notes:</span>
          <span class="detail-value notes">${appointmentData.notes || 'Aucune note'}</span>
        </div>
      </div>
    `;
    
    // Animation d'entrée avec un style africain
    const detailRows = content.querySelectorAll('.detail-row');
    detailRows.forEach((row, index) => {
      setTimeout(() => {
        row.animate(
          [
            { opacity: 0, transform: 'translateX(-10px)' },
            { opacity: 1, transform: 'translateX(0)' }
          ],
          { duration: 300, fill: 'forwards', easing: 'ease-out' }
        );
      }, index * 100); // Délai progressif pour chaque ligne
    });
  }
  
  // Configurer les boutons d'action
  const editBtn = modal.querySelector('#editAppointmentBtn');
  const confirmBtn = modal.querySelector('#confirmAppointmentBtn');
  const cancelBtn = modal.querySelector('#cancelAppointmentBtn');
  
  if (editBtn) {
    editBtn.onclick = function() {
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Fermer ce modal et ouvrir le modal d'édition
      closeModal(modal);
      editAppointment(appointmentData);
    };
  }
  
  if (confirmBtn) {
    // Ajuster la visibilité du bouton de confirmation selon le statut
    confirmBtn.style.display = appointmentData.status === 'confirmed' ? 'none' : 'inline-block';
    
    confirmBtn.onclick = function() {
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Confirmer le rendez-vous
      confirmAppointment(appointmentData);
      closeModal(modal);
    };
  }
  
  if (cancelBtn) {
    // Ajuster la visibilité du bouton d'annulation selon le statut
    cancelBtn.style.display = appointmentData.status === 'cancelled' ? 'none' : 'inline-block';
    
    cancelBtn.onclick = function() {
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Fermer ce modal et ouvrir le modal de confirmation d'annulation
      closeModal(modal);
      showCancelConfirmation(appointmentData);
    };
  }
  
  // Ouvrir le modal avec animation
  modal.style.display = 'flex';
  const modalContent = modal.querySelector('.modal-content');
  
  if (modalContent) {
    modalContent.animate(
      [
        { opacity: 0, transform: 'translateY(-20px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
  }
}

/**
 * Ferme un modal avec animation
 * @param {HTMLElement} modal - L'élément modal à fermer
 */
function closeModal(modal) {
  const modalContentElement = modal.querySelector('.modal-content');
  modalContentElement.style.transform = 'translateY(20px)';
  modal.style.opacity = '0';
  
  setTimeout(() => {
      modal.style.display = 'none';
    modalContentElement.style.transform = 'translateY(0)';
  }, 300);
}

/**
 * Ouvre le formulaire d'édition d'un rendez-vous
 * @param {Object} appointmentData - Les données du rendez-vous à éditer
 */
function editAppointment(appointmentData) {
  // Créer ou réutiliser le modal d'édition
  let editModal = document.getElementById('editAppointmentModal');
  
  if (!editModal) {
    // Créer le modal s'il n'existe pas
    editModal = document.createElement('div');
    editModal.id = 'editAppointmentModal';
    editModal.className = 'modal';
    
    editModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-edit"></i> Modifier le rendez-vous</h2>
          <button class="close-btn" aria-label="Fermer">&times;</button>
        </div>
        <div class="modal-body">
          <form id="editAppointmentForm" class="appointment-form">
            <input type="hidden" id="appointmentId">
            <div class="form-group">
              <label for="clientName"><i class="fas fa-user"></i> Client</label>
              <input type="text" id="clientName" class="form-control" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="appointmentDate"><i class="fas fa-calendar"></i> Date</label>
                <input type="date" id="appointmentDate" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="appointmentTime"><i class="fas fa-clock"></i> Heure</label>
                <input type="time" id="appointmentTime" class="form-control" required>
              </div>
            </div>
            <div class="form-group">
              <label for="appointmentType"><i class="fas fa-tag"></i> Type</label>
              <select id="appointmentType" class="form-control" required>
                <option value="Consultation">Consultation</option>
                <option value="Création sur-mesure">Création sur-mesure</option>
                <option value="Retouche">Retouche</option>
                <option value="Essayage">Essayage</option>
                <option value="Livraison">Livraison</option>
              </select>
            </div>
            <div class="form-group">
              <label for="appointmentStatus"><i class="fas fa-info-circle"></i> Statut</label>
              <select id="appointmentStatus" class="form-control" required>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            <div class="form-group">
              <label for="appointmentNotes"><i class="fas fa-comment-alt"></i> Notes</label>
              <textarea id="appointmentNotes" class="form-control" rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn outline-btn" id="cancelEditBtn"><i class="fas fa-times"></i> Annuler</button>
          <button class="btn primary-btn" id="saveAppointmentBtn"><i class="fas fa-save"></i> Enregistrer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Ajouter l'événement de fermeture
    const closeBtn = editModal.querySelector('.close-btn');
    const cancelBtn = editModal.querySelector('#cancelEditBtn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(editModal));
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => closeModal(editModal));
    }
    
    // Ajouter l'événement de sauvegarde
    const saveBtn = editModal.querySelector('#saveAppointmentBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveAppointmentChanges);
    }
  }
  
  // Remplir le formulaire avec les données existantes
  const form = editModal.querySelector('#editAppointmentForm');
  if (form) {
    // Remplir l'ID caché
    const idInput = form.querySelector('#appointmentId');
    if (idInput) idInput.value = appointmentData.id || '';
    
    // Remplir le nom du client
    const clientInput = form.querySelector('#clientName');
    if (clientInput) clientInput.value = appointmentData.client || '';
    
    // Remplir la date
    const dateInput = form.querySelector('#appointmentDate');
    if (dateInput) {
      const appointmentDate = new Date(appointmentData.date);
      dateInput.value = appointmentDate.toISOString().split('T')[0];
    }
    
    // Remplir l'heure
    const timeInput = form.querySelector('#appointmentTime');
    if (timeInput) timeInput.value = appointmentData.time || '';
    
    // Sélectionner le type
    const typeSelect = form.querySelector('#appointmentType');
    if (typeSelect) typeSelect.value = appointmentData.type || 'Consultation';
    
    // Sélectionner le statut
    const statusSelect = form.querySelector('#appointmentStatus');
    if (statusSelect) statusSelect.value = appointmentData.status || 'pending';
    
    // Remplir les notes
    const notesInput = form.querySelector('#appointmentNotes');
    if (notesInput) notesInput.value = appointmentData.notes || '';
  }
  
  // Ouvrir le modal avec animation
  editModal.style.display = 'flex';
  const modalContent = editModal.querySelector('.modal-content');
  
  if (modalContent) {
    modalContent.animate(
      [
        { opacity: 0, transform: 'translateY(-20px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
  }
}

/**
 * Enregistre les modifications d'un rendez-vous
 */
function saveAppointmentChanges() {
  const form = document.getElementById('editAppointmentForm');
  if (!form) return;
  
  // Vérifier la validité du formulaire
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Récupérer les données du formulaire
  const appointmentId = form.querySelector('#appointmentId').value;
  const client = form.querySelector('#clientName').value;
  const date = form.querySelector('#appointmentDate').value;
  const time = form.querySelector('#appointmentTime').value;
  const type = form.querySelector('#appointmentType').value;
  const status = form.querySelector('#appointmentStatus').value;
  const notes = form.querySelector('#appointmentNotes').value;
  
  // Créer l'objet de données mis à jour
  const updatedData = {
    id: appointmentId,
    client,
    date,
    time,
    type,
    status,
    notes
  };
  
  // Dans un environnement réel, nous enverrions ces données au serveur
  // Pour ce projet, nous simulons la mise à jour
  console.log('Mise à jour du rendez-vous:', updatedData);
  
  // Fermer le modal
  const editModal = document.getElementById('editAppointmentModal');
  closeModal(editModal);
  
  // Afficher une notification de succès
  showToast('Rendez-vous mis à jour avec succès', 'success');
  
  // Rafraîchir le calendrier pour afficher les changements
  // Dans un cas réel, nous attendrions la confirmation du serveur
  setTimeout(() => {
    const currentDate = new Date();
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
  }, 500);
}

/**
 * Affiche une confirmation avant d'annuler un rendez-vous
 * @param {Object} appointmentData - Les données du rendez-vous à annuler
 */
function showCancelConfirmation(appointmentData) {
  // Créer ou réutiliser le modal de confirmation
  let confirmModal = document.getElementById('cancelConfirmModal');
  
  if (!confirmModal) {
    // Créer le modal s'il n'existe pas
    confirmModal = document.createElement('div');
    confirmModal.id = 'cancelConfirmModal';
    confirmModal.className = 'modal';
    
    confirmModal.innerHTML = `
      <div class="modal-content confirm-modal">
        <div class="modal-header">
          <h2><i class="fas fa-exclamation-triangle"></i> Confirmer l'annulation</h2>
          <button class="close-btn" aria-label="Fermer">&times;</button>
        </div>
        <div class="modal-body" id="cancelConfirmContent">
          <p>Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.</p>
          <div class="appointment-summary" id="appointmentToCancel"></div>
        </div>
        <div class="modal-footer">
          <button class="btn outline-btn" id="cancelNoBtn"><i class="fas fa-arrow-left"></i> Retour</button>
          <button class="btn danger-btn" id="cancelYesBtn"><i class="fas fa-times"></i> Oui, annuler</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    // Ajouter les événements de fermeture
    const closeBtn = confirmModal.querySelector('.close-btn');
    const noBtn = confirmModal.querySelector('#cancelNoBtn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(confirmModal));
    }
    
    if (noBtn) {
      noBtn.addEventListener('click', () => closeModal(confirmModal));
    }
  }
  
  // Mettre à jour le contenu avec les détails du rendez-vous
  const summaryElement = confirmModal.querySelector('#appointmentToCancel');
  if (summaryElement) {
    // Formater la date du rendez-vous
    const appointmentDate = new Date(appointmentData.date);
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    });
    
    summaryElement.innerHTML = `
      <div class="summary-row"><strong>Client:</strong> ${appointmentData.client || 'Non spécifié'}</div>
      <div class="summary-row"><strong>Date:</strong> ${formattedDate} à ${appointmentData.time || 'heure non spécifiée'}</div>
      <div class="summary-row"><strong>Type:</strong> ${appointmentData.type || 'Consultation'}</div>
    `;
    
    // Animer l'apparition du résumé
    summaryElement.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
  }
  
  // Configurer le bouton de confirmation d'annulation
  const yesBtn = confirmModal.querySelector('#cancelYesBtn');
  if (yesBtn) {
    // Supprimer l'événement précédent s'il existe pour éviter les duplications
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    
    newYesBtn.addEventListener('click', function() {
      // Animation du bouton
      this.animate(africanAnimations.buttonPulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Procéder à l'annulation
      cancelAppointment(appointmentData);
      closeModal(confirmModal);
    });
  }
  
  // Ouvrir le modal avec animation
  confirmModal.style.display = 'flex';
  const modalContent = confirmModal.querySelector('.modal-content');
  
  if (modalContent) {
    modalContent.animate(
      [
        { opacity: 0, transform: 'translateY(-20px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
    
    // Ajouter une animation d'alerte pour attirer l'attention
    setTimeout(() => {
      modalContent.animate(
        [
          { boxShadow: '0 0 0 rgba(244, 67, 54, 0)' },
          { boxShadow: '0 0 20px rgba(244, 67, 54, 0.5)' },
          { boxShadow: '0 0 0 rgba(244, 67, 54, 0)' }
        ],
        { duration: 1000, iterations: 2 }
      );
    }, 500);
  }
}

/**
 * Annule un rendez-vous
 * @param {Object} appointmentData - Les données du rendez-vous à annuler
 */
function cancelAppointment(appointmentData) {
  // Dans un environnement réel, nous enverrions une requête au serveur
  console.log('Annulation du rendez-vous:', appointmentData);
  
  // Mettre à jour localement le statut du rendez-vous
  const updatedData = {
    ...appointmentData,
    status: 'cancelled'
  };
  
  // Afficher une notification
  showToast('Rendez-vous annulé', 'warning');
  
  // Rafraîchir le calendrier pour afficher les changements
  setTimeout(() => {
    const currentDate = new Date();
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
  }, 500);
}

/**
 * Confirme un rendez-vous
 * @param {Object} appointmentData - Les données du rendez-vous à confirmer
 */
function confirmAppointment(appointmentData) {
  // Dans un environnement réel, nous enverrions une requête au serveur
  console.log('Confirmation du rendez-vous:', appointmentData);
  
  // Mettre à jour localement le statut du rendez-vous
  const updatedData = {
    ...appointmentData,
    status: 'confirmed'
  };
  
  // Afficher une notification
  showToast('Rendez-vous confirmé', 'success');
  
  // Rafraîchir le calendrier pour afficher les changements
  setTimeout(() => {
    const currentDate = new Date();
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
  }, 500);
}

/**
 * Obtient le libellé du statut en français
 * @param {string} status - Le code du statut
 * @return {string} Le libellé du statut en français
 */
function getStatusLabel(status) {
  const statusMap = {
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'cancelled': 'Annulé',
    'completed': 'Terminé'
  };
  
  return statusMap[status] || 'Inconnu';
}

/**
 * Ouvre le modal pour créer un nouveau rendez-vous
 * @param {Date} date - La date du rendez-vous
 */
function openNewAppointmentModal(date) {
  const modal = document.getElementById('newAppointmentModal');
  if (!modal) return;
  
  // Afficher le modal
  modal.style.display = 'flex';
  
  // Animation d'entrée
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) {
    modalContent.animate(africanAnimations.growIn, defaultAnimationOptions);
  }
  
  // Pré-remplir la date dans le formulaire
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput && date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // Animation pour mettre en évidence le champ date
    dateInput.animate([
      { backgroundColor: 'rgba(94, 53, 177, 0.1)' },
      { backgroundColor: 'transparent' }
    ], { duration: 1000, easing: 'ease-out' });
  }
  
  // Focus sur le champ client
  setTimeout(() => {
    const clientSelect = document.getElementById('appointmentClient');
    if (clientSelect) clientSelect.focus();
  }, 300);
}

/**
 * Fonction pour charger les rendez-vous
 * @param {number} year - L'année
 * @param {number} month - Le mois (0-11)
 */
function loadAppointments(year, month) {
  // En l'absence d'une vraie API, nous allons simuler des données
  const demoAppointments = generateDemoAppointments(year, month);
  
  // Pour chaque rendez-vous, trouver la cellule correspondante et y ajouter le rendez-vous
  demoAppointments.forEach(appointment => {
    const date = new Date(appointment.date);
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const dayCell = document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    
    if (dayCell) {
      const dayContent = dayCell.querySelector('.day-content');
      if (dayContent) {
        const appointmentElement = createAppointment(appointment);
        dayContent.appendChild(appointmentElement);
      }
    }
  });
}

/**
 * Génère des rendez-vous de démonstration pour un mois donné
 * @param {number} year - L'année
 * @param {number} month - Le mois (0-11)
 * @returns {Array} - Un tableau d'objets représentant les rendez-vous
 */
function generateDemoAppointments(year, month) {
  const appointments = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const clients = ['Amina Koné', 'Thomas Lefebvre', 'Sarah Ndiaye', 'Ousmane Diallo', 'Marie Dupont', 'Jean Mensah', 'Fatou Sy'];
  const types = ['Création sur-mesure', 'Consultation', 'Essayage', 'Retouche', 'Récupération'];
  const locations = ['Atelier Central - Salle 1', 'Atelier Central - Salle 2', 'Atelier Sud - Bureau 3', 'Atelier Central - Bureau'];
  const statuses = ['confirmed', 'pending', 'canceled', 'completed'];
  
  // Nombre aléatoire de rendez-vous entre 15 et 30
  const numAppointments = Math.floor(Math.random() * 15) + 15;
  
  for (let i = 0; i < numAppointments; i++) {
    // Jour aléatoire dans le mois
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    // Heure aléatoire entre 8h et 18h
    const hour = Math.floor(Math.random() * 10) + 8;
    const minute = Math.random() > 0.5 ? '00' : '30';
    const time = `${hour}:${minute}`;
    
    // Statut aléatoire, avec plus de chance pour 'confirmed' et 'pending'
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.5) {
      status = 'confirmed';
    } else if (statusRandom < 0.8) {
      status = 'pending';
    } else if (statusRandom < 0.9) {
      status = 'canceled';
    } else {
      status = 'completed';
    }
    
    // Créer l'objet rendez-vous
    appointments.push({
      id: 'appt-' + Date.now() + '-' + i,
      date: new Date(year, month, day),
      time: time,
      client: clients[Math.floor(Math.random() * clients.length)],
      type: types[Math.floor(Math.random() * types.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: status,
      notes: Math.random() > 0.7 ? 'Notes sur les préférences du client et détails spécifiques du rendez-vous.' : ''
    });
  }
  
  return appointments;
}

/**
 * Affiche un toast de notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de toast (info, success, warning, error)
 */
function showToast(message, type = 'info') {
  // Ne montrer les notifications que pour les actions importantes
  if (message.includes('supprimé') || message.includes('modifié') || message.includes('ajouté')) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    </div>
      <button class="toast-close">&times;</button>
  `;
  
    document.body.appendChild(toast);
  
  // Animation d'entrée
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Auto-fermeture après 3 secondes
    setTimeout(() => {
      closeToast(toast);
    }, 3000);
    
    // Fermeture manuelle
  const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      closeToast(toast);
    });
  }
}

/**
 * Ferme un toast avec animation
 * @param {HTMLElement} toast - L'élément toast à fermer
 */
function closeToast(toast) {
  toast.animate(
    [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-20px)' }],
    { duration: 300, fill: 'forwards', easing: 'ease-in' }
  ).onfinish = function() {
    toast.remove();
  };
}

/**
 * Initialiser les filtres
 */
function initializeFilters() {
  const searchInput = document.getElementById('searchAppointment');
  const filterChips = document.querySelectorAll('.filter-chip');
  let searchTimeout;

  // Gestion de la recherche avec délai
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const search = this.value.trim();
        if (search.length >= 2 || search.length === 0) {  // Recherche seulement si 2 caractères ou plus, ou vide
          const currentUrl = new URL(window.location.href);
          if (search) {
            currentUrl.searchParams.set('search', search);
          } else {
            currentUrl.searchParams.delete('search');
          }
          window.location.href = currentUrl.toString();
        }
      }, 800);  // Augmentation du délai à 800ms
    });
  }

  // Gestion des filtres de statut
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const filter = this.dataset.filter;
      const currentUrl = new URL(window.location.href);
      if (filter === 'all') {
        currentUrl.searchParams.delete('status');
      } else {
        currentUrl.searchParams.set('status', filter);
      }
      window.location.href = currentUrl.toString();
    });
  });
}

/**
 * Initialise les actions
 */
function initializeActions() {
  const viewButtons = document.querySelectorAll('.view-switcher .btn');
  
  // Changer la vue du calendrier
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const viewType = this.id.replace('ViewBtn', '').toLowerCase();
      
      // Mettre à jour l'état actif
      viewButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Animer le bouton
      this.animate(africanAnimations.pulse, {
        duration: 300,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });
      
      // Changer la vue (à implémenter)
      changeCalendarView(viewType);
    });
  });
  
  // Fonction pour changer la vue du calendrier
  function changeCalendarView(viewType) {
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (!calendarContainer) return;
    
    // Animer la transition
    calendarContainer.animate([
      { opacity: 0.5, transform: 'scale(0.98)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    // Afficher un message pour la vue sélectionnée
    showToast(`Vue ${viewType} activée`, 'info');
    
    // Ici, vous pouvez implémenter le changement réel de la vue
    // Par exemple, modifier la structure du calendrier en fonction du type de vue
  }
  
  // Bouton pour créer un nouveau rendez-vous
  const newAppointmentBtn = document.getElementById('newAppointmentBtn');
  if (newAppointmentBtn) {
    newAppointmentBtn.addEventListener('click', function() {
      openNewAppointmentModal(new Date());
    });
  }
  
  // Bouton pour sauvegarder un rendez-vous
  const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
  if (saveAppointmentBtn) {
    saveAppointmentBtn.addEventListener('click', function() {
      // Récupérer les données du formulaire
      const formData = {
        client: document.getElementById('appointmentClient').value,
        type: document.getElementById('appointmentType').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        duration: document.getElementById('appointmentDuration').value,
        location: document.getElementById('appointmentLocation').value,
        notes: document.getElementById('appointmentNotes').value,
        notify: document.getElementById('appointmentNotify').checked
      };
      
      // Validation du formulaire
      if (formData.client && formData.type && formData.date && formData.time && formData.location) {
        // Fermer le modal
        document.getElementById('newAppointmentModal').style.display = 'none';
        
        // Afficher le toast de confirmation
        showToast('Rendez-vous créé avec succès', 'success');
      } else {
        // Afficher une erreur
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
      }
    });
  }
  
  // Initialiser les boutons de modification des rendez-vous
  initializeEditButtons();
  
  // Initialiser les boutons d'annulation des rendez-vous
  initializeCancelButtons();
  
  // Bouton pour sauvegarder les modifications d'un rendez-vous
  const saveEditAppointmentBtn = document.getElementById('saveEditAppointmentBtn');
  if (saveEditAppointmentBtn) {
    saveEditAppointmentBtn.addEventListener('click', function() {
      saveEditedAppointment();
    });
  }
  
  // Bouton pour annuler la modification (fermeture du modal)
  const editCancelBtn = document.getElementById('editCancelBtn');
  if (editCancelBtn) {
    editCancelBtn.addEventListener('click', function() {
      document.getElementById('editAppointmentModal').style.display = 'none';
    });
  }
  
  // Bouton pour confirmer l'annulation d'un rendez-vous
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', function() {
      cancelAppointment();
    });
  }
  
  // Bouton pour fermer le modal d'annulation
  const cancelModalClose = document.getElementById('cancelModalClose');
  if (cancelModalClose) {
    cancelModalClose.addEventListener('click', function() {
      document.getElementById('cancelConfirmModal').style.display = 'none';
    });
  }
  
  // Gérer les actions sur les rendez-vous
  const appointmentActions = document.querySelectorAll('.appointment-actions .btn');
  appointmentActions.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Empêcher la propagation aux éléments parents
      
      const action = this.title.toLowerCase();
      const appointmentCard = this.closest('.appointment-card');
      const clientName = appointmentCard.querySelector('h4').textContent;
      
      // Animer le bouton
      this.animate(africanAnimations.pulse, {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Effectuer l'action correspondante
      if (action === 'modifier') {
        showToast(`Modification du rendez-vous de ${clientName}`, 'info');
        // Ici, vous pouvez ouvrir un modal d'édition
      } else if (action === 'annuler') {
        appointmentCard.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(20px)' }
        ], {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
        });
        
        setTimeout(() => {
          appointmentCard.style.display = 'none';
        }, 300);
        
        showToast(`Rendez-vous de ${clientName} annulé`, 'warning');
      }
    });
  });

  // Gestion des boutons de suppression
  const deleteButtons = document.querySelectorAll('.delete-appointment-btn');
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  let currentRdvId = null;

  deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
          const rdvId = this.getAttribute('data-id');
          const row = this.closest('tr');
          
          // Récupérer les informations du rendez-vous
          const clientName = row.querySelector('.appointment-client').textContent;
          const serviceName = row.querySelector('.appointment-type').textContent;
          const date = row.querySelector('.appointment-date').textContent;
          const time = row.querySelector('.appointment-time').textContent;

          // Remplir le modal avec les informations
          document.getElementById('deleteClientName').textContent = clientName;
          document.getElementById('deleteServiceName').textContent = serviceName;
          document.getElementById('deleteDate').textContent = date;
          document.getElementById('deleteTime').textContent = time;

          // Stocker l'ID du rendez-vous
          currentRdvId = rdvId;

          // Afficher le modal
          deleteModal.style.display = 'flex';
      });
  });

  // Gestion de la confirmation de suppression
  confirmDeleteBtn.addEventListener('click', function() {
      if (!currentRdvId) return;

      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('rdv_id', currentRdvId);
      formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

      fetch(window.location.href, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Supprimer la ligne du tableau
              const row = document.querySelector(`[data-id="${currentRdvId}"]`);
              if (row) {
                  row.remove();
              }
              // Fermer le modal
              deleteModal.style.display = 'none';
              // Afficher le message de succès
              showToast(data.message, 'success');
              // Mettre à jour les statistiques si nécessaire
              updateStats();
          } else {
              showToast(data.message, 'error');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          showToast('Une erreur est survenue lors de la suppression', 'error');
      });
  });

  // Gestion de l'annulation de la suppression
  cancelDeleteBtn.addEventListener('click', function() {
      deleteModal.style.display = 'none';
      currentRdvId = null;
  });

  // Gestion de la fermeture du modal
  const closeButtons = deleteModal.querySelectorAll('.close-btn');
  closeButtons.forEach(button => {
      button.addEventListener('click', function() {
          deleteModal.style.display = 'none';
          currentRdvId = null;
      });
  });

  // Fermer le modal si on clique en dehors
  window.addEventListener('click', function(event) {
      if (event.target === deleteModal) {
          deleteModal.style.display = 'none';
          currentRdvId = null;
      }
  });
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const stats = document.querySelectorAll('.stat-card .stat-content p:first-child');
    if (stats.length >= 4) {
        // Mettre à jour le nombre total de rendez-vous
        const totalAppointments = document.querySelectorAll('.appointment-row').length;
        stats[0].textContent = totalAppointments;

        // Mettre à jour les autres statistiques
        const enAttente = document.querySelectorAll('.status-badge.en_attente').length;
        const confirme = document.querySelectorAll('.status-badge.confirme').length;
        const aujourdhui = document.querySelectorAll('.appointment-row').length; // À ajuster selon la logique métier

        stats[1].textContent = enAttente;
        stats[2].textContent = aujourdhui;
        stats[3].textContent = confirme;
    }
}

/**
 * Initialise les boutons de modification des rendez-vous
 * Cette fonction attache les événements aux boutons d'édition des rendez-vous
 */
function initializeEditButtons() {
  // Sélectionner tous les boutons d'édition
  const editButtons = document.querySelectorAll('.appointment-actions .edit-appointment-btn');
  
  editButtons.forEach(button => {
    // Ajouter un effet visuel au survol
    button.addEventListener('mouseenter', function() {
      this.animate(africanAnimations.buttonPulse, {
        duration: 400,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });
    });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Effet visuel lors du clic
      this.animate(africanAnimations.kenteWave, {
        duration: 500,
        easing: 'ease-out'
      });
      
      // Trouver la carte de rendez-vous parente
      const appointmentCard = this.closest('.appointment-card');
      
      try {
        // Récupérer les données du rendez-vous depuis la carte
        // Dans un cas réel, on récupérerait l'ID et on chargerait les données depuis une API
        const appointmentData = {
          id: appointmentCard.dataset.id || generateRandomId(),
          client: appointmentCard.querySelector('.appointment-details h4').textContent,
          type: appointmentCard.querySelector('.appointment-details p:nth-child(2)').textContent.replace(/<i class="fas fa-tag"><\/i>\s*/, ''),
          location: appointmentCard.querySelector('.appointment-details p:nth-child(3)').textContent.replace(/<i class="fas fa-map-marker-alt"><\/i>\s*/, ''),
          time: appointmentCard.querySelector('.appointment-time strong').textContent,
          duration: appointmentCard.querySelector('.appointment-time .duration').textContent,
          status: appointmentCard.querySelector('.appointment-status').classList[1] || 'pending',
          notes: 'Notes additionnelles sur le rendez-vous...'
        };
        
        // Ouvrir le modal d'édition et pré-remplir les champs
        openEditAppointmentModal(appointmentData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du rendez-vous:', error);
        showToast('Une erreur est survenue lors de la modification du rendez-vous', 'error');
      }
    });
  });
}

/**
 * Initialise les boutons d'annulation des rendez-vous
 * Cette fonction attache les événements aux boutons d'annulation des rendez-vous
 */
function initializeCancelButtons() {
  // Sélectionner tous les boutons d'annulation
  const cancelButtons = document.querySelectorAll('.appointment-actions .cancel-appointment-btn');
  
  cancelButtons.forEach(button => {
    // Ajouter un effet visuel au survol
    button.addEventListener('mouseenter', function() {
      this.animate(africanAnimations.shake, {
        duration: 500,
        easing: 'ease-in-out'
      });
    });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Effet visuel lors du clic
      this.animate(africanAnimations.pulse, {
        duration: 400,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });
      
      // Trouver la carte de rendez-vous parente
      const appointmentCard = this.closest('.appointment-card');
      
      try {
        // Vérifier si le statut est déjà annulé
        const statusElement = appointmentCard.querySelector('.appointment-status');
        if (statusElement && statusElement.classList.contains('canceled')) {
          showToast('Ce rendez-vous est déjà annulé', 'warning');
          return;
        }
        
        // Récupérer les données du rendez-vous depuis la carte
        const appointmentData = {
          id: appointmentCard.dataset.id || generateRandomId(),
          client: appointmentCard.querySelector('.appointment-details h4').textContent,
          type: appointmentCard.querySelector('.appointment-details p:nth-child(2)').textContent.replace(/<i class="fas fa-tag"><\/i>\s*/, ''),
          location: appointmentCard.querySelector('.appointment-details p:nth-child(3)').textContent.replace(/<i class="fas fa-map-marker-alt"><\/i>\s*/, ''),
          time: appointmentCard.querySelector('.appointment-time strong').textContent,
          duration: appointmentCard.querySelector('.appointment-time .duration').textContent,
          status: statusElement ? statusElement.classList[1] || 'pending' : 'pending'
        };
        
        // Effet de transition sur la carte
        appointmentCard.animate(africanAnimations.fadeInUp, {
          duration: 300,
          easing: 'ease-out'
        });
        
        // Ouvrir le modal de confirmation d'annulation
        openCancelConfirmModal(appointmentData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du rendez-vous:', error);
        showToast('Une erreur est survenue lors de l\'annulation du rendez-vous', 'error');
      }
    });
  });
}

/**
 * Ouvre le modal d'édition de rendez-vous et pré-remplit les champs
 * @param {Object} appointmentData - Les données du rendez-vous à modifier
 */
function openEditAppointmentModal(appointmentData) {
  const modal = document.getElementById('editAppointmentModal');
  
  if (!modal) return;
  
  // Pré-remplir les champs avec les données du rendez-vous
  document.getElementById('editAppointmentId').value = appointmentData.id;
  
  // Mapper les données du client (exemple simplifié - en production, on utiliserait un ID client)
  const clientSelect = document.getElementById('editAppointmentClient');
  // Trouver l'option qui correspond au nom du client
  Array.from(clientSelect.options).forEach(option => {
    if (option.text === appointmentData.client) {
      clientSelect.value = option.value;
    }
  });
  
  // Mapper le type de rendez-vous
  const typeSelect = document.getElementById('editAppointmentType');
  // Type est au format "Type - Description", donc on prend la première partie
  const appointmentType = appointmentData.type.split(' - ')[0].toLowerCase();
  Array.from(typeSelect.options).forEach(option => {
    if (option.text.toLowerCase().includes(appointmentType)) {
      typeSelect.value = option.value;
    }
  });
  
  // Date et heure - en production, ces valeurs viendraient de la base de données
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  document.getElementById('editAppointmentDate').value = dateString;
  document.getElementById('editAppointmentTime').value = appointmentData.time;
  
  // Durée - convertir "1h" en "60", "30min" en "30", etc.
  const durationText = appointmentData.duration.toLowerCase();
  let durationValue = '60'; // Valeur par défaut
  if (durationText.includes('min')) {
    durationValue = durationText.replace('min', '');
  } else if (durationText.includes('h')) {
    const hours = parseInt(durationText.replace('h', ''));
    durationValue = String(hours * 60);
  }
  document.getElementById('editAppointmentDuration').value = durationValue;
  
  // Lieu
  const locationSelect = document.getElementById('editAppointmentLocation');
  Array.from(locationSelect.options).forEach(option => {
    if (option.text === appointmentData.location) {
      locationSelect.value = option.value;
    }
  });
  
  // Statut
  document.getElementById('editAppointmentStatus').value = appointmentData.status;
  
  // Notes
  document.getElementById('editAppointmentNotes').value = appointmentData.notes || '';
  
  // Afficher le modal avec une animation élégante
  modal.style.display = 'flex';
  const modalContent = modal.querySelector('.modal-content');
  modalContent.animate(africanAnimations.fadeInUp, defaultAnimationOptions);
}

/**
 * Ouvre le modal de confirmation d'annulation de rendez-vous
 * @param {Object} appointmentData - Les données du rendez-vous à annuler
 */
function openCancelConfirmModal(appointmentData) {
  const modal = document.getElementById('cancelConfirmModal');
  
  if (!modal) return;
  
  // Stocker l'ID du rendez-vous dans un attribut de données du modal
  modal.dataset.appointmentId = appointmentData.id;
  
  // Préparer le résumé du rendez-vous pour affichage
  const summaryContainer = document.getElementById('cancelAppointmentSummary');
  summaryContainer.innerHTML = `
    <div class="appointment-details-card ${appointmentData.status}">
      <div class="detail-row">
        <div class="detail-label"><i class="fas fa-user"></i>Client</div>
        <div class="detail-value">${appointmentData.client}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label"><i class="fas fa-tag"></i>Type</div>
        <div class="detail-value">${appointmentData.type}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label"><i class="fas fa-clock"></i>Horaire</div>
        <div class="detail-value">${appointmentData.time} (${appointmentData.duration})</div>
      </div>
      <div class="detail-row">
        <div class="detail-label"><i class="fas fa-map-marker-alt"></i>Lieu</div>
        <div class="detail-value">${appointmentData.location}</div>
      </div>
    </div>
  `;
  
  // Vider le champ de motif d'annulation
  document.getElementById('cancellationReason').value = '';
  
  // Afficher le modal avec une animation
  modal.style.display = 'flex';
  const modalContent = modal.querySelector('.modal-content');
  modalContent.animate(africanAnimations.fadeInUp, defaultAnimationOptions);
}

/**
 * Sauvegarde les modifications d'un rendez-vous
 */
function saveEditedAppointment() {
  // Récupérer les données du formulaire
  const formData = {
    id: document.getElementById('editAppointmentId').value,
    client: document.getElementById('editAppointmentClient').value,
    type: document.getElementById('editAppointmentType').value,
    date: document.getElementById('editAppointmentDate').value,
    time: document.getElementById('editAppointmentTime').value,
    duration: document.getElementById('editAppointmentDuration').value,
    location: document.getElementById('editAppointmentLocation').value,
    status: document.getElementById('editAppointmentStatus').value,
    notes: document.getElementById('editAppointmentNotes').value,
    notify: document.getElementById('editAppointmentNotify').checked
  };
  
  // Validation du formulaire
  if (formData.client && formData.type && formData.date && formData.time && formData.location) {
    // En production, ici on enverrait les données vers l'API pour mise à jour en base
    
    // Simuler une mise à jour réussie
    setTimeout(() => {
      // Fermer le modal
      document.getElementById('editAppointmentModal').style.display = 'none';
      
      // Afficher le toast de confirmation
      showToast('Rendez-vous modifié avec succès', 'success');
      
      // En production, on mettrait à jour l'UI pour refléter les changements
      // Ici, on simule en modifiant directement le DOM pour la démonstration
      const appointmentCards = document.querySelectorAll('.appointment-card');
      appointmentCards.forEach(card => {
        if (card.dataset.id === formData.id) {
          // Mettre à jour les informations visibles
          // Dans un cas réel, on rechargerait plutôt les données depuis l'API
          card.querySelector('.appointment-status').className = `appointment-status ${formData.status}`;
          card.querySelector('.appointment-status').textContent = getStatusText(formData.status);
        }
      });
    }, 500);
  } else {
    // Afficher une erreur
    showToast('Veuillez remplir tous les champs obligatoires', 'error');
  }
}

/**
 * Annule un rendez-vous
 */
function cancelAppointment() {
  const modal = document.getElementById('cancelConfirmModal');
  const appointmentId = modal.dataset.appointmentId;
  const reason = document.getElementById('cancellationReason').value;
  const notifyClient = document.getElementById('notifyClientCancel').checked;
  
  // Afficher un indicateur de chargement pour donner un feedback visuel
  const confirmButton = document.getElementById('confirmCancelBtn');
  const originalText = confirmButton.innerHTML;
  confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
  confirmButton.disabled = true;
  
  // En production, ici on enverrait les données vers l'API pour mise à jour en base
  
  // Simuler une annulation réussie avec délai réaliste
  setTimeout(() => {
    // Restaurer le bouton
    confirmButton.innerHTML = originalText;
    confirmButton.disabled = false;
    
    // Fermer le modal avec animation
    const modalContent = modal.querySelector('.modal-content');
    const closeAnimation = modalContent.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(20px)' }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });
    
    closeAnimation.onfinish = () => {
      modal.style.display = 'none';
      
      // Afficher le toast de confirmation avec message personnalisé
      const message = reason
        ? `Rendez-vous annulé avec succès. Motif: ${reason.substring(0, 30)}${reason.length > 30 ? '...' : ''}`
        : 'Rendez-vous annulé avec succès';
      
      showToast(message, 'success');
      
      if (notifyClient) {
        // Afficher un toast supplémentaire pour la notification
        setTimeout(() => {
          showToast('Notification envoyée au client', 'info');
        }, 1000);
      }
      
      // Mettre à jour l'UI pour refléter les changements
      const appointmentCards = document.querySelectorAll('.appointment-card');
      appointmentCards.forEach(card => {
        if (card.dataset.id === appointmentId) {
          // Animation de transition avant modification
          const beforeAnimation = card.animate(africanAnimations.fadeInUp, {
            duration: 300,
            easing: 'ease-out'
          });
          
          beforeAnimation.onfinish = () => {
            // Mettre à jour le statut
            const statusElement = card.querySelector('.appointment-status');
            if (statusElement) {
              statusElement.className = 'appointment-status canceled';
              statusElement.textContent = 'Annulé';
              
              // Animation du badge de statut
              statusElement.animate(africanAnimations.pulse, {
                duration: 500,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              });
            }
            
            // Ajouter une classe pour indiquer visuellement l'annulation
            card.classList.add('canceled');
            
            // Applique un style visuel légèrement estompé pour les rendez-vous annulés
            card.style.opacity = '0.85';
            card.style.backgroundColor = 'var(--bg-color)';
            
            // Animation pour finaliser la transition
            card.animate([
              { boxShadow: '0 5px 15px rgba(230, 57, 70, 0.3)' },
              { boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }
            ], {
              duration: 800,
              easing: 'ease-out'
            });
          };
        }
      });
    };
  }, 800);
}

/**
 * Génère un ID aléatoire pour les rendez-vous (pour la démo)
 * @returns {string} - Un ID unique
 */
function generateRandomId() {
  return 'app_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Obtient le texte de statut en français
 * @param {string} status - Le code de statut
 * @returns {string} - Le texte de statut en français
 */
function getStatusText(status) {
  switch (status) {
    case 'confirmed':
      return 'Confirmé';
    case 'pending':
      return 'En attente';
    case 'canceled':
      return 'Annulé';
    case 'completed':
      return 'Terminé';
    default:
      return 'En attente';
  }
}

/**
 * Afficher un toast de notification
 */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Add icon based on type
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
  
  // Set toast content
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, 5000);
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

// Gestion du thème
function initializeTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Vérifier le thème sauvegardé ou utiliser la préférence système
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Gérer le changement de thème
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animation de transition
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  });
  
  // Mettre à jour l'icône du bouton
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}

// Appeler l'initialisation du thème au chargement
document.addEventListener('DOMContentLoaded', () => {
  initializeCalendar();
  initializeTheme();
});

// Fonction pour ajouter l'effet d'onde africaine
function addAfricanWaveEffect(element, event) {
  const wave = document.createElement('div');
  wave.className = 'african-wave-effect';
  
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  wave.style.left = `${x}px`;
  wave.style.top = `${y}px`;
  
  element.appendChild(wave);
  
  wave.addEventListener('animationend', () => {
    wave.remove();
  });
}

// Fonction pour animer les éléments de la page
function animatePageElements() {
  const elements = document.querySelectorAll('.stat-card, .filter-chip, .appointment-row');
  
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

// Fonction pour gérer les transitions de thème
function handleThemeTransition() {
  const overlay = document.createElement('div');
  overlay.className = 'theme-transition-overlay';
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 0);
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }, 300);
}

// Fonction pour animer les badges de statut
function animateStatusBadge(badge) {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'translateY(-3px)';
  });
  
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'translateY(0)';
  });
}

// Fonction pour animer les boutons d'action
function animateActionButton(button) {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 4px 12px rgba(242, 161, 33, 0.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = 'none';
  });
}

// Initialisation des animations
function initializeAnimations() {
  // Ajouter les effets d'onde aux cartes
  document.querySelectorAll('.stat-card, .filter-chip, .appointment-row').forEach(element => {
    element.addEventListener('click', (event) => {
      addAfricanWaveEffect(element, event);
    });
  });
  
  // Animer les badges de statut
  document.querySelectorAll('.status-badge').forEach(animateStatusBadge);
  
  // Animer les boutons d'action
  document.querySelectorAll('.change-status-btn, .cancel-appointment-btn').forEach(animateActionButton);
  
  // Animer les éléments de la page au chargement
  animatePageElements();
}

// Appeler l'initialisation des animations au chargement de la page
document.addEventListener('DOMContentLoaded', initializeAnimations);
