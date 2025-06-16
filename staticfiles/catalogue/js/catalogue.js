// Fonctions pour la gestion du catalogue de produits

document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments DOM
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const productGrid = document.getElementById('productGrid');
    const noResultsSection = document.getElementById('noResultsSection');
    const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
    const moreFiltersButton = document.getElementById('moreFiltersButton');
    const moreFiltersMenu = document.getElementById('moreFiltersMenu');
    const overlay = document.getElementById('overlay');
    
    // Stockage des cartes de produits visibles
    let visibleCards = [...productCards];

    // Fonction de mise à jour de l'affichage des produits
    function updateProductDisplay() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        // Filtrer les produits selon les critères
        visibleCards = productCards.filter(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.dataset.category;
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        // Tri des produits (exemple: par produits en vedette)
       

        // Affichage des produits filtrés
        productGrid.innerHTML = "";
        visibleCards.forEach(card => productGrid.appendChild(card));
        
        // Afficher la section "pas de résultats" si nécessaire
        noResultsSection.style.display = visibleCards.length === 0 ? "block" : "none";
    }

    // Écouteurs d'événements pour les filtres
    searchInput.addEventListener('input', updateProductDisplay);
    categoryFilter.addEventListener('change', updateProductDisplay);
    sortBy.addEventListener('change', updateProductDisplay);

    // Navigation horizontale des catégories
    const categoryLinks = document.querySelectorAll('.product-listing nav ul li a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.dataset.category;
            categoryFilter.value = category;
            updateProductDisplay();
        });
    });

    // Gestion du menu "Plus de filtres"
    moreFiltersButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Empêcher la propagation aux éléments parents
        moreFiltersMenu.style.display = 'block';
        overlay.style.display = 'block';
    });
    
    // Fermer le menu au clic sur l'overlay
    overlay.addEventListener('click', function() {
        moreFiltersMenu.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(event) {
        const isClickInside = moreFiltersButton.contains(event.target) || 
                              moreFiltersMenu.contains(event.target);

        if (!isClickInside) {
            moreFiltersMenu.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    // Initialisation de l'affichage
    updateProductDisplay();
}); 