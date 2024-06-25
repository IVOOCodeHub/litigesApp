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
    this.eventsDatas.forEach((event) => {
      const findEventType = this.eventsDictionary.find(
        (type) => type['type'] === event['event_type'],
      )
      const findNextEventType = this.eventsDictionary.find(
        (type) => type['type'] === event['next_event'],
      )
      const eventTypeConverted = findEventType['libelle']
      const nextEventTypeConverted = findNextEventType['libelle']

      tbody.innerHTML += `
        <tr>
          <td>${event['cle']}</td>
          <td>${event['cle_litige_dossier']}</td>
          <td>${eventTypeConverted}</td>
          <td>${this.utils.reformatDate(event['datenextevent']).split(' ')[0]}</td>
          <td>${event['lieu_juridiction']}</td>
          <td>${event['action']}</td>
          <td>${event['commentaire']}</td>
        </tr>
      `
    })
  }

  async destroyComponent() {
    const section = document.querySelector('#eventListModal')
    section.remove()
  }

  async initEventListeners() {
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
