document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const themeToggle = document.querySelector('.theme-toggle');
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const infoCards = document.querySelectorAll('.info-card');
    const mapContainer = document.querySelector('.map-container');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Initialisation des animations et des comportements
    initializeUI();

    // Gestion du menu hamburger mobile
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Gestion du thème sombre/clair
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle du thème
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            
            // Mise à jour du bouton de thème
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Sauvegarde du choix dans localStorage
            localStorage.setItem('theme', newTheme);
        });
        
        // Appliquer le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Ajouter les effets d'animation aux éléments
    document.querySelectorAll('.info-card, .contact-form, .map-container').forEach(item => {
        item.classList.add('animate-item');
        observer.observe(item);
    });

    // Gestion du formulaire de contact
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Désactiver le bouton pendant la soumission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';

        // Récupération et validation des données
        const formData = new FormData(contactForm);
        const formDataObject = Object.fromEntries(formData.entries());

        if (!validateForm(formDataObject)) {
            resetSubmitButton();
            return;
        }

        try {
            await simulateFormSubmission(formDataObject);
            showToast('Message envoyé avec succès !', 'success');
            contactForm.reset();
            
            // Animation du bouton de succès
            submitBtn.innerHTML = '<span>Envoyé !</span>';
            setTimeout(resetSubmitButton, 2000);
        } catch (error) {
            showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
            resetSubmitButton();
        }

        function resetSubmitButton() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Validation en temps réel des champs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
                input.classList.remove('invalid');
            }
        });
    });

    // Validation du formulaire
    function validateForm(data) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validation du nom
        if (!data.name || data.name.length < 2) {
            showFieldError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        }
        
        // Validation de l'email
        if (!emailRegex.test(data.email)) {
            showFieldError('email', 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validation du sujet
        if (!data.subject || data.subject.length < 3) {
            showFieldError('subject', 'Le sujet doit contenir au moins 3 caractères');
            isValid = false;
        }
        
        // Validation du message
        if (!data.message || data.message.length < 10) {
            showFieldError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }

        return isValid;
    }
    
    // Validation d'un champ individuel
    function validateField(input) {
        const field = input.id;
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Supprimer les messages d'erreur existants
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Valider en fonction du type de champ
        switch(field) {
            case 'name':
                if (!value || value.length < 2) {
                    input.classList.add('invalid');
                    showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
                    return false;
                }
                break;
            case 'email':
                if (!emailRegex.test(value)) {
                    input.classList.add('invalid');
                    showFieldError(field, 'Veuillez entrer une adresse email valide');
                    return false;
                }
                break;
            case 'subject':
                if (!value || value.length < 3) {
                    input.classList.add('invalid');
                    showFieldError(field, 'Le sujet doit contenir au moins 3 caractères');
                    return false;
                }
                break;
            case 'message':
                if (!value || value.length < 10) {
                    input.classList.add('invalid');
                    showFieldError(field, 'Le message doit contenir au moins 10 caractères');
                    return false;
                }
                break;
        }
        
        input.classList.remove('invalid');
        input.classList.add('valid');
        return true;
    }
    
    // Afficher une erreur pour un champ spécifique
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.add('invalid');
        
        // Éviter les doublons
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.textContent = message;
            return;
        }
        
        // Créer et ajouter le message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        field.parentElement.appendChild(errorMessage);
    }

    // Simulation d'envoi du formulaire
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Données du formulaire:', data);
                resolve();
            }, 1500);
        });
    }

    // Afficher une notification toast
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    // Initialisation de l'UI
    function initializeUI() {
        // Ajouter un effet de survol aux cartes d'information
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });
        });
        
        // Ajouter les styles CSS pour les animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-item.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .info-card.hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .animate-item {
                    transition: none;
                    animation: none;
                    transform: none;
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Initialiser la carte Google Maps
        initMap();
    }
    
    // Initialisation de la carte Google Maps
    function initMap() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.innerHTML = `
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081693!2d2.292292615509614!3d48.85837360866272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1629979126954!5m2!1sfr!2sfr" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy"
                    title="Google Maps - Atelier de Couture">
                </iframe>
            `;
        }
    }

    // Animation des icônes SVG
    function animateIcons() {
        const icons = document.querySelectorAll('.info-card svg');
        
        icons.forEach(icon => {
            // Animation initiale
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                icon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }, 100);
            
            // Animation au survol
            icon.parentElement.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            icon.parentElement.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0)';
            });
        });
    }

    // Gestion de la carte 
    function setupMap() {
        const mapContainer = document.querySelector('.map-container');
        const mapIcon = document.querySelector('.map-icon');
        
        if (mapContainer && mapIcon) {
            // Observer la visibilité de la carte
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation d'entrée pour le contenu de la carte
                        const mapContent = document.querySelector('.map-content');
                        if (mapContent) {
                            mapContent.style.opacity = '0';
                            mapContent.style.transform = 'translateY(20px)';
                            mapContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            
                            setTimeout(() => {
                                mapContent.style.opacity = '1';
                                mapContent.style.transform = 'translateY(0)';
                            }, 300);
                        }
                        
                        // Animation pour l'icône
                        if (mapIcon) {
                            mapIcon.style.opacity = '0';
                            mapIcon.style.transform = 'translateY(20px)';
                            mapIcon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            
                            setTimeout(() => {
                                mapIcon.style.opacity = '1';
                                mapIcon.style.transform = 'translateY(0)';
                            }, 500);
                        }
                        
                        observer.unobserve(mapContainer);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(mapContainer);
        }
    }

    // Exécuter les fonctions après le chargement du DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Animations existantes
        if (typeof setupAnimations === 'function') setupAnimations();
        if (typeof setupFormValidation === 'function') setupFormValidation();
        if (typeof setupThemeToggle === 'function') setupThemeToggle();
        
        // Nouvelles animations
        animateIcons();
        setupMap();
    });
}); 