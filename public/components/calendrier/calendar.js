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

document.addEventListener('DOMContentLoaded', () => {
  class CalendarComponent {
    constructor() {
      this.eventService = new EventService()
      this.folderService = new FolderService()
      this.utils = new Utils()
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
      // this.foldersData = await this.folderService.getFolder(
      //   this.userCredentials,
      // )
      // console.log('Dossiers récupérés :', this.foldersData)
    }

    // Retourne le nom du dossier correspondant à l'id
    // getFolderName(folderId) {
    //   const folder = this.foldersData.find(
    //     (folder) => folder['cle'] === folderId,
    //   )
    //   return folder['nom']
    // }

    transformEventsForCalendar() {
      return this.eventsData.map((event) => ({
        // title: event.action || 'Événement',
        title: `${event.cle_litige_dossier}`,
        // title: `${event.cle_litige_dossier} - ${this.getFolderName(event.cle_litige_dossier)}`,
        // start: event.datederevent.slice(0, 10), // Tronque l'heure pour ne garder que la date (format YYYY-MM-DD)
        start: this.utils.reformatCalendarDate(event.datederevent),
        // end:
        //   event.datenextevent && event.datenextevent !== '1900-01-01T00:00:00'
        //     ? event.datenextevent
        //     : null,
        backgroundColor: this.getEventColor(event.event_type), // Couleur de fond de l'événement
        borderColor: this.getEventColor(event.event_type), // Couleur de bordure de l'événement
        textColor: this.getEventTextColor(event),
        extendedProps: {
          titre: event.action,
          event_date: this.utils.reformatCalendarDate(event.datederevent),
          commentaire: event.commentaire,
          lieu_juridiction: event.lieu_juridiction,
          event_type: event.event_type,
          event_dossier: event.cle_litige_dossier,
          // name: this.getFolderName(event.cle_litige_dossier),
        },
      }))
    }

    getEventColor(type) {
      const colors = {
        9: 'yellow',
        10: 'red',
        11: 'green',
      }
      return colors[type] || '#3788d8'
    }

    getEventTextColor(event) {
      // Vérifie si la couleur de fond de l'événement est 'yellow'
      const textColor =
        this.getEventColor(event.event_type) === 'yellow' ? 'black' : 'white'
      return textColor
    }

    displayCalendar() {
      const calendarEl = document.getElementById('calendar')
      const transformedEvents = this.transformEventsForCalendar()
      console.log('elements du calendrier :', transformedEvents)
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
        eventClick: this.handleEventClick.bind(this),

        // Fonction pour forcer la couleur des événements
        eventDidMount: (info) => {
          const eventType = info.event.extendedProps.event_type
          const eventColor = this.getEventColor(eventType)

          // Applique les couleurs directement au style de l'élément
          info.el.style.backgroundColor = eventColor
          info.el.style.borderColor = eventColor
          // info.el.style.eventTextColor =
          //   eventColor === 'yellow' ? 'black' : 'white'

          // info.el.style.textColor = 'white'
          // TODO: Ajouter la fonction de tooltip
          // var tooltip = new Tooltip(info.el, {
          //   title: info.event.extendedProps.description,
          //   placement: 'top',
          //   trigger: 'hover',
          //   container: 'body',
          // })
        },
      })

      calendar.render()
    }

    handleEventClick(info) {
      const commentaire = info.event.extendedProps.commentaire
      const lieu_juridiction = info.event.extendedProps.lieu_juridiction
      const titre = info.event.extendedProps.titre
      const eventType = info.event.extendedProps.event_type
      const eventDossier = info.event.extendedProps.event_dossier
      const eventName = info.event.extendedProps.name

      // Mise à jour des éléments de la modale
      const eventDossierEl = document.getElementById('eventDossier')
      const eventNameEl = document.getElementById('eventName')
      const eventCommentEl = document.getElementById('eventComment')
      const eventPlaceEl = document.getElementById('eventPlace')
      const eventTitleEl = document.getElementById('eventTitle')
      const modal = document.getElementById('eventModal')
      const modalContent = modal.querySelector('.modal-content')

      eventDossierEl.innerText = eventDossier
      eventNameEl.innerText = eventName
      eventCommentEl.innerText = commentaire
      eventPlaceEl.innerText = lieu_juridiction
      eventTitleEl.innerText = titre

      // Applique la couleur de fond en fonction du type d'événement
      modalContent.style.backgroundColor =
        this.getModalBackgroundColor(eventType)

      modal.style.display = 'flex'
    }

    getModalBackgroundColor(type) {
      const backgroundColors = {
        9: '#fffacd', // Jaune très clair pour le type 9
        10: '#ffcccc', // Rouge très clair pour le type 10
        11: '#ccffcc', // Vert très clair pour le type 11
      }
      return backgroundColors[type] || '#eaeaea' // Couleur par défaut si le type n'est pas défini
    }

    setupModal() {
      const modal = document.getElementById('eventModal')
      const closeModalButton = document.getElementById('closeModal')

      closeModalButton.onclick = () => {
        modal.style.display = 'none'
      }

      window.onclick = (event) => {
        if (event.target === modal) {
          modal.style.display = 'none'
        }
      }
    }
  }

  // Initialisation du composant de calendrier
  const calendarComponent = new CalendarComponent()
  calendarComponent.init()

  // Gestionnaire pour le bouton retour
  const backButton = document.getElementById('backButton')
  backButton.addEventListener('click', () => {
    window.history.back() // Retourne à la page précédente
  })
})
