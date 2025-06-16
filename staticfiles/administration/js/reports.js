
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const periodButtons = document.querySelectorAll('.btn-period');
  const dateRangeSelector = document.getElementById('dateRangeSelector');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  
  // Charts objects
  let salesChart, yearlyComparisonChart, serviceDistributionChart, 
      serviceEvolutionChart, satisfactionChart, topClientsChart;
  
  // Sample Data
  const salesData = [
    { name: 'Jan', total: 2400 },
    { name: 'Fév', total: 1398 },
    { name: 'Mar', total: 9800 },
    { name: 'Avr', total: 3908 },
    { name: 'Mai', total: 4800 },
    { name: 'Juin', total: 3800 },
    { name: 'Juil', total: 4300 },
  ];

  const serviceCategoryData = [
    { name: 'Retouches', value: 40 },
    { name: 'Sur-mesure', value: 30 },
    { name: 'Réparations', value: 20 },
    { name: 'Autres', value: 10 },
  ];

  const customerSatisfactionData = [
    { name: 'Jan', satisfaction: 80 },
    { name: 'Fév', satisfaction: 85 },
    { name: 'Mar', satisfaction: 90 },
    { name: 'Avr', satisfaction: 88 },
    { name: 'Mai', satisfaction: 92 },
    { name: 'Juin', satisfaction: 95 },
    { name: 'Juil', satisfaction: 93 },
  ];

  const yearlyComparisonData = [
    { month: 'Jan', current: 2400, previous: 2100 },
    { month: 'Fév', current: 1398, previous: 1200 },
    { month: 'Mar', current: 9800, previous: 8200 },
    { month: 'Avr', current: 3908, previous: 4100 },
    { month: 'Mai', current: 4800, previous: 3700 },
    { month: 'Juin', current: 3800, previous: 3200 },
    { month: 'Juil', current: 4300, previous: 3900 },
  ];

  const topClientsData = [
    { name: 'Marie Dupont', value: 2400 },
    { name: 'Jean Martin', value: 1398 },
    { name: 'Sophie Leclerc', value: 1200 },
    { name: 'Pierre Durand', value: 980 },
    { name: 'Laure Petit', value: 760 },
  ];

  const serviceEvolutionData = [
    { month: 'Jan', retouches: 400, surmesure: 240, reparations: 200, autres: 100 },
    { month: 'Fév', retouches: 300, surmesure: 139, reparations: 230, autres: 80 },
    { month: 'Mar', retouches: 500, surmesure: 980, reparations: 200, autres: 120 },
    { month: 'Avr', retouches: 400, surmesure: 390, reparations: 220, autres: 100 },
    { month: 'Mai', retouches: 300, surmesure: 480, reparations: 250, autres: 90 },
    { month: 'Juin', retouches: 400, surmesure: 380, reparations: 220, autres: 110 },
    { month: 'Juil', retouches: 500, surmesure: 430, reparations: 210, autres: 130 },
  ];

  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];
  
  // Initialize Charts
  function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
      type: 'bar',
      data: {
        labels: salesData.map(item => item.name),
        datasets: [{
          label: 'Chiffre d\'affaires',
          data: salesData.map(item => item.total),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1
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
    
    // Yearly Comparison Chart
    const yearlyComparisonCtx = document.getElementById('yearlyComparisonChart').getContext('2d');
    yearlyComparisonChart = new Chart(yearlyComparisonCtx, {
      type: 'bar',
      data: {
        labels: yearlyComparisonData.map(item => item.month),
        datasets: [
          {
            label: 'Cette année',
            data: yearlyComparisonData.map(item => item.current),
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 1
          },
          {
            label: 'Année précédente',
            data: yearlyComparisonData.map(item => item.previous),
            backgroundColor: 'rgba(203, 213, 225, 0.8)',
            borderColor: 'rgba(203, 213, 225, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
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
    
    // Service Distribution Chart (Pie)
    const serviceDistributionCtx = document.getElementById('serviceDistributionChart').getContext('2d');
    serviceDistributionChart = new Chart(serviceDistributionCtx, {
      type: 'pie',
      data: {
        labels: serviceCategoryData.map(item => item.name),
        datasets: [{
          data: serviceCategoryData.map(item => item.value),
          backgroundColor: COLORS,
          borderColor: COLORS.map(color => color),
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
    
    // Service Evolution Chart (Stacked Bar)
    const serviceEvolutionCtx = document.getElementById('serviceEvolutionChart').getContext('2d');
    serviceEvolutionChart = new Chart(serviceEvolutionCtx, {
      type: 'bar',
      data: {
        labels: serviceEvolutionData.map(item => item.month),
        datasets: [
          {
            label: 'Retouches',
            data: serviceEvolutionData.map(item => item.retouches),
            backgroundColor: COLORS[0],
            borderColor: COLORS[0],
            borderWidth: 1
          },
          {
            label: 'Sur-mesure',
            data: serviceEvolutionData.map(item => item.surmesure),
            backgroundColor: COLORS[1],
            borderColor: COLORS[1],
            borderWidth: 1
          },
          {
            label: 'Réparations',
            data: serviceEvolutionData.map(item => item.reparations),
            backgroundColor: COLORS[2],
            borderColor: COLORS[2],
            borderWidth: 1
          },
          {
            label: 'Autres',
            data: serviceEvolutionData.map(item => item.autres),
            backgroundColor: COLORS[3],
            borderColor: COLORS[3],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + ' €';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
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
    
    // Customer Satisfaction Chart
    const satisfactionCtx = document.getElementById('satisfactionChart').getContext('2d');
    satisfactionChart = new Chart(satisfactionCtx, {
      type: 'line',
      data: {
        labels: customerSatisfactionData.map(item => item.name),
        datasets: [{
          label: 'Satisfaction client (%)',
          data: customerSatisfactionData.map(item => item.satisfaction),
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 1)',
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
            callbacks: {
              label: function(context) {
                return 'Satisfaction: ' + context.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 60,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
    
    // Top Clients Chart (Horizontal Bar)
    const topClientsCtx = document.getElementById('topClientsChart').getContext('2d');
    topClientsChart = new Chart(topClientsCtx, {
      type: 'bar',
      data: {
        labels: topClientsData.map(item => item.name),
        datasets: [{
          label: 'Montant (€)',
          data: topClientsData.map(item => item.value),
          backgroundColor: COLORS,
          borderColor: COLORS,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Total: ' + context.parsed.x + ' €';
              }
            }
          }
        },
        scales: {
          x: {
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
  }
  
  // Period Selection
  periodButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      periodButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show or hide date range selector
      if (this.dataset.period === 'custom') {
        dateRangeSelector.classList.remove('hidden');
      } else {
        dateRangeSelector.classList.add('hidden');
      }
      
      // In a real app, update charts with new data based on period
      updateChartsForPeriod(this.dataset.period);
    });
  });
  
  // Tab Navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show corresponding tab pane
      const tabId = this.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Export to PDF
  exportPdfBtn.addEventListener('click', function() {
    alert('Fonctionnalité d\'export PDF en cours de développement');
  });
  
  // Custom Date Range
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  
  if (startDateInput && endDateInput) {
    // Set default values (6 months ago to today)
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    startDateInput.valueAsDate = sixMonthsAgo;
    endDateInput.valueAsDate = today;
    
    // Update charts when date range changes
    startDateInput.addEventListener('change', updateCustomDateRange);
    endDateInput.addEventListener('change', updateCustomDateRange);
  }
  
  function updateCustomDateRange() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (startDate && endDate) {
      // In a real app, update charts with data for this custom date range
      console.log('Custom date range:', startDate, 'to', endDate);
      
      // For this static example, we'll just log the dates
      // updateChartsForCustomRange(startDate, endDate);
    }
  }
  
  // Function to update charts based on period
  function updateChartsForPeriod(period) {
    console.log('Selected period:', period);
    
    // In a real app, you would fetch new data for the selected period
    // and update the charts accordingly
    
    // For this static example, we'll just log the period
  }
  
  // Initialize all charts when page loads
  initializeCharts();
});
