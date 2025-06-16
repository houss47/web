
// Script pour le menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            // Créer un menu mobile si il n'existe pas déjà
            let mobileMenu = document.querySelector('.mobile-menu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Cloner les liens de navigation
                const navLinks = navMenu.cloneNode(true);
                navLinks.className = 'mobile-nav-menu';
                mobileMenu.appendChild(navLinks);
                
                // Cloner les boutons
                const buttons = navButtons.cloneNode(true);
                buttons.className = 'mobile-nav-buttons';
                mobileMenu.appendChild(buttons);
                
                // Ajouter au body
                document.body.appendChild(mobileMenu);
                
                // Ajouter une animation d'entrée
                setTimeout(() => {
                    mobileMenu.classList.add('active');
                }, 10);
            } else {
                // Toggle le menu mobile
                mobileMenu.classList.toggle('active');
            }
            
            // Toggle la classe active sur le bouton
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile quand on clique en dehors
    document.addEventListener('click', function(event) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            // Vérifier si le clic est en dehors du menu et du bouton toggle
            if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Ajouter une classe au header lors du scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
