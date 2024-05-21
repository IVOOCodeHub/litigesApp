document.addEventListener('DOMContentLoaded', function () {
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
      },
      {
        title: "Cour administrative d'appel de Poitiers ",
        start: '2024-05-06',
        end: '2024-05-10',
      },
      {
        groupId: 999,
        title: 'convocation recours',
        start: '2024-05-09T16:00:00',
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
  console.log('évènements :', retrievedEvents)
  calendar.render()

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
