document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar')

  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'fr',
    initialDate: '2024-05-01',
    editable: true,
    selectable: true,
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
        title: 'All Day Event',
        start: '2024-05-01',
      },
      {
        title: 'Long Event',
        start: '2024-05-06',
        end: '2024-05-10',
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2024-05-09T16:00:00',
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2024-05-16T16:00:00',
      },
      {
        title: 'Conference',
        start: '2024-05-11',
        end: '2024-05-13',
      },
      {
        title: 'Meeting',
        start: '2024-05-12T10:30:00',
        end: '2024-05-12T12:30:00',
      },
      {
        title: 'Lunch',
        start: '2024-05-12T12:00:00',
      },
      {
        title: 'Meeting',
        start: '2024-05-12T14:30:00',
      },
      {
        title: 'Happy Hour',
        start: '2024-05-12T17:30:00',
      },
      {
        title: 'Dinner',
        start: '2024-05-12T20:00:00',
      },
      {
        title: 'Birthday Party',
        start: '2024-05-13T07:00:00',
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2024-05-28',
      },
    ],
    eventSources: ['http://192.168.0.112/Public/ndecr_test/calendrier.php'],
  })
  const retrievedEvents = calendar.getEvents()
  console.log('évènements :', retrievedEvents)
  calendar.render()
})
