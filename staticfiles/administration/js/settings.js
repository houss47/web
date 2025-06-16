
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements for Tabs
  const settingsTabs = document.querySelectorAll('.settings-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // DOM Elements for Forms
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');
  const companyForm = document.getElementById('companyForm');
  const notificationsForm = document.getElementById('notificationsForm');
  const appearanceForm = document.getElementById('appearanceForm');
  const systemForm = document.getElementById('systemForm');
  
  // DOM Elements for Delete Account
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const deleteAccountModal = document.getElementById('deleteAccountModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const closeBtn = document.querySelector('.close-btn');
  
  // Theme Options
  const themeOptions = document.querySelectorAll('.theme-option');
  
  // Button Options (density and font size)
  const buttonOptions = document.querySelectorAll('.btn-option');
  
  // Tab Navigation
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and panes
      settingsTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding pane
      const tabId = this.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Profile Form Submission
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      
      if (!fullName) {
        showError(document.getElementById('fullName'), 'Le nom est requis');
        return;
      }
      
      if (!email || !isValidEmail(email)) {
        showError(document.getElementById('email'), 'Email invalide');
        return;
      }
      
      // If validation passes, save profile
      showToast('Profil mis à jour', 'Vos informations de profil ont été mises à jour avec succès.');
    });
  }
  
  // Password Form Submission
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!currentPassword) {
        alert('Le mot de passe actuel est requis');
        return;
      }
      
      if (!newPassword) {
        alert('Le nouveau mot de passe est requis');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      
      // If validation passes, update password
      this.reset();
      showToast('Mot de passe mis à jour', 'Votre mot de passe a été changé avec succès.');
    });
  }
  
  // Company Form Submission
  if (companyForm) {
    companyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const companyName = document.getElementById('companyName').value;
      const companyAddress = document.getElementById('companyAddress').value;
      const companyPhone = document.getElementById('companyPhone').value;
      
      if (!companyName) {
        showError(document.getElementById('companyName'), 'Le nom de l\'entreprise est requis');
        return;
      }
      
      if (!companyAddress) {
        showError(document.getElementById('companyAddress'), 'L\'adresse est requise');
        return;
      }
      
      if (!companyPhone) {
        showError(document.getElementById('companyPhone'), 'Le téléphone est requis');
        return;
      }
      
      // If validation passes, save company info
      showToast('Informations entreprise mises à jour', 'Les informations de votre entreprise ont été mises à jour avec succès.');
    });
  }
  
  // Notifications Form Submission
  if (notificationsForm) {
    notificationsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real app, you would save notification preferences
      showToast('Préférences de notification enregistrées', 'Vos préférences de notification ont été mises à jour.');
    });
  }
  
  // Appearance Form Submission
  if (appearanceForm) {
    appearanceForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real app, you would save appearance settings
      showToast('Apparence mise à jour', 'Les paramètres d\'apparence ont été appliqués.');
    });
  }
  
  // System Form Submission
  if (systemForm) {
    systemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real app, you would save system settings
      showToast('Paramètres système enregistrés', 'Les paramètres système ont été mis à jour.');
    });
  }
  
  // Delete Account Modal
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', function() {
      deleteAccountModal.classList.add('active');
    });
  }
  
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', function() {
      deleteAccountModal.classList.remove('active');
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      deleteAccountModal.classList.remove('active');
    });
  }
  
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
      // In a real app, this would delete the account
      showToast('Compte supprimé', 'Votre compte a été supprimé. Vous allez être redirigé vers la page d\'accueil.', 'error');
      deleteAccountModal.classList.remove('active');
      
      // Simulate redirect after 3 seconds
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 3000);
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === deleteAccountModal) {
      deleteAccountModal.classList.remove('active');
    }
  });
  
  // Theme Options Selection
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all options
      themeOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selected class to clicked option
      this.classList.add('selected');
      
      // In a real app, you would apply the theme
      const themeName = this.querySelector('span').textContent.toLowerCase();
      console.log('Selected theme:', themeName);
    });
  });
  
  // Button Options Selection (density and font size)
  buttonOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Get parent group
      const parent = this.parentElement;
      
      // Remove selected class from all options in this group
      parent.querySelectorAll('.btn-option').forEach(opt => opt.classList.remove('selected'));
      
      // Add selected class to clicked option
      this.classList.add('selected');
      
      // In a real app, you would apply the setting
      console.log('Selected option:', this.textContent.trim());
    });
  });
  
  // Helper Functions
  function showError(input, message) {
    // Find the error message element
    const errorElement = input.parentElement.querySelector('.error-message');
    
    // Show error message
    if (errorElement) {
      errorElement.textContent = message;
    } else {
      alert(message);
    }
    
    // Highlight input
    input.classList.add('error');
    
    // Remove error after 3 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.textContent = '';
      }
      input.classList.remove('error');
    }, 3000);
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showToast(title, message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Create toast icon
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation"></i>';
    
    // Create toast content
    const content = document.createElement('div');
    content.className = 'toast-content';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'toast-title';
    titleEl.textContent = title;
    
    const messageEl = document.createElement('p');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;
    
    content.appendChild(titleEl);
    content.appendChild(messageEl);
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Assemble toast
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }
});
