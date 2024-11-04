// import { EventService } from '../services/Event.service.js'
// import { Utils } from '../scripts/utils/Utils.js'

// document.addEventListener('DOMContentLoaded', function () {
//   let eventColor = ''
//   let eventTextColor = ''

//   var calendarEl = document.getElementById('calendar')

//   var calendar = new FullCalendar.Calendar(calendarEl, {
//     locale: 'fr',
//     initialDate: '2024-05-01',
//     editable: false,
//     selectable: false,
//     businessHours: true,
//     dayMaxEvents: true, // allow "more" link when too many events
//     titleFormat: {
//       // will produce something like "Tuesday, September 18, 2018"
//       month: 'long',
//       year: 'numeric',
//       day: 'numeric',
//       weekday: 'long',
//     },
//     events: [
//       {
//         title: 'Huissier à prendre.',
//         start: '2024-05-01',
//         color: 'yellow', // an option!
//         textColor: 'black', // an option!
//       },
//       {
//         title: "Cour administrative d'appel de Poitiers ",
//         start: '2024-05-06',
//         end: '2024-05-10',
//         backgroundColor: 'red',
//         borderColor: 'red',
//       },
//       {
//         groupId: 999,
//         title: 'convocation recours',
//         start: '2024-05-09T16:00:00',
//         color: 'yellow', // an option!
//         textColor: 'black', // an option!
//       },
//       {
//         groupId: 999,
//         title: 'convocation recours',
//         start: '2024-05-16T16:00:00',
//       },
//       {
//         title: 'URSSAF',
//         start: '2024-05-11',
//         end: '2024-05-13',
//         backgroundColor: 'green',
//       },
//       {
//         title: 'Contestation mise en demeure',
//         start: '2024-05-12T10:30:00',
//         end: '2024-05-12T12:30:00',
//       },
//       {
//         title: 'AG2R',
//         start: '2024-05-12T12:00:00',
//       },
//       {
//         title: 'avis de signification acte huissier',
//         start: '2024-05-12T14:30:00',
//       },
//       {
//         title: 'Convocation tribunal',
//         start: '2024-05-12T17:30:00',
//       },
//       {
//         title: 'Prudhommes',
//         start: '2024-05-12T20:00:00',
//       },
//       {
//         title: 'DGFP La Rochelle',
//         start: '2024-05-13T07:00:00',
//       },
//     ],
//     eventSources: ['http://192.168.0.112/Public/ndecr_test/calendrier.php'],
//   })
//   const retrievedEvents = calendar.getEvents()
//   console.log('évènements test:', retrievedEvents)
//   calendar.render()

//   // Ajouter la légende
//   var legendContainer = document.getElementById('legendContainer')
//   var legend = document.createElement('div')
//   legend.classList.add('legend')

//   // Catégories et leurs couleurs
//   var categories = [
//     { name: 'Amauger', color: '#ff9f89' },
//     { name: 'Cial', color: '#00FFFF' },
//     { name: 'Divers', color: '#a3ffa3' },
//     { name: 'Fiscal', color: '#a3a3ff' },
//     { name: 'Pénal', color: '#FF00FF' },
//     { name: 'RC', color: '#ffffa3' },
//     { name: 'Social', color: '#008080' },
//     { name: 'Stenico', color: '#FF0000' },
//   ]

//   categories.forEach(function (category) {
//     var item = document.createElement('div')
//     item.classList.add('legend-item')

//     var color = document.createElement('div')
//     color.classList.add('legend-color')
//     color.style.backgroundColor = category.color

//     var text = document.createElement('span')
//     text.textContent = category.name

//     item.appendChild(color)
//     item.appendChild(text)
//     legend.appendChild(item)
//   })

//   legendContainer.appendChild(legend)

//   // Ajouter le bouton de retour
//   // var footerContainer = document.getElementById('footerContainer')
//   // var goBackButton = document.createElement('button')
//   // goBackButton.textContent = 'Retour'
//   // goBackButton.classList.add('goBackButton')
//   const container = document.createElement('div')
//   container.setAttribute('class', 'buttonWrapper')
//   const goBackButton = document.createElement('button')
//   goBackButton.classList.add('goBackButton')
//   goBackButton.classList.add('errorButton')
//   goBackButton.textContent = 'Retour'
//   goBackButton.addEventListener('click', function () {
//     window.history.back()
//   })

//   footerContainer.appendChild(goBackButton)
// })
//////////////////////////////////////////////////////////////////////////////////////////////////////

// test avec fetch des datas pour le calendrier et intégration dans une classe

