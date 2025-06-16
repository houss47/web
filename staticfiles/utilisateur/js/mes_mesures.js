// Script spécifique pour la page Mes Mesures

// Conversion entre unités de mesure
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du changement d'unité de mesure
    const measureUnitSelect = document.getElementById('measureUnitSelect');
    if (measureUnitSelect) {
        measureUnitSelect.addEventListener('change', function() {
            const unit = this.value;
            const measurementValues = document.querySelectorAll('.measurement-value');
            
            measurementValues.forEach(el => {
                let value = parseFloat(el.textContent);
                let currentUnit = el.textContent.includes('cm') ? 'cm' : 'inch';
                
                // Si l'unité actuelle est différente de celle sélectionnée, faire la conversion
                if (currentUnit !== unit) {
                    if (unit === 'inch') {
                        // Convertir de cm à pouces
                        value = (value / 2.54).toFixed(1);
                        el.textContent = value + ' inch';
                    } else {
                        // Convertir de pouces à cm
                        value = (value * 2.54).toFixed(1);
                        el.textContent = value + ' cm';
                    }
                }
            });
        });
    }

    // Interaction avec la silhouette
    const measurementItems = document.querySelectorAll('.measurement-item');
    const silhouette = document.querySelector('.silhouette');
    
    if (measurementItems.length > 0 && silhouette) {
        // Création des points de mesure sur la silhouette (positions fictives à adapter)
        const measurementPoints = [
            { id: 'shoulder', top: '15%', left: '50%', target: 'shoulders' },
            { id: 'chest', top: '25%', left: '50%', target: 'chest' },
            { id: 'waist', top: '40%', left: '50%', target: 'waist' },
            { id: 'hip', top: '50%', left: '50%', target: 'hips' },
            { id: 'thigh', top: '60%', left: '40%', target: 'thighs' },
            { id: 'inseam', top: '70%', left: '45%', target: 'inseam' },
            { id: 'arm', top: '30%', left: '30%', target: 'arms' }
        ];
        
        const silhouetteContainer = document.querySelector('.silhouette-container');
        
        measurementPoints.forEach(point => {
            const pointElement = document.createElement('div');
            pointElement.className = 'measurement-point';
            pointElement.id = point.id;
            pointElement.style.top = point.top;
            pointElement.style.left = point.left;
            pointElement.dataset.target = point.target;
            
            silhouetteContainer.appendChild(pointElement);
        });
        
        // Interaction entre les points et les mesures
        const points = document.querySelectorAll('.measurement-point');
        
        points.forEach(point => {
            point.addEventListener('mouseenter', function() {
                const targetId = this.dataset.target;
                // Trouver l'élément de mesure correspondant et le mettre en évidence
                document.querySelectorAll('.measurement-item').forEach(item => {
                    if (item.id === targetId || item.classList.contains(targetId)) {
                        item.style.backgroundColor = 'rgba(225, 121, 33, 0.1)';
                        item.style.borderLeftColor = '#E17921';
                    }
                });
            });
            
            point.addEventListener('mouseleave', function() {
                // Réinitialiser tous les éléments
                document.querySelectorAll('.measurement-item').forEach(item => {
                    item.style.backgroundColor = '';
                    item.style.borderLeftColor = 'transparent';
                });
            });
            
            point.addEventListener('click', function() {
                const targetId = this.dataset.target;
                // Ouvrir l'accordéon correspondant si fermé
                const accordionButton = document.querySelector(`[data-bs-target="#${targetId}Collapse"]`);
                if (accordionButton && accordionButton.classList.contains('collapsed')) {
                    accordionButton.click();
                }
                
                // Faire défiler jusqu'à l'élément
                const targetElement = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
        
        // Interaction inverse: surbrillance des points quand on survole les mesures
        measurementItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const itemId = this.id || Array.from(this.classList).find(cls => 
                    document.querySelector(`.measurement-point[data-target="${cls}"]`));
                
                if (itemId) {
                    const point = document.querySelector(`.measurement-point[data-target="${itemId}"]`);
                    if (point) {
                        point.style.transform = 'translate(-50%, -50%) scale(1.5)';
                        point.style.boxShadow = '0 0 10px rgba(225, 121, 33, 0.7)';
                    }
                }
            });
            
            item.addEventListener('mouseleave', function() {
                document.querySelectorAll('.measurement-point').forEach(point => {
                    point.style.transform = 'translate(-50%, -50%)';
                    point.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
                });
            });
        });
    }
});
