/**
 * Dashboard Client JavaScript - Couture Hub
 * Ajoute des fonctionnalités interactives au dashboard client avec animations africaines
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');
    
    if (navbarToggler && sidebar) {
        navbarToggler.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // Appliquer les classes d'animation africaines
    applyAfricanAnimations();
    
    // Add animation classes to elements when they come into view
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.dashboard-card');
        const favoriteCards = document.querySelectorAll('.favorite-card');
        const tableRows = document.querySelectorAll('tbody tr');
        const badges = document.querySelectorAll('.badge');
        
        // Animate dashboard cards
        cards.forEach((card, index) => {
            if (isElementInViewport(card) && !card.classList.contains('scale-up')) {
                setTimeout(() => {
                    card.classList.add('scale-up');
                }, index * 100);
            }
        });
        
        // Animate favorite cards
        favoriteCards.forEach((card, index) => {
            if (isElementInViewport(card) && !card.classList.contains('fade-in')) {
                setTimeout(() => {
                    card.classList.add('fade-in');
                    
                    // Ajouter l'effet de vague africaine au survol
                    card.addEventListener('mouseenter', createAfricanWaveEffect);
                }, index * 100);
            }
        });
        
        // Animate table rows
        tableRows.forEach((row, index) => {
            if (isElementInViewport(row) && !row.classList.contains('slide-in-left')) {
                setTimeout(() => {
                    row.classList.add('slide-in-left');
                }, index * 50);
            }
        });
        
        // Add status-badge class to badges if not already present
        badges.forEach(badge => {
            if (!badge.classList.contains('status-badge')) {
                badge.classList.add('status-badge');
            }
        });
    };
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to apply African animations to elements
    function applyAfricanAnimations() {
        // Add African wave effect to dashboard cards
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        dashboardCards.forEach(card => {
            card.addEventListener('mouseenter', createAfricanWaveEffect);
        });
        
        // Add pulse effect to status badges
        const statusBadges = document.querySelectorAll('.badge');
        statusBadges.forEach(badge => {
            badge.classList.add('status-badge');
        });
        
        // Add African patterns to card headers
        const cardHeaders = document.querySelectorAll('.card-header');
        cardHeaders.forEach(header => {
            header.style.position = 'relative';
            header.style.overflow = 'hidden';
        });
        
        // Add animation to measurement items
        const measurementItems = document.querySelectorAll('.measurement-item');
        measurementItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                this.style.backgroundColor = 'rgba(233, 69, 96, 0.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.backgroundColor = 'var(--light-color)';
            });
        });
    }
    
    // Create African wave effect
    function createAfricanWaveEffect(e) {
        const element = this;
        
        // Remove any existing wave effects
        const existingWaves = element.querySelectorAll('.african-wave-effect');
        existingWaves.forEach(wave => wave.remove());
        
        // Create new wave effect
        const wave = document.createElement('div');
        wave.classList.add('african-wave-effect');
        element.appendChild(wave);
        
        // Remove wave after animation completes
        setTimeout(() => {
            wave.remove();
        }, 1000);
    }
    
    // Create filter wave effect for buttons
    function createFilterWaveEffect(e) {
        const wave = document.createElement('div');
        wave.classList.add('african-filter-wave');
        document.body.appendChild(wave);
        
        const x = e.clientX;
        const y = e.clientY;
        
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        
        setTimeout(() => {
            wave.remove();
        }, 1000);
    }
    
    // Add filter wave effect to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createFilterWaveEffect);
    });
    
    // Run animation on page load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile sidebar if open
                    if (sidebar && sidebar.classList.contains('show')) {
                        sidebar.classList.remove('show');
                    }
                }
            }
        });
    });
    
    // Handle favorite button clicks with enhanced animation
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const heartIcon = this.querySelector('i');
            heartIcon.classList.toggle('text-danger');
            heartIcon.classList.toggle('far');
            heartIcon.classList.toggle('fas');
            
            // African heart animation
            const card = this.closest('.favorite-card');
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 300);
            
            // Add pulse effect to the heart
            heartIcon.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                heartIcon.style.animation = '';
            }, 500);
        });
    });
    
    // Theme toggle with African transition
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Create overlay for transition effect
            const overlay = document.createElement('div');
            overlay.classList.add('theme-transition-overlay');
            document.body.appendChild(overlay);
            
            // Animate the overlay
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
            
            // Toggle theme class after overlay animation
            setTimeout(() => {
                document.body.classList.toggle('dark-theme');
                overlay.style.opacity = '0';
                
                // Remove overlay after fade-out
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }, 500);
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Add animation to stats cards on page load
    const statCards = document.querySelectorAll('.dashboard-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
});

// CSS custom properties for dark theme
function applyTheme(isDark) {
    const root = document.documentElement;
    
    if (isDark) {
        root.style.setProperty('--primary-color', '#F39C53'); // Version plus claire de l'orange ambre
        root.style.setProperty('--secondary-color', '#C56B20'); // Version plus foncée
        root.style.setProperty('--light-color', '#2C2C2C'); // Fond sombre
        root.style.setProperty('--dark-color', '#F6F3ED'); // Le beige devient la couleur du texte
        root.style.setProperty('--accent-color', '#E17921'); // L'orange ambre devient l'accent
    } else {
        root.style.setProperty('--primary-color', '#E17921'); // Orange ambre
        root.style.setProperty('--secondary-color', '#9C4506'); // Orange ambre foncé
        root.style.setProperty('--light-color', '#F6F3ED'); // Beige clair
        root.style.setProperty('--dark-color', '#212529'); // Gris foncé
        root.style.setProperty('--accent-color', '#F39C53'); // Orange plus clair
    }
    
    // Mettre à jour les valeurs RGB également
    if (isDark) {
        root.style.setProperty('--primary-rgb', '243, 156, 83'); // F39C53
        root.style.setProperty('--secondary-rgb', '197, 107, 32'); // C56B20
        root.style.setProperty('--accent-rgb', '225, 121, 33'); // E17921
    } else {
        root.style.setProperty('--primary-rgb', '225, 121, 33'); // E17921
        root.style.setProperty('--secondary-rgb', '156, 69, 6'); // 9C4506
        root.style.setProperty('--accent-rgb', '246, 243, 237'); // F6F3ED
    }
}