// window.onload = async function () {
//   if (typeof Utils === 'undefined' || typeof EventService === 'undefined') {
//     console.error(
//       "Utils ou EventService n'est pas défini. Assurez-vous que les dépendances sont correctement chargées.",
//     )
//     return
//   }
/////////////////////////////////////////////////////////////////////////////////////////
// Classe pour tester la récupération des événements
// class CalendarTestComponent {
//   constructor() {
//     this.eventService = new EventService()
//     this.utils = new Utils()
//     this.userCredentials = null
//     this.eventsData = []
//   }

//   async init() {
//     await this.getEventsData()
//     this.logEvents()
//   }

//   async getCredentials() {
//     // Récupère les informations d'authentification de l'utilisateur depuis localStorage
//     const user = JSON.parse(localStorage.getItem('user'))
//     this.userCredentials = {
//       userID: user['matricule'],
//       password: user['mdp'],
//     }
//   }

//   async getEventsData() {
//     // Récupère les événements de la base de données
//     await this.getCredentials()
//     this.eventsData = await this.eventService.getEvent(this.userCredentials)
//   }

//   logEvents() {
//     // Affiche les événements dans la console
//     console.log('Événements récupérés :', this.eventsData)
//   }
// }

// // Initialise et exécute le composant de test
// const calendarTestComponent = new CalendarTestComponent()
// calendarTestComponent.init()

/////////////////////////////////////////////////////////////////////////////////////////

window.onload = async function () {
  if (typeof Utils === 'undefined' || typeof EventService === 'undefined') {
    console.error(
      "Utils ou EventService n'est pas défini. Assurez-vous que les dépendances sont correctement chargées.",
    )
    return
  }

  class CalendarComponent {
    constructor() {
      this.eventService = new EventService()
      this.userCredentials = null
      this.eventsData = []
    }

    async init() {
      await this.getEventsData()
      this.displayCalendar()
      this.setupModal()
    }

    async getCredentials() {
      const user = JSON.parse(localStorage.getItem('user'))
      this.userCredentials = {
        userID: user['matricule'],
        password: user['mdp'],
      }
    }

    async getEventsData() {
      await this.getCredentials()
      this.eventsData = await this.eventService.getEvent(this.userCredentials)
      console.log('Événements récupérés :', this.eventsData)
    }

    transformEventsForCalendar() {
      // Transforme les données d'événements pour être compatible avec FullCalendar
      return this.eventsData.map((event) => ({
        title: event.action || 'Événement',
        start: event.datederevent, // date de début
        end:
          event.datenextevent && event.datenextevent !== '1900-01-01T00:00:00'
            ? event.datenextevent
            : null, // date de fin si disponible
        color: this.getEventColor(event.stade), // fonction pour déterminer la couleur de l'événement
        textColor: 'black', // couleur du texte
        extendedProps: {
          commentaire: event.commentaire, // stocke le commentaire dans les propriétés étendues
          lieu_juridiction: event.lieu_juridiction,
        },
      }))
    }

    getEventColor(stade) {
      const colors = {
        'Pré-contentieux': 'yellow',
        Contentieux: 'red',
        Recouvrement: 'green',
      }
      return colors[stade] || '#3788d8' // couleur par défaut si le stade n'est pas dans le dictionnaire
    }

    displayCalendar() {
      const calendarEl = document.getElementById('calendar')
      const transformedEvents = this.transformEventsForCalendar()

      const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'fr',
        editable: false,
        selectable: false,
        businessHours: true,
        dayMaxEvents: true,
        titleFormat: {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
          weekday: 'long',
        },
        events: transformedEvents,
        eventClick: this.handleEventClick, // Gestionnaire de clic sur un événement
      })

      calendar.render()
    }

    handleEventClick(info) {
      const commentaire = info.event.extendedProps.commentaire
      const lieu_juridiction = info.event.extendedProps.lieu_juridiction
      console.log('lieu :', lieu_juridiction)
      const eventCommentEl = document.getElementById('eventComment')
      const eventPlaceEl = document.getElementById('eventPlace')
      const modal = document.getElementById('eventModal')
      eventCommentEl.innerText = commentaire
      eventPlaceEl.innerText = lieu_juridiction
      modal.style.display = 'flex' // Affiche la modale
    }

    setupModal() {
      // Ajoute un gestionnaire pour fermer la modale
      const modal = document.getElementById('eventModal')
      const closeModalButton = document.getElementById('closeModal')

      closeModalButton.onclick = function () {
        modal.style.display = 'none'
      }

      // Ferme la modale si on clique en dehors du contenu
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none'
        }
      }
    }
  }

  // Initialisation du composant de calendrier
  const calendarComponent = new CalendarComponent()
  calendarComponent.init()
}
