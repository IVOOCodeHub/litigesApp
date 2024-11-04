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

// test avec fetch des datas pour le calendrier

document.addEventListener('DOMContentLoaded', async function () {
  const eventService = new EventService()
  let userCredentials = null
  let eventsDatas = []

  // Récupérer les informations d'authentification de l'utilisateur
  async function getDatas() {
    const user = JSON.parse(localStorage.getItem('user'))
    userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    eventsDatas = await eventService.getEvent(userCredentials)
  }

  // Charger et afficher les événements dans le calendrier
  async function fetchEventsForCalendar() {
    await getDatas() // Récupère les événements depuis l'API

    const events = eventsDatas.flat().map((singleEvent) => ({
      title: singleEvent['event_type'] || 'Événement',
      start: singleEvent['datederevent'],
      end: singleEvent['datenextevent'] || null,
      color: singleEvent['color'] || '#3788d8',
    }))

    // Configuration et rendu du calendrier
    const calendarEl = document.getElementById('calendar')
    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'fr',
      initialDate: '2024-05-01',
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
      events: events,
    })

    calendar.render()
  }

  // Exécute la fonction pour charger les événements
  await fetchEventsForCalendar()
})
