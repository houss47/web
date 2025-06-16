/**
 * Script pour la page de connexion/inscription
 * Gère les transitions entre les formulaires et les animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const loginTabs = document.querySelectorAll('.login-tab');
    const connexionForm = document.getElementById('connexionForm');
    const inscriptionForm = document.getElementById('inscriptionForm');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const submitButtons = document.querySelectorAll('.btn-submit');
    const loginContainer = document.querySelector('.login-container');

    // Animation d'entrée pour les éléments
    animateLoginFormElements();

    // Gestion des onglets de connexion/inscription
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.getAttribute('data-form');
            
            // Mise à jour des classes actives pour les onglets
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Affichage du formulaire correspondant avec transition
            if (targetForm === 'connexion') {
                inscriptionForm.classList.add('hidden');
                setTimeout(() => {
                    connexionForm.classList.remove('hidden');
                    animateLoginFormElements();
                }, 300);
            } else {
                connexionForm.classList.add('hidden');
                setTimeout(() => {
                    inscriptionForm.classList.remove('hidden');
                    animateLoginFormElements();
                }, 300);
            }
        });
    });

    // Gestion des liens dans les formulaires
    document.querySelectorAll('.register-link a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = link.getAttribute('data-form');
            document.querySelector(`.login-tab[data-form="${targetForm}"]`).click();
        });
    });

    // Toggle visibilité des mots de passe
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const type = input.getAttribute('type');
            input.setAttribute('type', type === 'password' ? 'text' : 'password');
            
            // Change l'icône
            if (type === 'password') {
                toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            } else {
                toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        });
    });

    // Gestion de la soumission des formulaires
    [connexionForm, inscriptionForm].forEach(form => {
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                clearFormErrors();
                
                const submitButton = form.querySelector('.btn-submit');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span class="loading-spinner"></span>Chargement...';
                submitButton.disabled = true;
                
                try {
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        showToast(data.message || 'Opération réussie !');
                        if (data.redirect) {
                            setTimeout(() => window.location.href = data.redirect, 1000);
                        }
                    } else {
                        if (data.errors) {
                            Object.entries(data.errors).forEach(([field, messages]) => {
                                const input = form.querySelector(`[name="${field}"]`);
                                if (input) {
                                    showFormError(input, messages[0]);
                                }
                            });
                        }
                        showToast(data.message || 'Une erreur est survenue', 'error');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    showToast('Une erreur est survenue lors de la communication avec le serveur', 'error');
                } finally {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            });
        }
    });

    // Animation au survol du conteneur
    if (loginContainer) {
        loginContainer.addEventListener('mousemove', (e) => {
            const rect = loginContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcul de la position relative pour l'effet de profondeur
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            // Application d'une légère rotation 3D
            loginContainer.style.transform = `perspective(1000px) rotateX(${(yPercent - 50) / 50}deg) rotateY(${(xPercent - 50) / 50}deg)`;
        });
        
        loginContainer.addEventListener('mouseleave', () => {
            // Réinitialiser la transformation
            loginContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }

    // Fonction pour animer les éléments du formulaire
    function animateLoginFormElements() {
        const activeForm = document.querySelector('.auth-form:not(.hidden)');
        if (activeForm) {
            const animateItems = activeForm.querySelectorAll('.animate-item');
            animateItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.opacity = '1';
            });
        }
    }

    // Fonction pour afficher les notifications
    function showToast(message, type = 'success') {
        // Supprimer les notifications existantes
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${type === 'success' ? '✓' : '✕'}
                </div>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        document.body.appendChild(toast);
        
        // Afficher la notification avec animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Fonction pour afficher les erreurs de formulaire
    function showFormError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.add('invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        
        // Animation de secousse
        input.style.animation = 'none';
        input.offsetHeight; // Force reflow
        input.style.animation = 'shake 0.5s ease-in-out';
    }

    // Fonction pour effacer les erreurs
    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.invalid').forEach(input => input.classList.remove('invalid'));
    }

    // Animation des éléments au chargement
    const elements = document.querySelectorAll('.form-group, .login-tab, .btn');
    elements.forEach((element, index) => {
        element.classList.add('animate-item');
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Gestion des onglets
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.getAttribute('data-target');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = content.id === target ? 'block' : 'none';
            });
        });
    });

    // Ajouter des styles CSS supplémentaires pour les animations et effets
    addDynamicStyles();
    
    function addDynamicStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text-primary);
                border-left: 4px solid var(--primary);
                border-radius: 4px;
                padding: 0;
                max-width: 350px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
                overflow: hidden;
            }
            
            .toast-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                padding: 12px 15px;
            }
            
            .toast-icon {
                width: 20px;
                height: 20px;
                color: var(--primary);
                margin-right: 10px;
                flex-shrink: 0;
            }
            
            .toast-progress {
                height: 3px;
                background: var(--primary);
                width: 100%;
                animation: toast-progress 5s linear forwards;
            }
            
            @keyframes toast-progress {
                0% { width: 100%; }
                100% { width: 0; }
            }
            
            .btn-submit.clicked {
                transform: scale(0.98);
            }
            
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 0.8s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .error-message {
                color: var(--error);
                font-size: 0.85rem;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            }
            
            .invalid {
                border-color: var(--error) !important;
                box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}); 