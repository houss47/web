// Script spécifique pour la page Mon Profil

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    // Gestion du formulaire de profil
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewProfileForm = document.getElementById('viewProfileForm');
    const editProfileForm = document.getElementById('editProfileForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    if (editProfileBtn && viewProfileForm && editProfileForm && cancelEditBtn) {
        editProfileBtn.addEventListener('click', function() {
            viewProfileForm.classList.add('d-none');
            editProfileForm.classList.remove('d-none');
            editProfileForm.classList.add('animated-form');
        });

        cancelEditBtn.addEventListener('click', function() {
            editProfileForm.classList.add('d-none');
            viewProfileForm.classList.remove('d-none');
            viewProfileForm.classList.add('animated-form');
            
            setTimeout(() => {
                viewProfileForm.classList.remove('animated-form');
            }, 500);
        });
    }

    // Ouvrir modal de changement de mot de passe
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    
    if (changePasswordBtn && changePasswordModal) {
        changePasswordBtn.addEventListener('click', function() {
            const passwordModal = new bootstrap.Modal(changePasswordModal);
            passwordModal.show();
        });
    }

    // Ouvrir modal de changement d'avatar
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const changeAvatarModal = document.getElementById('changeAvatarModal');
    
    if (changeAvatarBtn && changeAvatarModal) {
        changeAvatarBtn.addEventListener('click', function() {
            const avatarModal = new bootstrap.Modal(changeAvatarModal);
            avatarModal.show();
        });
    }
    
    // Prévisualisation de l'avatar
    const avatarUpload = document.getElementById('avatarUpload');
    
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Mettre à jour les images d'avatar
                    const avatarImages = document.querySelectorAll('.modal-body img.img-fluid');
                    avatarImages.forEach(img => {
                        img.src = e.target.result;
                    });
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gestion du thème sombre
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (themeSwitch) {
        // Vérifier si un thème est déjà stocké
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Appliquer le thème actuel
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
        }
        
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Vérification de la force du mot de passe
    const newPasswordInput = document.querySelector('#changePasswordModal input[type="password"]:nth-of-type(2)');
    const passwordStrengthBar = document.querySelector('#changePasswordModal .progress-bar');
    
    if (newPasswordInput && passwordStrengthBar) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Longueur
            if (password.length >= 8) {
                strength += 25;
            }
            
            // Majuscule
            if (/[A-Z]/.test(password)) {
                strength += 25;
            }
            
            // Chiffre
            if (/[0-9]/.test(password)) {
                strength += 25;
            }
            
            // Caractère spécial
            if (/[^A-Za-z0-9]/.test(password)) {
                strength += 25;
            }
            
            // Mise à jour de la barre de progression
            passwordStrengthBar.style.width = strength + '%';
            
            // Changer la couleur en fonction de la force
            if (strength < 50) {
                passwordStrengthBar.className = 'progress-bar bg-danger';
            } else if (strength < 75) {
                passwordStrengthBar.className = 'progress-bar bg-warning';
            } else {
                passwordStrengthBar.className = 'progress-bar bg-success';
            }
        });
    }
    
    // Animation pour les badges de préférences
    const styleBadges = document.querySelectorAll('.badge.rounded-pill');
    
    styleBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = 'rgba(225, 121, 33, 0.2) !important';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.backgroundColor = '';
        });
    });
    
    // Ajout de styles dynamiques
    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
        .animated-form {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .dark-mode {
            background-color: #333;
            color: #f5f5f5;
        }
        
        .dark-mode .card {
            background-color: #444;
        }
        
        .dark-mode .card-header {
            background-color: #555;
        }
        
        .dark-mode .form-control, 
        .dark-mode .form-select {
            background-color: #555;
            color: #f5f5f5;
            border-color: #666;
        }
        
        .dark-mode .form-control-plaintext {
            color: #f5f5f5;
        }
        
        .dark-mode .text-muted {
            color: #bbb !important;
        }
        
        .dark-mode .table {
            color: #f5f5f5;
        }
        
        .dark-mode .table-hover tbody tr:hover {
            background-color: rgba(225, 121, 33, 0.1);
        }
        
        .dark-mode .badge.bg-light {
            background-color: #555 !important;
            color: #f5f5f5 !important;
        }
    `;
    document.head.appendChild(dynamicStyle);
});
