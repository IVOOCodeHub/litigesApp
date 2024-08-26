class EventList {
  constructor() {
    this.eventService = new EventService()
    this.utils = new Utils()
    this.main = null
    this.userCredentials = null
    this.eventsDictionary = JSON.parse(localStorage.getItem('eventTypes'))
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }

    this.eventsDatas = await this.eventService.getEvent(this.userCredentials)
    console.log('this.eventsDatas —>', this.eventsDatas)
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderSearchBar() {
    const section = document.createElement('section')
    section.setAttribute('id', 'eventListModal')

    this.main.appendChild(section)
  }

  async insertSelect() {}

  async createTable() {
    const section = document.querySelector('#eventListModal')
    const sectionTitle = document.createElement('h2')
    sectionTitle.textContent = 'Liste des évènements'
    const destroyComponentButton = document.createElement('button')
    destroyComponentButton.textContent = 'Annuler'
    destroyComponentButton.classList.add('errorButton')
    destroyComponentButton.classList.add('eventListDestroy')

    const tableContainer = document.createElement('div')
    tableContainer.setAttribute('class', 'tableContainer')
    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th data-sort="cle">Cle <span class="chevron"></span></th>
            <th data-sort="folderBind">Dossier <span class="chevron"></span></th>
            <th data-sort="type">Type <span class="chevron"></span></th>
            <th data-sort="datenextevent">Date de prochain évènement <span class="chevron"></span></th>
            <th data-sort="lieu_juridiction">Lieu de juridiction<span class="chevron"></span></th>
            <th data-sort="action">Action <span class="chevron"></span></th>
            <th data-sort="commentaire">Commentaire<span class="chevron"></span></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `

    section.appendChild(sectionTitle)
    section.appendChild(tableContainer)
    section.appendChild(destroyComponentButton)
  }

  async insertDatas() {
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''

    // Traiter les événements en vérifiant si des sous-tableaux existent
    const events = Array.isArray(this.eventsDatas)
      ? this.eventsDatas
      : [this.eventsDatas]

    events.forEach((event) => {
      const subEvents = Array.isArray(event) ? event : [event]

      subEvents.forEach((singleEvent) => {
        const findEventType = this.eventsDictionary.find(
          (type) => type['type'] === singleEvent['event_type'],
        )
        const findNextEventType = this.eventsDictionary.find(
          (type) => type['type'] === singleEvent['next_event'],
        )
        const eventTypeConverted = findEventType ? findEventType['libelle'] : ''
        const nextEventTypeConverted = findNextEventType
          ? findNextEventType['libelle']
          : ''

        tbody.innerHTML += `
        <tr>
          <td>${singleEvent['cle']}</td>
          <td>${singleEvent['cle_litige_dossier']}</td>
          <td>${eventTypeConverted}</td>
          <td>${this.utils.reformatDate(singleEvent['datenextevent']).split(' ')[0]}</td>
          <td>${singleEvent['lieu_juridiction']}</td>
          <td>${singleEvent['action']}</td>
          <td>${singleEvent['commentaire']}</td>
        </tr>
      `
      })
    })
  }

  async selectEvent() {
    const rows = document.querySelectorAll('tr')

    rows.forEach((row) => {
      row.addEventListener('click', async () => {
        const selectedEventID = row.firstElementChild.textContent
        const selectedEventName = row.children[1].textContent

        // return the ID on the component Folder.js who's send the values to backend
        const event = new CustomEvent('eventSelected', {
          detail: { folderID: selectedEventID },
        })
        document.dispatchEvent(event)

        await this.isEventSelected(selectedEventID, selectedEventName)
        await this.destroyComponent()
      })
    })
  }

  async isEventSelected(selectedEventID, selectedEventName) {
    if (selectedEventID) {
      const isAlreadySelected = document.querySelector(
        '.selectedEventContainer',
      )
      if (isAlreadySelected) {
        isAlreadySelected.remove()
      }

      const url = new URL(window.location.href)
      switch (true) {
        case url.pathname.includes(`folder.html`):
          {
            // create new HTMLElement in Folder.js / folder.html
            const editFolder = document.querySelector('.bindEventWrapper')
            const displaySelectedEvent = document.createElement('li')
            displaySelectedEvent.classList.add('selectedEventContainer')
            displaySelectedEvent.innerHTML = `
            <label>Clé de l'évènement sélectionné : </label>
            <p>${selectedEventID}</p>
          `
            editFolder.insertAdjacentElement('afterend', displaySelectedEvent)
          }
          break

        case url.pathname.endsWith('/createNewEvent.html'):
          {
            // Create new HTMLElement in CreateNewEvent.js / createNewEvent.html
            const createNewEventForm =
              document.querySelector('#createEvent form')
            const displayEventSelectedFolder = document.createElement('li')
            displayEventSelectedFolder.classList.add('inputWrapper')
            displayEventSelectedFolder.innerHTML = `
            <label>Clé de l'évènement sélectionné : </label>
            <p>${selectedEventID}</p>
          `
            createNewEventForm.appendChild(displayEventSelectedFolder)
          }
          break
      }
    }
  }

  async destroyComponent() {
    const section = document.querySelector('#eventListModal')
    section.remove()
  }

  async initEventListeners() {
    await this.selectEvent()
    const cancelButton = document.querySelector(
      '#eventListModal .eventListDestroy',
    )
    cancelButton.addEventListener('click', async () => this.destroyComponent())
  }

  async initEventList(folderID) {
    await this.getDatas()
    await this.initMain()
    await this.renderSearchBar()
    await this.insertSelect()
    await this.createTable()
    await this.insertDatas(this.eventsDatas)
    await this.initEventListeners()
  }
}
