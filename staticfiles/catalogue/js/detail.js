
// Application state
const appState = {
    currentPage: 'product',
    currentStep: 1,
    formData: {
        // Product page
        material: '',
        color: '',
        specialNotes: '',
        
        // Step 1: Informations
        name: '',
        phone: '',
        email: '',
        address: '',
        
        // Step 2: Project
        projectType: 'custom',
        category: '',
        description: '',
        
        // Step 3: Measurements
        bust: '',
        waist: '',
        hips: '',
        shoulders: '',
        sleeves: '',
        height: '',
        notes: ''
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show product page initially
    showPage('product');
    
    // Bind event listeners
    bindEventListeners();
}

function bindEventListeners() {
    // Product page events
    const orderBtn = document.getElementById('order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            showPage('order');
            setStep(1);
        });
    }
    
    // Step navigation
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Form inputs - save data as user types
    bindFormInputs();
    
    // Project type radio buttons
    const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
    projectTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            appState.formData.projectType = e.target.value;
            updateProjectTypeCards();
        });
    });
    
    // Material and color radio buttons
    const materialInputs = document.querySelectorAll('input[name="material"]');
    const colorInputs = document.querySelectorAll('input[name="color"]');
    
    materialInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            appState.formData.material = e.target.value;
        });
    });
    
    colorInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            appState.formData.color = e.target.value;
        });
    });
}

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageName;
    }
}

function setStep(stepNumber) {
    appState.currentStep = stepNumber;
    
    // Update step indicator
    updateStepIndicator();
    
    // Show current step content
    showStepContent(stepNumber);
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        const circle = step.querySelector('.step-circle');
        
        // Remove all classes
        step.classList.remove('active', 'completed');
        
        if (stepNum === appState.currentStep) {
            step.classList.add('active');
            circle.textContent = stepNum;
        } else if (stepNum < appState.currentStep) {
            step.classList.add('completed');
            circle.textContent = '✓';
        } else {
            circle.textContent = stepNum;
        }
    });
    
    // Update step lines
    const lines = document.querySelectorAll('.step-line');
    lines.forEach((line, index) => {
        if (index + 1 < appState.currentStep) {
            line.style.background = '#7c3aed';
        } else {
            line.style.background = '#d1d5db';
        }
    });
}

function showStepContent(stepNumber) {
    // Hide all step contents
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => content.classList.remove('active'));
    
    // Show current step content
    const currentContent = document.getElementById(`step-${stepNumber}`);
    if (currentContent) {
        currentContent.classList.add('active');
    }
    
    // If showing validation step, populate summary
    if (stepNumber === 4) {
        populateValidationSummary();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.style.display = appState.currentStep === 1 ? 'none' : 'block';
    }
    
    if (nextBtn) {
        nextBtn.style.display = appState.currentStep === 4 ? 'none' : 'block';
    }
}

function handlePrevious() {
    if (appState.currentStep > 1) {
        setStep(appState.currentStep - 1);
    } else {
        showPage('product');
    }
}

function handleNext() {
    if (validateCurrentStep()) {
        if (appState.currentStep < 4) {
            setStep(appState.currentStep + 1);
        }
    }
}

function validateCurrentStep() {
    // Basic validation for required fields
    switch (appState.currentStep) {
        case 1:
            const requiredFields = ['name', 'phone', 'email', 'address'];
            return requiredFields.every(field => {
                const value = appState.formData[field];
                return value && value.trim() !== '';
            });
        
        case 2:
            return appState.formData.category && appState.formData.description;
        
        case 3:
            const measurementFields = ['bust', 'waist', 'hips', 'shoulders', 'sleeves', 'height'];
            return measurementFields.every(field => {
                const value = appState.formData[field];
                return value && value.trim() !== '';
            });
        
        default:
            return true;
    }
}

function bindFormInputs() {
    // Get all form inputs and bind them to update appState
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const fieldName = input.id;
        if (fieldName && appState.formData.hasOwnProperty(fieldName)) {
            input.addEventListener('input', (e) => {
                appState.formData[fieldName] = e.target.value;
            });
        }
    });
}

function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`tab-${tabName}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

function updateProjectTypeCards() {
    const cards = document.querySelectorAll('.project-type-card');
    cards.forEach(card => {
        const input = card.querySelector('input[type="radio"]');
        if (input.value === appState.formData.projectType) {
            card.style.borderColor = '#7c3aed';
            card.style.background = '#f3f4f6';
        } else {
            card.style.borderColor = '#e5e7eb';
            card.style.background = 'white';
        }
    });
}

function populateValidationSummary() {
    // Personal information
    document.getElementById('val-name').textContent = appState.formData.name || '-';
    document.getElementById('val-email').textContent = appState.formData.email || '-';
    document.getElementById('val-phone').textContent = appState.formData.phone || '-';
    document.getElementById('val-address').textContent = appState.formData.address || '-';
    
    // Project details
    const projectTypeMap = {
        'custom': 'Création sur-mesure',
        'alteration': 'Retouche',
        'reproduction': 'Reproduction'
    };
    document.getElementById('val-project-type').textContent = projectTypeMap[appState.formData.projectType] || '-';
    document.getElementById('val-category').textContent = appState.formData.category || '-';
    document.getElementById('val-description').textContent = appState.formData.description || '-';
    
    // Measurements
    document.getElementById('val-bust').textContent = appState.formData.bust || '-';
    document.getElementById('val-waist').textContent = appState.formData.waist || '-';
    document.getElementById('val-hips').textContent = appState.formData.hips || '-';
    document.getElementById('val-shoulders').textContent = appState.formData.shoulders || '-';
    document.getElementById('val-sleeves').textContent = appState.formData.sleeves || '-';
    document.getElementById('val-height').textContent = appState.formData.height || '-';
}

// Additional utility functions
function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
        color: 'white',
        borderRadius: '0.5rem',
        zIndex: '1000',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle form submission
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Confirmer la commande') {
        e.preventDefault();
        
        // Simulate order submission
        showNotification('Commande confirmée ! Vous recevrez un email de confirmation.', 'success');
        
        // Reset and go back to product page after a delay
        setTimeout(() => {
            showPage('product');
            // Reset form data
            Object.keys(appState.formData).forEach(key => {
                appState.formData[key] = key === 'projectType' ? 'custom' : '';
            });
        }, 2000);
    }
});
