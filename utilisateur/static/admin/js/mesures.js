// Fonctionnalités pour l'interface d'administration des mesures

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des sections pliables
    const sections = document.querySelectorAll('.module');
    sections.forEach(section => {
        const header = section.querySelector('h2');
        if (header) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'collapse-toggle';
            toggleButton.innerHTML = '▼';
            toggleButton.title = 'Cliquer pour plier/déplier';
            header.appendChild(toggleButton);

            const content = section.querySelector('.form-row');
            if (content) {
                toggleButton.addEventListener('click', () => {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    toggleButton.innerHTML = content.style.display === 'none' ? '▶' : '▼';
                });
            }
        }
    });

    // Validation des champs de mesure
    const measureInputs = document.querySelectorAll('input[type="number"]');
    measureInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value < 0) {
                this.value = 0;
                showError(this, 'La valeur ne peut pas être négative');
            } else if (value > 300) {
                this.value = 300;
                showError(this, 'La valeur ne peut pas dépasser 300 cm');
            } else {
                clearError(this);
            }
        });
    });

    // Fonction pour afficher les erreurs
    function showError(input, message) {
        clearError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'errorlist';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
    }

    // Fonction pour effacer les erreurs
    function clearError(input) {
        const errorDiv = input.parentNode.querySelector('.errorlist');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Gestion des messages
    const messages = document.querySelectorAll('.messagelist li');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 5000);
    });

    // Amélioration de la recherche
    const searchInput = document.querySelector('#searchbar input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#changelist table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300));
    }

    // Fonction debounce pour optimiser la recherche
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Gestion des filtres
    const filterLinks = document.querySelectorAll('#changelist-filter a');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            filterLinks.forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Amélioration de l'expérience utilisateur pour les champs de saisie
    measureInputs.forEach(input => {
        // Ajout d'un indicateur visuel pour les champs modifiés
        input.addEventListener('change', function() {
            if (this.value !== this.defaultValue) {
                this.classList.add('modified');
            } else {
                this.classList.remove('modified');
            }
        });

        // Ajout d'un bouton de réinitialisation
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-button';
        resetButton.innerHTML = '↺';
        resetButton.title = 'Réinitialiser la valeur';
        resetButton.style.display = 'none';
        
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(resetButton);

        resetButton.addEventListener('click', function() {
            input.value = input.defaultValue;
            input.classList.remove('modified');
            this.style.display = 'none';
        });

        input.addEventListener('input', function() {
            resetButton.style.display = this.value !== this.defaultValue ? 'inline-block' : 'none';
        });
    });

    // Amélioration de l'affichage des dates
    const dateFields = document.querySelectorAll('.field-date_creation, .field-date_modification');
    dateFields.forEach(field => {
        const dateText = field.textContent;
        if (dateText) {
            const date = new Date(dateText);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            field.textContent = formattedDate;
        }
    });

    // Ajout d'un bouton pour exporter les mesures
    const exportButton = document.createElement('button');
    exportButton.className = 'export-button';
    exportButton.innerHTML = '📥 Exporter les mesures';
    exportButton.style.cssText = `
        background: linear-gradient(to right, #E17921, #9C4506);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px 0;
    `;

    const changelist = document.querySelector('#changelist');
    if (changelist) {
        changelist.insertBefore(exportButton, changelist.firstChild);

        exportButton.addEventListener('click', function() {
            const rows = document.querySelectorAll('#changelist table tbody tr');
            const data = Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                return Array.from(cells).map(cell => cell.textContent.trim());
            });

            const csv = data.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mesures.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    }
}); 