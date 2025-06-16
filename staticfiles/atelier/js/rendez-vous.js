// Configuration du calendrier
const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Variables globales
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let appointmentType = 'in-workshop';
let appointmentReason = '';

// Générer le calendrier
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Mettre à jour l'en-tête du calendrier
    document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;
    
    // Calculer le premier jour du mois
    const firstDay = new Date(year, month, 1);
    let firstDayIndex = firstDay.getDay() - 1; // Lundi comme premier jour (0)
    if (firstDayIndex < 0) firstDayIndex = 6; // Dimanche = 6
    
    // Calculer le nombre de jours dans le mois
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculer le nombre de jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Référence au conteneur des jours
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    // Jours du mois précédent
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'outside-month');
        dayElement.textContent = prevMonthLastDay - i + 1;
        calendarDays.appendChild(dayElement);
    }
    
    // Jours du mois courant
    const today = new Date();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = i;
        
        // Vérifier si c'est aujourd'hui
        if (
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add('today');
        }
        
        // Vérifier si ce jour est sélectionné
        if (
            selectedDate && 
            i === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        ) {
            dayElement.classList.add('selected');
        }
        
        // Événement pour sélectionner une date
        dayElement.addEventListener('click', () => {
            const date = new Date(year, month, i);
            selectDate(date, dayElement);
        });
        
        calendarDays.appendChild(dayElement);
    }
    
    // Calculer le nombre de jours à ajouter du mois suivant
    const daysToAdd = 42 - (firstDayIndex + daysInMonth);
    
    // Jours du mois suivant
    for (let i = 1; i <= daysToAdd; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'outside-month');
        dayElement.textContent = i;
        calendarDays.appendChild(dayElement);
    }
}

// Sélectionner une date
function selectDate(date, element) {
    // Désélectionner la date précédente
    const prevSelected = document.querySelector('.calendar-day.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    
    // Sélectionner la nouvelle date
    selectedDate = date;
    element.classList.add('selected');
    
    // Mettre à jour l'affichage de la date
    updateSelectedDateDisplay();
    
    // Générer les créneaux horaires
    generateTimeSlots();
}

// Mettre à jour l'affichage de la date sélectionnée
function updateSelectedDateDisplay() {
    const dateDisplay = document.getElementById('selected-date-display');
    
    if (selectedDate) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = selectedDate.toLocaleDateString('fr-FR', options);
        
        // Première lettre en majuscule
        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        dateDisplay.textContent = capitalizedDate;
    } else {
        dateDisplay.textContent = 'Veuillez sélectionner une date pour voir les créneaux disponibles';
    }
}

// Générer les créneaux horaires
function generateTimeSlots() {
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    
    // Vider les créneaux existants
    timeSlotsGrid.innerHTML = '';
    
    if (selectedDate) {
        // Créneaux fictifs (à remplacer par des données réelles)
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ];
        
        // Créer les éléments de créneau
        timeSlots.forEach(time => {
            const slotElement = document.createElement('div');
            slotElement.classList.add('time-slot');
            slotElement.textContent = time;
            
            // Vérifier si c'est le créneau sélectionné
            if (time === selectedTime) {
                slotElement.classList.add('selected');
            }
            
            // Événement pour sélectionner un créneau
            slotElement.addEventListener('click', () => {
                selectTimeSlot(time, slotElement);
            });
            
            timeSlotsGrid.appendChild(slotElement);
        });
        
        // Afficher la grille de créneaux
        timeSlotsGrid.style.display = 'grid';
    } else {
        // Masquer la grille si aucune date n'est sélectionnée
        timeSlotsGrid.style.display = 'none';
    }
}

// Sélectionner un créneau horaire
function selectTimeSlot(time, element) {
    // Désélectionner le créneau précédent
    const prevSelected = document.querySelector('.time-slot.selected');
    if (prevSelected) {
        prevSelected.classList.remove('selected');
    }
    
    // Sélectionner le nouveau créneau
    selectedTime = time;
    element.classList.add('selected');
}

// Gérer les options de type de rendez-vous
function setupAppointmentType() {
    const radioOptions = document.querySelectorAll('.radio-option');
    
    radioOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Désélectionner toutes les options
            radioOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Sélectionner l'option cliquée
            option.classList.add('selected');
            
            // Mettre à jour le type de rendez-vous
            appointmentType = option.dataset.value;
        });
    });
}

// Gérer le menu déroulant de motif
function setupAppointmentReason() {
    const reasonSelect = document.getElementById('appointment-reason');
    const durationElement = document.getElementById('duration');
    const durationTimeElement = document.getElementById('duration-time');
    
    reasonSelect.addEventListener('change', () => {
        appointmentReason = reasonSelect.value;
        
        // Afficher la durée estimée
        if (appointmentReason) {
            let duration;
            
            switch (appointmentReason) {
                case 'consultation':
                    duration = '30 min';
                    break;
                case 'adjustment':
                    duration = '45 min';
                    break;
                case 'custom':
                    duration = '60 min';
                    break;
                default:
                    duration = '30 min';
            }
            
            durationTimeElement.textContent = duration;
            durationElement.style.display = 'block';
        } else {
            durationElement.style.display = 'none';
        }
    });
}

// Configuration du bouton de confirmation
function setupConfirmButton() {
    const confirmBtn = document.getElementById('confirm-btn');
    
    confirmBtn.addEventListener('click', () => {
        // Vérifier si toutes les informations sont remplies
        if (!selectedDate || !selectedTime || !appointmentReason) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        
        // Récupérer les notes
        const notes = document.getElementById('notes').value;
        
        // Formatage de la date
        const options = { dateStyle: 'full' };
        const formattedDate = selectedDate.toLocaleDateString('fr-FR', options);
        
        // Confirmation du rendez-vous (à remplacer par l'envoi à un serveur)
        alert(`Votre rendez-vous a été confirmé !\n\nDate : ${formattedDate}\nHeure : ${selectedTime}\nType : ${appointmentType === 'in-workshop' ? 'En atelier' : 'À distance'}\nMotif : ${appointmentReason}`);
        
        // Réinitialiser le formulaire
        resetForm();
    });
}

// Réinitialiser le formulaire
function resetForm() {
    // Réinitialiser la date
    selectedDate = null;
    const selectedDay = document.querySelector('.calendar-day.selected');
    if (selectedDay) {
        selectedDay.classList.remove('selected');
    }
    
    // Réinitialiser l'heure
    selectedTime = null;
    
    // Réinitialiser le motif
    document.getElementById('appointment-reason').value = '';
    document.getElementById('duration').style.display = 'none';
    
    // Réinitialiser les notes
    document.getElementById('notes').value = '';
    
    // Réinitialiser l'affichage
    document.getElementById('selected-date-display').textContent = 'Veuillez sélectionner une date pour voir les créneaux disponibles';
    document.getElementById('time-slots-grid').style.display = 'none';
}

// Navigation dans le calendrier
function setupCalendarNavigation() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    setupAppointmentType();
    setupAppointmentReason();
    setupConfirmButton();
    setupCalendarNavigation();
}); 