/**
 * Gestion des ateliers et de la recherche centralisée
 * Améliorations: animations, tri, compteur de résultats, bouton retour en haut, lazy loading, favoris
 * @version 2.0.0
 * @author Cascade
 */

// IIFE pour éviter la pollution du scope global
(function() {
    'use strict';
    
    // Chargement différé pour optimiser les performances
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux éléments
    const filterButtons = document.querySelectorAll('.filter-btn');
    const atelierCards = document.querySelectorAll('.atelier-card');
    const resultsCounter = document.querySelector('.results-counter');
    const sortSelect = document.getElementById('sort-select');
    
    // Fonction pour animer l'apparition des cartes avec IntersectionObserver pour de meilleures performances
    function animateCards() {
        const visibleCards = document.querySelectorAll('.atelier-card[style="display: block"]');
        
        // Utilisation d'IntersectionObserver pour animer seulement les cartes visibles
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        // Animation avec requestAnimationFrame pour de meilleures performances
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                        observer.unobserve(card); // Arrêter d'observer une fois animé
                    }
                });
            }, { threshold: 0.1 });
            
            visibleCards.forEach((card, index) => {
                // Reset des animations
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // Délai progressif pour effet cascade
                setTimeout(() => {
                    observer.observe(card);
                }, index * 50); // Réduit le délai pour améliorer les performances
            });
        } else {
            // Fallback pour les navigateurs ne prenant pas en charge IntersectionObserver
            visibleCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }
    
    // Fonction pour mettre à jour le compteur de résultats avec plus d'informations
    function updateResultsCounter() {
        const visibleCards = document.querySelectorAll('.atelier-card[style="display: block"]');
        const totalCards = document.querySelectorAll('.atelier-card').length;
        
        if (resultsCounter) {
            // Format du texte amélioré
            if (visibleCards.length === totalCards) {
                resultsCounter.textContent = `Tous les ateliers (${totalCards}) sont affichés`;
            } else {
                resultsCounter.textContent = `${visibleCards.length} atelier${visibleCards.length > 1 ? 's' : ''} sur ${totalCards} affiché${visibleCards.length > 1 ? 's' : ''}`;
            }
            
            // Ajouter une classe pour l'animation
            resultsCounter.classList.add('updated');
            setTimeout(() => resultsCounter.classList.remove('updated'), 600);
        }
    }
    
    // Filtrage des ateliers avec amélioration des performances
    filterButtons.forEach(button => {
        // Ajouter un compteur à chaque bouton
        const category = button.getAttribute('data-filter');
        
        // Calculer le nombre d'ateliers pour cette catégorie une seule fois
        const count = category === 'all' ? atelierCards.length : 
                     document.querySelectorAll(`.atelier-card[data-category="${category}"]`).length;
        
        // Stocker cette information dans un attribut data pour y accéder sans recalculer
        button.setAttribute('data-count', count);
        
        // Ajouter un badge avec le nombre
        const countBadge = document.createElement('span');
        countBadge.classList.add('filter-count');
        countBadge.textContent = count;
        button.appendChild(countBadge);
        
        // Ajouter également une tooltip descriptive
        button.setAttribute('title', `Voir les ${count} atelier(s) de type ${category === 'all' ? 'tous styles' : category}`);
        
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Extraire la valeur du filtre
            const filter = this.getAttribute('data-filter');
            
            // Mettre à jour l'URL avec le paramètre de filtre pour le partage
            const url = new URL(window.location.href);
            url.searchParams.set('filter', filter);
            window.history.replaceState({filter}, "", url);
            
            // Utilisation de requestAnimationFrame pour optimiser les performances
            requestAnimationFrame(() => {
                // Afficher/masquer les ateliers selon le filtre
                atelierCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Mettre à jour le compteur et animer les cartes
                updateResultsCounter();
                animateCards();
                
                // Afficher un message d'information
                const filterName = filter === 'all' ? 'tous les styles' : filter;
                showNotification(`Filtrage par ${filterName}`, 'info');
            });
        });
    });
    
    // Gestion du slider de prix avec valeur dynamique
    const priceRange = document.getElementById('filterPriceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange && minPrice && maxPrice) {
        // Initialiser la valeur au chargement
        maxPrice.textContent = priceRange.value + '€';
        
        priceRange.addEventListener('input', function() {
            maxPrice.textContent = this.value + '€';
        });
    }
    
    // Fonction de tri des ateliers
    function sortAteliers(sortBy) {
        const ateliersGrid = document.querySelector('.ateliers-grid');
        if (!ateliersGrid) return;
        
        const ateliers = Array.from(atelierCards);
        
        ateliers.sort((a, b) => {
            if (sortBy === 'name-asc') {
                return a.querySelector('.atelier-name').textContent.localeCompare(
                    b.querySelector('.atelier-name').textContent
                );
            } else if (sortBy === 'name-desc') {
                return b.querySelector('.atelier-name').textContent.localeCompare(
                    a.querySelector('.atelier-name').textContent
                );
            } else if (sortBy === 'rating') {
                const ratingA = parseFloat(a.querySelector('.atelier-rating').getAttribute('data-rating') || '0');
                const ratingB = parseFloat(b.querySelector('.atelier-rating').getAttribute('data-rating') || '0');
                return ratingB - ratingA;
            } else if (sortBy === 'products') {
                const productsA = parseInt(a.querySelector('.atelier-products').getAttribute('data-count') || '0');
                const productsB = parseInt(b.querySelector('.atelier-products').getAttribute('data-count') || '0');
                return productsB - productsA;
            }
            return 0;
        });
        
        // Réorganiser les éléments triés dans la grille
        ateliers.forEach(card => {
            ateliersGrid.appendChild(card);
        });
        
        // Animer les cartes après le tri
        animateCards();
    }
    
    // Gestion du tri avec mise à jour de l'URL
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            
            // Mettre à jour l'URL avec le paramètre de tri pour le partage et l'historique
            const url = new URL(window.location.href);
            url.searchParams.set('sort', sortBy);
            window.history.replaceState({sort: sortBy}, "", url);
            
            sortAteliers(sortBy);
            
            // Afficher un message de confirmation
            const sortOptions = {
                'rating': 'popularité',
                'name-asc': 'nom (A-Z)',
                'name-desc': 'nom (Z-A)',
                'products': 'nombre de produits'
            };
            
            showNotification(`Tri par ${sortOptions[sortBy]}`, 'info');
        });
    }
    
    // Charger les paramètres d'URL au chargement initial
    loadURLParameters();
    
    /**
     * Charge les paramètres depuis l'URL pour restaurer l'état
     */
    function loadURLParameters() {
        const url = new URL(window.location.href);
        
        // Restaurer le filtre
        const filter = url.searchParams.get('filter');
        if (filter) {
            const filterButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }
        
        // Restaurer le tri
        const sort = url.searchParams.get('sort');
        if (sort && sortSelect) {
            sortSelect.value = sort;
            sortAteliers(sort);
        }
        
        // Restaurer la recherche
        const search = url.searchParams.get('q');
        if (search) {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = search;
                // Déclencher la recherche
                const event = new Event('keyup');
                searchInput.dispatchEvent(event);
            }
        }
    }
    
    // Recherche atelier - barre de recherche principale
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        // Ajouter une fonction de debounce pour éviter trop de recherches lors de la frappe
        let debounceTimeout;
        
        searchInput.addEventListener('keyup', function(e) {
            clearTimeout(debounceTimeout);
            
            debounceTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                if (searchTerm.length > 2) {
                    atelierCards.forEach(card => {
                        const atelierName = card.querySelector('.atelier-name').textContent.toLowerCase();
                        const atelierDesc = card.querySelector('.atelier-description').textContent.toLowerCase();
                        const atelierTags = card.querySelectorAll('.badge');
                        let matchesTags = false;
                        
                        // Recherche dans les tags également
                        atelierTags.forEach(tag => {
                            if (tag.textContent.toLowerCase().includes(searchTerm)) {
                                matchesTags = true;
                            }
                        });
                        
                        if (atelierName.includes(searchTerm) || atelierDesc.includes(searchTerm) || matchesTags) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Mettre à jour le compteur et animer les cartes
                    updateResultsCounter();
                    animateCards();
                    
                } else if (searchTerm.length === 0) {
                    // Réinitialiser l'affichage si la recherche est vide
                    atelierCards.forEach(card => {
                        card.style.display = 'block';
                    });
                    
                    // Réappliquer le filtre actif si nécessaire
                    const activeFilter = document.querySelector('.filter-btn.active');
                    if (activeFilter && activeFilter.getAttribute('data-filter') !== 'all') {
                        const filter = activeFilter.getAttribute('data-filter');
                        atelierCards.forEach(card => {
                            if (card.getAttribute('data-category') !== filter) {
                                card.style.display = 'none';
                            }
                        });
                    }
                    
                    // Mettre à jour le compteur et animer les cartes
                    updateResultsCounter();
                    animateCards();
                }  
            }, 300); // 300ms de délai pour le debounce
            
        });
    }
    
    // Recherche globale
    const globalSearchForm = document.querySelector('.search-form');
    const globalSearchInput = document.querySelector('.global-search-input');
    
    if (globalSearchForm && globalSearchInput) {
        globalSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = globalSearchInput.value.trim();
            
            if (searchTerm.length > 0) {
                // Rediriger vers la page de catalogue avec le terme de recherche
                window.location.href = `catalogue.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
        
        document.querySelector('.search-button').addEventListener('click', function() {
            globalSearchForm.dispatchEvent(new Event('submit'));
        });
    }
    
    // Pour la recherche d'ateliers avec bouton
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn && searchInput) {
        // Ajouter une classe spéciale à la barre de recherche pour les effets CSS
        const searchBar = searchInput.closest('.search-bar');
        if (searchBar) {
            // Ajouter des écouteurs d'événements pour les effets visuels
            searchInput.addEventListener('focus', function() {
                searchBar.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', function() {
                searchBar.classList.remove('focused');
            });
            
            // Effet visuel lorsque la barre de recherche a du contenu
            searchInput.addEventListener('input', function() {
                if (this.value.length > 0) {
                    searchBar.classList.add('has-content');
                } else {
                    searchBar.classList.remove('has-content');
                }
            });
        }
        
        // Gérer le clic sur le bouton de recherche
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length > 0) {
                // Animer le bouton lors du clic
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 300);
                
                // Mettre à jour l'URL pour la recherche
                const url = new URL(window.location.href);
                url.searchParams.set('q', searchTerm);
                window.history.replaceState({search: searchTerm}, "", url);

                // Créer un tableau pour stocker les correspondances pour l'animation
                let matchedCards = [];
                let unmatchedCards = [];
                
                atelierCards.forEach(card => {
                    const atelierName = card.querySelector('.atelier-name').textContent.toLowerCase();
                    const atelierDesc = card.querySelector('.atelier-description').textContent.toLowerCase();
                    const atelierTags = card.querySelectorAll('.badge');
                    const specialtyTags = card.querySelectorAll('.specialty-tag');
                    let matchesTags = false;
                    let matchesSpecialties = false;
                    
                    // Recherche dans les badges
                    atelierTags.forEach(tag => {
                        if (tag.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                            matchesTags = true;
                        }
                    });
                    
                    // Recherche dans les spécialités
                    if (specialtyTags) {
                        specialtyTags.forEach(tag => {
                            if (tag.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                                matchesSpecialties = true;
                            }
                        });
                    }
                    
                    // Vérifier toutes les sources possibles
                    if (atelierName.includes(searchTerm.toLowerCase()) || 
                        atelierDesc.includes(searchTerm.toLowerCase()) || 
                        matchesTags ||
                        matchesSpecialties) {
                        card.style.display = 'block';
                        
                        // Surligner les termes de recherche
                        highlightSearchTerm(card, searchTerm);
                        
                        matchedCards.push(card);
                    } else {
                        unmatchedCards.push(card);
                        card.style.display = 'none';
                    }
                });
                
                // Animation séquentielle pour les cartes correspondantes
                matchedCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('search-matched');
                    }, index * 80); // Animation séquentielle
                });
                
                // Mettre à jour le compteur et animer les cartes
                updateResultsCounter();
                animateCards();
                
                // Afficher une notification
                const resultText = matchedCards.length === 1 ? 'résultat trouvé' : 'résultats trouvés';
                showNotification(`${matchedCards.length} ${resultText} pour "${searchTerm}"`, 'success');
            } else {
                // Animer la barre de recherche si vide
                if (searchBar) {
                    searchBar.classList.add('empty-shake');
                    setTimeout(() => searchBar.classList.remove('empty-shake'), 600);
                    searchInput.focus();
                }
                
                showNotification('Veuillez entrer un terme à rechercher', 'info');
            }
        });
        
        // Permettre la recherche avec la touche Entrée
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Fonction pour surligner les termes de recherche
    function highlightSearchTerm(card, term) {
        if (!term || term.length < 2) return;
        
        const elements = card.querySelectorAll('.atelier-name, .atelier-description, .specialty-tag, .detail-item span');
        const regex = new RegExp(`(${term})`, 'gi');
        
        elements.forEach(el => {
            // Sauvegarder le texte original pour pouvoir le restaurer plus tard
            if (!el.dataset.originalText) {
                el.dataset.originalText = el.textContent;
            }
            
            // Surligner le terme recherché
            const highlighted = el.dataset.originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
            if (highlighted !== el.dataset.originalText) {
                el.innerHTML = highlighted;
            }
        });
    }
    
    // Réinitialiser la surbrillance lors du changement de filtre
    function resetHighlighting() {
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            if (parent.dataset.originalText) {
                parent.textContent = parent.dataset.originalText;
            }
        });
    }
    
    // Implémentation du système de favoris
    initFavorites();
    
    // Lazy loading pour les images
    initLazyLoading();
    
    // Implémentation du bouton retour en haut
    initBackToTop();
    
    /**
     * Initialise le système de favoris pour les ateliers
     */
    function initFavorites() {
        // Ajout des boutons de favoris
        const atelierCards = document.querySelectorAll('.atelier-card');
        atelierCards.forEach(card => {
            const atelierName = card.querySelector('.atelier-name').textContent;
            const atelierMeta = card.querySelector('.atelier-meta');
            
            // Créer le bouton favoris
            const favBtn = document.createElement('button');
            favBtn.classList.add('fav-button');
            favBtn.setAttribute('aria-label', 'Ajouter aux favoris');
            
            // Vérifier si déjà en favoris
            const favorites = JSON.parse(localStorage.getItem('atelierFavorites') || '[]');
            const isFavorite = favorites.includes(atelierName);
            
            favBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" 
                     stroke="currentColor" stroke-width="2" width="18" height="18">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            `;
            
            // Gérer le clic sur le bouton favoris
            favBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const favorites = JSON.parse(localStorage.getItem('atelierFavorites') || '[]');
                const index = favorites.indexOf(atelierName);
                
                if (index === -1) {
                    // Ajouter aux favoris
                    favorites.push(atelierName);
                    this.querySelector('svg').setAttribute('fill', 'currentColor');
                    showNotification(`${atelierName} ajouté aux favoris`, 'success');
                } else {
                    // Retirer des favoris
                    favorites.splice(index, 1);
                    this.querySelector('svg').setAttribute('fill', 'none');
                    showNotification(`${atelierName} retiré des favoris`, 'info');
                }
                
                localStorage.setItem('atelierFavorites', JSON.stringify(favorites));
            });
            
            // Ajouter le bouton à la carte
            atelierMeta.appendChild(favBtn);
        });
        
        // Ajouter un filtre pour les favoris
        const filterButtons = document.querySelector('.filter-buttons');
        if (filterButtons) {
            const favorites = JSON.parse(localStorage.getItem('atelierFavorites') || '[]');
            if (favorites.length > 0) {
                const favBtn = document.createElement('button');
                favBtn.classList.add('filter-btn');
                favBtn.setAttribute('data-filter', 'favorites');
                favBtn.innerHTML = `Favoris <span class="filter-count">${favorites.length}</span>`;
                
                favBtn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const favorites = JSON.parse(localStorage.getItem('atelierFavorites') || '[]');
                    
                    document.querySelectorAll('.atelier-card').forEach(card => {
                        const atelierName = card.querySelector('.atelier-name').textContent;
                        if (favorites.includes(atelierName)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    updateResultsCounter();
                    animateCards();
                });
                
                filterButtons.appendChild(favBtn);
            }
        }
    }
    
    /**
     * Initialise le lazy loading des images pour de meilleures performances
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            // Convertir les images existantes en lazy loading
            document.querySelectorAll('.atelier-img img').forEach(img => {
                const currentSrc = img.getAttribute('src');
                img.setAttribute('data-src', currentSrc);
                img.setAttribute('src', 'image/placeholder.jpg'); // Une image de placeholder de faible poids
                imgObserver.observe(img);
            });
        }
    }
    
    /**
     * Initialise le bouton retour en haut avec comportement amélioré
     */
    function initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (backToTopButton) {
            // Montrer/cacher le bouton en fonction du défilement
            window.addEventListener('scroll', function() {
                if (window.scrollY > 500) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });
            
            // Défilement fluide avec animation améliorée
            backToTopButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Utiliser scrollTo avec comportement fluide si supporté
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback pour les navigateurs ne supportant pas scrollBehavior
                    const scrollStep = -window.scrollY / 20;
                    const scrollInterval = setInterval(function() {
                        if (window.scrollY !== 0) {
                            window.scrollBy(0, scrollStep);
                        } else {
                            clearInterval(scrollInterval);
                        }
                    }, 15);
                }
            });
        }
    }
    
    /**
     * Affiche une notification temporaire à l'utilisateur
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, info)
     */
    function showNotification(message, type = 'info') {
        // Créer l'élément de notification s'il n'existe pas
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);
        }
        
        // Configurer la notification
        notification.textContent = message;
        notification.className = 'notification'; // Reset des classes
        notification.classList.add(type);
        notification.classList.add('show');
        
        // Masquer après un délai
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Fonction pour filtrer les ateliers
    function filterAteliers() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const sortValue = sortSelect.value;

        atelierCards.forEach(card => {
            const atelierName = card.querySelector('.atelier-name').textContent.toLowerCase();
            const atelierCategory = card.dataset.category;
            const atelierDescription = card.querySelector('.atelier-description').textContent.toLowerCase();

            // Filtrage par recherche et catégorie
            const matchesSearch = atelierName.includes(searchTerm) || atelierDescription.includes(searchTerm);
            const matchesCategory = activeFilter === 'all' || atelierCategory === activeFilter;

            if (matchesSearch && matchesCategory) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
            } else {
                card.classList.add('filtered-out');
                card.classList.remove('filtered-in');
            }
        });

        // Tri des ateliers
        const atelierGrid = document.querySelector('.atelier-grid');
        const sortedCards = Array.from(atelierCards).sort((a, b) => {
            const nameA = a.querySelector('.atelier-name').textContent;
            const nameB = b.querySelector('.atelier-name').textContent;
            const ratingA = parseFloat(a.dataset.rating) || 0;
            const ratingB = parseFloat(b.dataset.rating) || 0;
            const productsA = parseInt(a.dataset.products) || 0;
            const productsB = parseInt(b.dataset.products) || 0;

            switch (sortValue) {
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                case 'rating':
                    return ratingB - ratingA;
                case 'products':
                    return productsB - productsA;
                default:
                    return 0;
            }
        });

        // Réorganiser les cartes dans le DOM
        sortedCards.forEach(card => {
            if (!card.classList.contains('filtered-out')) {
                atelierGrid.appendChild(card);
            }
        });
    }

    // Gestionnaires d'événements
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterAteliers();
        });
    });

    searchInput.addEventListener('input', filterAteliers);
    sortSelect.addEventListener('change', filterAteliers);

    // Initialisation
    filterAteliers();
});

})();
