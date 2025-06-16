
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

// Function to initialize charts
function initializeCharts() {
  // Revenue Chart - Area Chart
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  const revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
      datasets: [{
        label: 'Chiffre d\'affaires (€)',
        data: [4000, 3000, 5000, 2780, 1890, 2390, 3490],
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
              return context.dataset.label + ': ' + context.parsed.y + ' €';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' €';
            }
          }
        }
      }
    }
  });
  
  // Services Chart - Pie Chart
  const servicesCtx = document.getElementById('servicesChart').getContext('2d');
  const servicesChart = new Chart(servicesCtx, {
    type: 'pie',
    data: {
      labels: ['Retouches', 'Sur-mesure', 'Réparations', 'Autres'],
      datasets: [{
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(217, 70, 239, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(14, 165, 233, 1)'
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
              return context.label + ': ' + context.parsed + '%';
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
