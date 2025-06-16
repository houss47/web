// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Performance tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Here you would typically load different data for the charts
      // based on the selected period
      updateCharts(this.dataset.period);
    });
  });
  
  // Initialize charts
  initializeCharts();
});

// Fonction pour récupérer les données JSON du DOM
function getCommandesData() {
    const scriptTag = document.getElementById('commandes-data');
    if (scriptTag && scriptTag.textContent) {
        try {
            return JSON.parse(scriptTag.textContent);
        } catch (e) {
            console.error("Erreur lors du parsing des données JSON des commandes:", e);
            return {};
        }
    } else {
        console.warn("Balise 'commandes-data' ou son contenu introuvable.");
        return {};
    }
}

function getRevenueLabelsData() {
    const scriptTag = document.getElementById('revenue-labels-data');
    if (scriptTag && scriptTag.textContent) {
        try {
            return JSON.parse(scriptTag.textContent);
        } catch (e) {
            console.error("Erreur lors du parsing des données JSON des labels de revenus:", e);
            return [];
        }
    } else {
        console.warn("Balise 'revenue-labels-data' ou son contenu introuvable.");
        return [];
    }
}

function getRevenueChartData() {
    const scriptTag = document.getElementById('revenue-data');
    if (scriptTag && scriptTag.textContent) {
        try {
            return JSON.parse(scriptTag.textContent);
        } catch (e) {
            console.error("Erreur lors du parsing des données JSON des revenus:", e);
            return [];
        }
    } else {
        console.warn("Balise 'revenue-data' ou son contenu introuvable.");
        return [];
    }
}

// Function to initialize charts
function initializeCharts() {
  // Données dynamiques des commandes par statut
  const commandesParStatut = getCommandesData();
  console.log('Données des commandes par statut:', commandesParStatut);

  // Données dynamiques du chiffre d'affaires
  const revenueLabels = getRevenueLabelsData();
  const revenueData = getRevenueChartData();
  console.log('Labels de revenus:', revenueLabels);
  console.log('Données de revenus:', revenueData);

  // Revenue Chart - Area Chart
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  if (!revenueCtx) {
      console.error('L\'élément canvas avec l\'ID "revenueChart" n\'a pas été trouvé ou le contexte 2D n\'est pas disponible.');
      return; 
  }
  const revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: revenueLabels, // Utilisation des labels dynamiques
      datasets: [{
        label: 'Chiffre d\'affaires (CFA)', // Changement de la devise
        data: revenueData, // Utilisation des données dynamiques
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + ' CFA'; // Changement de la devise
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' CFA'; // Changement de la devise
            }
          }
        }
      }
    }
  });
  
  // Services Chart - Pie Chart
  const servicesCtx = document.getElementById('servicesChart').getContext('2d');
  if (!servicesCtx) {
      console.error('L\'élément canvas avec l\'ID "servicesChart" n\'a pas été trouvé ou le contexte 2D n\'est pas disponible.');
      return;
  }
  const servicesChart = new Chart(servicesCtx, {
    type: 'pie',
    data: {
      labels: ['En attente', 'En cours', 'Terminées'],
      datasets: [{
        data: [
          commandesParStatut.en_attente,
          commandesParStatut.en_cours,
          commandesParStatut.termine
        ],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)', // Orange pour 'En attente'
          'rgba(14, 165, 233, 0.8)', // Bleu pour 'En cours'
          'rgba(139, 92, 246, 0.8)'  // Violet pour 'Terminées'
        ],
        borderColor: [
          'rgba(249, 115, 22, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Function to update charts based on selected period
function updateCharts(period) {
  // This function would typically fetch new data and update the charts
  // For this static example, we'll just log the period
  console.log('Period changed to:', period);
  
  // You would normally update the charts with new data here
  // Example: revenueChart.data.datasets[0].data = newData;
  // Example: revenueChart.update();
}
