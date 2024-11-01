document.addEventListener('DOMContentLoaded', function () {
  let eventColor = ''
  let eventTextColor = ''

  var calendarEl = document.getElementById('calendar')

  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'fr',
    initialDate: '2024-05-01',
    editable: false,
    selectable: false,
    businessHours: true,
    dayMaxEvents: true, // allow "more" link when too many events
    titleFormat: {
      // will produce something like "Tuesday, September 18, 2018"
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      weekday: 'long',
    },
    events: [
      {
        title: 'Huissier à prendre.',
        start: '2024-05-01',
        color: 'yellow', // an option!
        textColor: 'black', // an option!
      },
      {
        title: "Cour administrative d'appel de Poitiers ",
        start: '2024-05-06',
        end: '2024-05-10',
        backgroundColor: 'red',
        borderColor: 'red',
      },
      {
        groupId: 999,
        title: 'convocation recours',
        start: '2024-05-09T16:00:00',
        color: 'yellow', // an option!
        textColor: 'black', // an option!
      },
      {
        groupId: 999,
        title: 'convocation recours',
        start: '2024-05-16T16:00:00',
      },
      {
        title: 'URSSAF',
        start: '2024-05-11',
        end: '2024-05-13',
        backgroundColor: 'green',
      },
      {
        title: 'Contestation mise en demeure',
        start: '2024-05-12T10:30:00',
        end: '2024-05-12T12:30:00',
      },
      {
        title: 'AG2R',
        start: '2024-05-12T12:00:00',
      },
      {
        title: 'avis de signification acte huissier',
        start: '2024-05-12T14:30:00',
      },
      {
        title: 'Convocation tribunal',
        start: '2024-05-12T17:30:00',
      },
      {
        title: 'Prudhommes',
        start: '2024-05-12T20:00:00',
      },
      {
        title: 'DGFP La Rochelle',
        start: '2024-05-13T07:00:00',
      },
    ],
    eventSources: ['http://192.168.0.112/Public/ndecr_test/calendrier.php'],
  })
  const retrievedEvents = calendar.getEvents()
  console.log('évènements test:', retrievedEvents)
  calendar.render()

  // Ajouter la légende
  var legendContainer = document.getElementById('legendContainer')
  var legend = document.createElement('div')
  legend.classList.add('legend')

  // Catégories et leurs couleurs
  var categories = [
    { name: 'Amauger', color: '#ff9f89' },
    { name: 'Cial', color: '#00FFFF' },
    { name: 'Divers', color: '#a3ffa3' },
    { name: 'Fiscal', color: '#a3a3ff' },
    { name: 'Pénal', color: '#FF00FF' },
    { name: 'RC', color: '#ffffa3' },
    { name: 'Social', color: '#008080' },
    { name: 'Stenico', color: '#FF0000' },
  ]

  categories.forEach(function (category) {
    var item = document.createElement('div')
    item.classList.add('legend-item')

    var color = document.createElement('div')
    color.classList.add('legend-color')
    color.style.backgroundColor = category.color

    var text = document.createElement('span')
    text.textContent = category.name

    item.appendChild(color)
    item.appendChild(text)
    legend.appendChild(item)
  })

  legendContainer.appendChild(legend)

  // Ajouter le bouton de retour
  // var footerContainer = document.getElementById('footerContainer')
  // var goBackButton = document.createElement('button')
  // goBackButton.textContent = 'Retour'
  // goBackButton.classList.add('goBackButton')
  const container = document.createElement('div')
  container.setAttribute('class', 'buttonWrapper')
  const goBackButton = document.createElement('button')
  goBackButton.classList.add('goBackButton')
  goBackButton.classList.add('errorButton')
  goBackButton.textContent = 'Retour'
  goBackButton.addEventListener('click', function () {
    window.history.back()
  })

  footerContainer.appendChild(goBackButton)
})
//////////////////////////////////////////////////////////////////////////////////////////////////////

// test avec fetch des datas pour le calendrier

// document.addEventListener('DOMContentLoaded', async function () {
//   // Instancie EventService et les autres variables nécessaires
//   const eventService = new EventService()
//   const utils = new Utils()
//   let userCredentials = null
//   let eventsDatas = []

//   // Fonction pour récupérer les événements, comme dans EventList.js
//   async function getDatas() {
//     const user = JSON.parse(localStorage.getItem('user'))
//     userCredentials = {
//       userID: user['matricule'],
//       password: user['mdp'],
//     }

//     eventsDatas = await eventService.getEvent(userCredentials)
//   }

//   // Récupère les événements et les ajoute au calendrier
//   async function fetchEventsForCalendar() {
//     try {
//       await getDatas() // Récupère les événements depuis l'API

//       // Transformation des données en objets compatibles avec FullCalendar
//       const events = []
//       eventsDatas.forEach((eventGroup) => {
//         ;(Array.isArray(eventGroup) ? eventGroup : [eventGroup]).forEach(
//           (singleEvent) => {
//             events.push({
//               title: singleEvent['event_type'] || 'Événement',
//               start: singleEvent['datederevent'],
//               end: singleEvent['datenextevent'] || null,
//               color: singleEvent['color'] || '#3788d8', // Couleur par défaut si non spécifiée
//             })
//           },
//         )
//       })

//       // Initialise et rend le calendrier avec les événements
//       const calendarEl = document.getElementById('calendar')
//       const calendar = new FullCalendar.Calendar(calendarEl, {
//         locale: 'fr',
//         initialDate: '2024-05-01',
//         editable: false,
//         selectable: false,
//         businessHours: true,
//         dayMaxEvents: true,
//         titleFormat: {
//           month: 'long',
//           year: 'numeric',
//           day: 'numeric',
//           weekday: 'long',
//         },
//         events: events, // Ajoute les événements au calendrier
//       })

//       calendar.render() // Affiche le calendrier avec les événements
//     } catch (error) {
//       console.error('Erreur lors de la récupération des événements:', error)
//     }
//   }

//   // Appel de la fonction pour récupérer et afficher les événements dans le calendrier
//   await fetchEventsForCalendar()

//   // Ajout de la légende et du bouton de retour (inchangé par rapport à votre code initial)
//   const legendContainer = document.getElementById('legendContainer')
//   const legend = document.createElement('div')
//   legend.classList.add('legend')

//   const categories = [
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
//     const item = document.createElement('div')
//     item.classList.add('legend-item')

//     const color = document.createElement('div')
//     color.classList.add('legend-color')
//     color.style.backgroundColor = category.color

//     const text = document.createElement('span')
//     text.textContent = category.name

//     item.appendChild(color)
//     item.appendChild(text)
//     legend.appendChild(item)
//   })

//   if (legendContainer) {
//     legendContainer.appendChild(legend)
//   }

//   const footerContainer = document.getElementById('footerContainer')
//   if (footerContainer) {
//     const goBackButton = document.createElement('button')
//     goBackButton.classList.add('goBackButton', 'errorButton')
//     goBackButton.textContent = 'Retour'
//     goBackButton.addEventListener('click', function () {
//       window.history.back()
//     })

//     footerContainer.appendChild(goBackButton)
//   }
// })
