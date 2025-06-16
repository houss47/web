// Form validation and submission
 document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('atelierForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            message: 'Le prénom doit contenir au moins 2 caractères'
        },
        lastName: {
            required: true,
            minLength: 2,
            message: 'Le nom doit contenir au moins 2 caractères'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse email valide'
        },
        phone: {
            required: true,
            minLength: 10,
            message: 'Le numéro de téléphone doit contenir au moins 10 chiffres'
        },
        atelierName: {
            required: true,
            minLength: 3,
            message: 'Le nom de l\'atelier doit contenir au moins 3 caractères'
        },
        address: {
            required: true,
            minLength: 10,
            message: 'Veuillez entrer une adresse complète'
        },
        city: {
            required: true,
            message: 'Veuillez sélectionner une ville'
        },
        description: {
            required: true,
            minLength: 50,
            message: 'La description doit contenir au moins 50 caractères'
        },
        password: {
            required: true,
            minLength: 8,
            message: 'Le mot de passe doit contenir au moins 8 caractères'
        },
        confirmPassword: {
            required: true,
            custom: (value) => {
                const password = document.getElementById('password').value;
                return value === password;
            },
            message: 'Les mots de passe ne correspondent pas'
        },
        acceptTerms: {
            required: true,
            message: 'Vous devez accepter les conditions d\'utilisation'
        }
    };

    // Validate field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        if (!rules) return { isValid: true };

        // Required check
        if (rules.required && (!value || value.trim() === '')) {
            return { isValid: false, message: rules.message };
        }

        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            return { isValid: false, message: rules.message };
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            return { isValid: false, message: rules.message };
        }

        // Custom validation
        if (rules.custom && !rules.custom(value)) {
            return { isValid: false, message: rules.message };
        }

        return { isValid: true };
    }

    // Show error
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + '-error');
        
        field.classList.add('error');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    // Clear error
    function clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorDiv = document.getElementById(fieldName + '-error');
        
        field.classList.remove('error');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    // Validate specialties
    function validateSpecialties() {
        const checkboxes = document.querySelectorAll('input[name="specialties"]:checked');
        if (checkboxes.length === 0) {
            showError('specialties', 'Veuillez sélectionner au moins une spécialité');
            return false;
        } else {
            clearError('specialties');
            return true;
        }
    }

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                const validation = validateField(fieldName, this.value);
                if (!validation.isValid) {
                    showError(fieldName, validation.message);
                } else {
                    clearError(fieldName);
                }
            });

            field.addEventListener('input', function() {
                clearError(fieldName);
            });
        }
    });

    // Specialty checkboxes validation
    document.querySelectorAll('input[name="specialties"]').forEach(checkbox => {
        checkbox.addEventListener('change', validateSpecialties);
    });

    // Show toast notification
    function showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.className = 'toast show' + (isError ? ' error' : '');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        
        // Validate all fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const value = field.type === 'checkbox' ? field.checked : field.value;
                const validation = validateField(fieldName, value);
                
                if (!validation.isValid) {
                    showError(fieldName, validation.message);
                    isValid = false;
                } else {
                    clearError(fieldName);
                }
            }
        });

        // Validate specialties
        if (!validateSpecialties()) {
            isValid = false;
        }

        if (!isValid) {
            showToast('Veuillez corriger les erreurs dans le formulaire', true);
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="loading-spinner"></div>
            Création en cours...
        `;

        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                Créer mon atelier
            `;

            // Show success message
            showToast('Demande envoyée avec succès ! Votre atelier sera validé sous 48h. Vous recevrez un email de confirmation.');
            
            // Reset form
            form.reset();
            
            // Log form data (for demonstration)
            console.log('Form data submitted:', Object.fromEntries(formData));
            
        }, 2000);
    });

    // Add animation to form sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.form-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});