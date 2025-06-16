/**
 * Sidebar Management
 * This script handles the sidebar functionality across all admin pages
 */

document.addEventListener('DOMContentLoaded', function() {
  // Sélection des éléments
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('.main-content');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // Vérification des éléments
  if (!sidebar || !sidebarToggle || !mainContent) {
    console.error('Required elements not found:', {
      sidebar: !!sidebar,
      sidebarToggle: !!sidebarToggle,
      mainContent: !!mainContent
    });
    return;
  }

  // Ajouter les attributs data-title pour les tooltips
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const text = link.textContent.trim();
    link.setAttribute('data-title', text);
  });

  // Fonction pour basculer l'état de la barre latérale
  function toggleSidebar() {
    console.log('Toggling sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Sauvegarder l'état dans localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    
    // Ajuster le contenu principal
    if (window.innerWidth > 991.98) {
      mainContent.style.marginLeft = isCollapsed ? '80px' : '280px';
    }
  }

  // Fonction pour gérer l'état mobile
  function handleMobileState() {
    console.log('Handling mobile state, width:', window.innerWidth);
    if (window.innerWidth <= 991.98) {
      sidebar.classList.remove('collapsed');
      mainContent.style.marginLeft = '0';
      
      // Ajouter l'overlay si nécessaire
      if (!sidebarOverlay) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
        });
      }
    } else {
      // Restaurer l'état desktop
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      sidebar.classList.toggle('collapsed', isCollapsed);
      mainContent.style.marginLeft = isCollapsed ? '80px' : '280px';
    }
  }

  // Gérer le clic sur le bouton de bascule
  sidebarToggle.addEventListener('click', function(e) {
    console.log('Toggle button clicked');
    e.preventDefault();
    
    if (window.innerWidth <= 991.98) {
      // Mode mobile
      sidebar.classList.toggle('active');
      const overlay = document.getElementById('sidebarOverlay');
      if (overlay) {
        overlay.classList.toggle('active');
      }
    } else {
      // Mode desktop
      toggleSidebar();
    }
  });

  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', handleMobileState);

  // Initialiser l'état
  handleMobileState();

  // Ajouter des animations fluides
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      if (sidebar.classList.contains('collapsed')) {
        this.style.transform = 'scale(1.1)';
      }
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Gérer les clics sur les liens de navigation
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function() {
      // Si en mode mobile, fermer la barre latérale après le clic
      if (window.innerWidth <= 991.98) {
        sidebar.classList.remove('active');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
          overlay.classList.remove('active');
        }
      }
    });
  });
});