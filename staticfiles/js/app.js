/**
 * Atelier de Couture - Application JavaScript principale
 * Ce fichier contient les fonctionnalités partagées entre toutes les pages
 */

// Utilisation du mode strict pour éviter les erreurs courantes
'use strict';

// Module principal de l'application (Pattern Module)
const App = (function() {
  // État de l'application
  const state = {
    theme: localStorage.getItem('theme') || 'light',
    mobileMenuOpen: false,
    userLoggedIn: false,
    user: null
  };

  // Cache des éléments DOM fréquemment utilisés
  const DOM = {};

  /**
   * Initialise l'application
   */
  function init() {
    // Mettre en cache les éléments DOM fréquemment utilisés
    cacheDOM();
    
    // Appliquer le thème sauvegardé
    applyTheme(state.theme);
    
    // Vérifier si l'utilisateur est connecté
    checkUserAuthentication();
    
    // Attacher les événements
    bindEvents();
    
    // Initialiser les modules spécifiques à la page actuelle
    initPageModules();

    // Ajouter une classe pour les animations d'entrée
    document.body.classList.add('loaded');
  }

  /**
   * Met en cache les éléments DOM fréquemment utilisés
   */
  function cacheDOM() {
    DOM.body = document.body;
    DOM.header = document.querySelector('.header') || document.querySelector('header');
    DOM.hamburger = document.querySelector('.hamburger');
    DOM.navLinks = document.querySelector('.nav-links') || document.querySelector('nav ul');
    DOM.themeToggle = document.querySelector('.theme-toggle');
    DOM.forms = Array.from(document.querySelectorAll('form'));
  }

  /**
   * Attache les événements
   */
  function bindEvents() {
    // Gestion du menu mobile
    if (DOM.hamburger) {
      DOM.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Gestion du toggle de thème
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Gestion des formulaires
    DOM.forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
    
    // Animations de défilement
    window.addEventListener('scroll', handleScroll);
    
    // Fermer le menu mobile lorsqu'on clique en dehors
    document.addEventListener('click', handleDocumentClick);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  function checkUserAuthentication() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        state.user = JSON.parse(userData);
        state.userLoggedIn = true;
        updateUI();
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }

  /**
   * Met à jour l'interface utilisateur en fonction de l'état
   */
  function updateUI() {
    // Mettre à jour l'interface pour l'utilisateur connecté
    if (state.userLoggedIn && state.user) {
      const loginButtons = document.querySelectorAll('.login-btn, .connexion-btn');
      loginButtons.forEach(button => {
        button.textContent = 'Mon compte';
        button.href = 'profil.html';
      });

      // Afficher des éléments pour les administrateurs
      if (state.user.isAdmin) {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => element.classList.remove('hidden'));
      }
    }
  }

  /**
   * Bascule le menu mobile
   */
  function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    DOM.navLinks.classList.toggle('active', state.mobileMenuOpen);
    DOM.hamburger.setAttribute('aria-expanded', state.mobileMenuOpen);
  }

  /**
   * Bascule le thème entre clair et sombre
   */
  function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    state.theme = newTheme;
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Applique le thème spécifié
   * @param {string} theme - 'light' ou 'dark'
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      DOM.body.classList.add('dark-mode');
      if (DOM.themeToggle) {
        DOM.themeToggle.innerHTML = '☀️';
        DOM.themeToggle.setAttribute('aria-label', 'Passer au thème clair');
      }
    } else {
      DOM.body.classList.remove('dark-mode');
      if (DOM.themeToggle) {
        DOM.themeToggle.innerHTML = '🌙';
        DOM.themeToggle.setAttribute('aria-label', 'Passer au thème sombre');
      }
    }
  }

  /**
   * Gestion des formulaires
   * @param {Event} event - L'événement de soumission du formulaire
   */
  function handleFormSubmit(event) {
    // Prévenir la soumission par défaut pour les formulaires de connexion/inscription
    if (event.target.id === 'connexionForm' || event.target.id === 'inscriptionForm') {
      event.preventDefault();
      const formId = event.target.id;
      
      if (formId === 'connexionForm') {
        const email = document.getElementById('connexionEmail').value;
        const password = document.getElementById('connexionPassword').value;
        
        // Simple validation côté client
        if (!email || !password) {
          showNotification('Veuillez remplir tous les champs', 'error');
          return;
        }
        
        // Simulation d'une connexion réussie
        simulateLogin(email);
      } else if (formId === 'inscriptionForm') {
        const firstName = document.getElementById('prenom').value;
        const lastName = document.getElementById('nom').value;
        const email = document.getElementById('inscriptionEmail').value;
        const password = document.getElementById('inscriptionPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Simple validation côté client
        if (!firstName || !lastName || !email || !password) {
          showNotification('Veuillez remplir tous les champs', 'error');
          return;
        }
        
        if (password !== confirmPassword) {
          showNotification('Les mots de passe ne correspondent pas', 'error');
          return;
        }
        
        // Simulation d'une inscription réussie
        simulateRegistration(firstName, lastName, email);
      }
    }
  }

  /**
   * Simulation de connexion
   * @param {string} email - L'email de l'utilisateur
   */
  function simulateLogin(email) {
    // Dans une application réelle, cela serait une requête à un serveur
    // Ici, nous simulons une connexion réussie
    const user = {
      email: email,
      firstName: 'Utilisateur',
      lastName: 'Test',
      isAdmin: email.includes('admin')
    };
    
    // Stocker les informations de l'utilisateur
    localStorage.setItem('user', JSON.stringify(user));
    state.user = user;
    state.userLoggedIn = true;
    
    // Afficher un message de succès
    showNotification('Connexion réussie, redirection...', 'success');
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  /**
   * Simulation d'inscription
   * @param {string} firstName - Le prénom de l'utilisateur
   * @param {string} lastName - Le nom de l'utilisateur
   * @param {string} email - L'email de l'utilisateur
   */
  function simulateRegistration(firstName, lastName, email) {
    // Dans une application réelle, cela serait une requête à un serveur
    // Ici, nous simulons une inscription réussie
    const user = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      isAdmin: false
    };
    
    // Stocker les informations de l'utilisateur
    localStorage.setItem('user', JSON.stringify(user));
    state.user = user;
    state.userLoggedIn = true;
    
    // Afficher un message de succès
    showNotification('Inscription réussie, redirection...', 'success');
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  function logout() {
    localStorage.removeItem('user');
    state.user = null;
    state.userLoggedIn = false;
    
    // Afficher un message de succès
    showNotification('Déconnexion réussie, redirection...', 'success');
    
    // Rediriger vers la page d'accueil après un court délai
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  /**
   * Affiche une notification
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de notification ('success', 'error', 'info')
   */
  function showNotification(message, type = 'info') {
    // Vérifier si une notification existe déjà
    let toast = document.querySelector('.toast');
    
    // Créer un élément toast s'il n'existe pas
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    // Définir le contenu et la classe du toast
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    // Masquer le toast après un délai
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }

  /**
   * Gestion du défilement pour les animations
   */
  function handleScroll() {
    const scrollElements = document.querySelectorAll('.scroll-animation');
    
    scrollElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight * 0.9) {
        element.classList.add('animated');
      }
    });
  }

  /**
   * Gestion des clics sur le document
   * @param {Event} event - L'événement de clic
   */
  function handleDocumentClick(event) {
    // Fermer le menu mobile si on clique en dehors
    if (state.mobileMenuOpen && DOM.hamburger && DOM.navLinks) {
      if (!DOM.hamburger.contains(event.target) && !DOM.navLinks.contains(event.target)) {
        toggleMobileMenu();
      }
    }
  }

  /**
   * Initialise les modules spécifiques à la page actuelle
   */
  function initPageModules() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialiser les modules en fonction de la page actuelle
    switch (currentPage) {
      case 'index.html':
      case '':
        // Module spécifique à la page d'accueil
        if (typeof HomeModule !== 'undefined') {
          HomeModule.init();
        }
        break;
        
      case 'catalogue.html':
        // Module spécifique au catalogue
        if (typeof CatalogueModule !== 'undefined') {
          CatalogueModule.init();
        }
        break;
        
      case 'service.html':
        // Module spécifique aux services
        if (typeof ServiceModule !== 'undefined') {
          ServiceModule.init();
        }
        break;
        
      case 'rendez-vous.html':
        // Module spécifique aux rendez-vous
        if (typeof RendezVousModule !== 'undefined') {
          RendezVousModule.init();
        }
        break;
        
      case 'profil.html':
        // Module spécifique au profil
        if (typeof ProfilModule !== 'undefined') {
          ProfilModule.init();
        }
        break;
        
      case 'admin.html':
        // Module spécifique à l'administration
        if (typeof AdminModule !== 'undefined') {
          AdminModule.init();
        }
        break;
    }
  }

  /**
   * Méthodes et propriétés exposées publiquement
   */
  return {
    init: init,
    showNotification: showNotification,
    logout: logout,
    getUser: () => state.user,
    isUserLoggedIn: () => state.userLoggedIn
  };
})();

