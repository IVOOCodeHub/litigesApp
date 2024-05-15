document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar')

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['dayGrid', 'timeGrid'],
    events: 'https://fullcalendar.io/demo-events.json?overload-day',
    header: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next',
    },
    footer: {
      left: '',
      center: '',
      right: 'prev,next',
    },
    customButtons: {
      prev: {
        text: 'Prev',
        click: function () {
          // so something before
          toastr.warning('PREV button is going to be executed')
          // do the original command
          calendar.prev()
          // do something after
          toastr.warning('PREV button executed')
        },
      },
      next: {
        text: 'Next',
        click: function () {
          // so something before
          toastr.success('NEXT button is going to be executed')
          // do the original command
          calendar.next()
          // do something after
          toastr.success('NEXT button executed')
        },
      },
    },
  })

  calendar.render()
})

// events: [
//       {
//         id: '1',
//         resourceId: 'b',
//         start: '2018-02-07T02:00:00',
//         end: '2018-02-07T07:00:00',
//         title: 'event 1',
//       },
//       {
//         id: '2',
//         resourceId: 'c',
//         start: '2018-02-07T05:00:00',
//         end: '2018-02-07T22:00:00',
//         title: 'event 2',
//       },
//       {
//         id: '3',
//         resourceId: 'd',
//         start: '2018-02-06',
//         end: '2018-02-08',
//         title: 'event 3',
//       },
//       {
//         id: '4',
//         resourceId: 'e',
//         start: '2018-02-07T03:00:00',
//         end: '2018-02-07T08:00:00',
//         title: 'event 4',
//       },
//       {
//         id: '5',
//         resourceId: 'f',
//         start: '2018-02-07T00:30:00',
//         end: '2018-02-07T02:30:00',
//         title: 'event 5',
//       },
//     ],