// Initialiser l'application lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', App.init);

// Fonctions communes à toutes les pages du site Atelier de Couture

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des animations au défilement
    initScrollAnimations();
    
    // Gestion de la navigation responsive
    initResponsiveNav();
    
    // Initialisation des effets de survol pour les cartes d'ateliers
    initWorkshopHoverEffects();
    
    // Initialisation des compteurs animés
    initCounters();
    
    // Initialisation du bouton retour en haut
    initBackToTop();
    
    // Gestion du header sticky avec effet au défilement
    initStickyHeader();
});

// Fonction pour initialiser les animations au défilement
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animation');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementHeight = el.getBoundingClientRect().height;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('active');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 85)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Déclencher une fois au chargement pour les éléments déjà visibles
    setTimeout(handleScrollAnimation, 100);
    
    // Ajouter l'écouteur d'événement pour le défilement
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Fonction pour initialiser la navigation responsive
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu lorsqu'un lien est cliqué
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Fermer le menu lorsqu'on clique en dehors
        document.addEventListener('click', function(event) {
            const isClickInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Fonction pour initialiser les effets de survol pour les cartes d'ateliers
function initWorkshopHoverEffects() {
    const workshopCards = document.querySelectorAll('.atelier-card');
    
    workshopCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.05)';
        });
    });
}

// Fonction pour initialiser les compteurs animés
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // durée de l'animation en ms
                    const step = Math.ceil(target / (duration / 16)); // 16ms par frame (environ 60fps)
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                            observer.unobserve(counter);
                        } else {
                            counter.textContent = current;
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    requestAnimationFrame(updateCounter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

// Fonction pour initialiser le bouton retour en haut
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Fonction pour initialiser le header sticky avec effet au défilement
function initStickyHeader() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Fonction pour ajouter un effet parallaxe au hero
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', 
                hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
    }
    
    // Fermeture du menu au clic en dehors
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Gestion du thème (clair/sombre)
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Mise à jour de l'icône
            const isDarkTheme = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDarkTheme ? '☀️' : '🌙';
            
            // Sauvegarde de la préférence
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        });
        
        // Chargement du thème préféré
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || 
            (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '☀️';
        }
    }
    
    // Animation du header au scroll
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Animation des éléments au scroll
    const animatedElements = document.querySelectorAll('.scroll-animation');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Ajout des réseaux sociaux dans le footer
    const footerBottoms = document.querySelectorAll('.footer-bottom');
    
    footerBottoms.forEach(footerBottom => {
        // Vérifier si les réseaux sociaux existent déjà
        if (!footerBottom.querySelector('.footer-social')) {
            const socialDiv = document.createElement('div');
            socialDiv.className = 'footer-social';
            
            // Ajout des icônes de réseaux sociaux
            socialDiv.innerHTML = `
                <a href="#" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                </a>
                <a href="#" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                </a>
                <a href="#" aria-label="Pinterest">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z"/>
                    </svg>
                </a>
            `;
            
            footerBottom.appendChild(socialDiv);
        }
    });
});