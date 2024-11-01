class Event {
  constructor() {
    this.eventService = new EventService()
    this.createNewEvent = new CreateNewEvent()
    this.utils = new Utils()
    this.footer = new Footer()
    this.alert = new Alert()
    this.folderList = new FolderList()
    this.main = null
    this.root = document.querySelector('#root')
    this.credentials = null
    this.datas = null
    this.eventsDictionary = JSON.parse(localStorage.getItem('eventTypes'))
    this.juridictionDictionary = JSON.parse(
      localStorage.getItem('juridictionTypes'),
    )
    this.selectedFolderID = null
    this.calendar = null
  }

  setCalendarInstance(calendarInstance) {
    this.calendar = calendarInstance
  }

  // Fonction de récupération des données
  async getDatas() {
    const user = JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user.matricule,
      password: user.mdp,
    }
    this.datas = await this.eventService.readEvent(this.credentials)
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  // async insertDatas(datas = this.datas) {
  //   const tableBody = document.querySelector('table tbody')
  //   tableBody.innerHTML = ''

  //   // Supprime tous les événements existants
  //   calendar.removeAllEvents()

  //   datas.forEach((event) => {
  //     const eventType = this.eventsDictionary.find(
  //       (type) => type.type === event.event_type,
  //     )
  //     const nextEventType = this.eventsDictionary.find(
  //       (type) => type.type === event.next_event,
  //     )

  //     const eventTypeConverted = eventType ? eventType.libelle : ''
  //     const nextEventTypeConverted = nextEventType ? nextEventType.libelle : ''

  //     // Remplir le tableau HTML
  //     tableBody.innerHTML += `
  //       <tr>
  //         <td>${event.cle}</td>
  //         <td>${event.commentaire}</td>
  //         <td>${eventTypeConverted}</td>
  //         <td>${this.utils.reformatDate(event.datederevent)}</td>
  //         <td>${''}</td>
  //         <td>${nextEventTypeConverted}</td>
  //         <td>${this.utils.reformatDate(event.datenextevent)}</td>
  //       </tr>
  //     `

  //     // Ajouter l'événement au calendrier
  //     calendar.addEvent({
  //       title: eventTypeConverted,
  //       start: event.datederevent,
  //       end: event.datenextevent || null,
  //       backgroundColor: this.getEventColor(event.event_type),
  //     })
  //   })
  // }

  async initForm() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchEvent')

    section.innerHTML = `
    <div class="inputWrapper">
        <label for="key">Clé: </label>
        <input type="text" name="key" />
    </div>
    <div class="inputWrapper">
        <label for="action">Stade: </label>
        <select name="action">
          <option value="Choisir">Choisir</option>  
          <option>Pré-contentieux</option>
          <option>Contentieux</option>
          <option>Éxecution</option>        
        </select>
    </div>
    <div class="inputWrapper">
        <label for="type">Type d'évènement: </label>
        <select name="type">
          <option value="Tous">Tous</option>          
        </select>
    </div>
    <div class="inputWrapper">
        <label for="previousEventDate">Date du dernier évènement: </label>
        <input type="date" name="previousEventDate" />
    </div>
    <div class="inputWrapper">
        <label for="nextEventDate">Date du prochain évènement: </label>
        <input type="date" name="nextEventDate" />
    </div>
  `
    this.main.appendChild(section)
  }

  async initTable() {
    const section = document.createElement('section')
    section.setAttribute('id', 'tableContainer')
    section.innerHTML = `
      <table>
        <thead>
            <tr>
              <th>Clé</th>
              <th>Dossier de l'évènement</th>
              <th>Stade</th>
              <th>Évènement</th>
              <th>Juridiction</th>
              <th>Lieu</th>
              <th>Date de création</th>
              <th>Commentaire</th>
              <th>Prochain évènement</th>
              <th>Prochaine juridiction</th>
              <th>Date de l'évènement suivant</th>
            </tr>
        </thead>
        <tbody></tbody>
      </table>
  `
    this.main.appendChild(section)
  }

  async insertDatas(datas = this.datas) {
    const tableBody = document.querySelector('table tbody')
    if (!tableBody) {
      console.error(
        "Élément 'tbody' introuvable. Vérifiez que la table est bien initialisée.",
      )
      return
    }

    tableBody.innerHTML = '' // Vide le tableau actuel

    // Supprime tous les événements existants dans le calendrier
    this.calendar.removeAllEvents()

    datas.forEach((event) => {
      const eventType = this.eventsDictionary.find(
        (type) => type.type === event.event_type,
      )
      const nextEventType = this.eventsDictionary.find(
        (type) => type.type === event.next_event,
      )

      const eventTypeConverted = eventType ? eventType.libelle : ''
      const nextEventTypeConverted = nextEventType ? nextEventType.libelle : ''

      // Ajouter les lignes de données au tableau HTML
      tableBody.innerHTML += `
            <tr>
                <td>${event.cle}</td>
                <td>${event.commentaire}</td>
                <td>${eventTypeConverted}</td>
                <td>${this.utils.reformatDate(event.datederevent)}</td>
                <td>${''}</td>
                <td>${nextEventTypeConverted}</td>
                <td>${this.utils.reformatDate(event.datenextevent)}</td>
            </tr>
        `

      // Ajouter l'événement au calendrier FullCalendar
      this.calendar.addEvent({
        title: eventTypeConverted,
        start: event.datederevent,
        end: event.datenextevent || null,
        backgroundColor: this.getEventColor(event.event_type),
      })
    })
  }

  // Fonction de filtrage des événements en fonction de la sélection
  async searchFromSelect(htmlElement) {
    const htmlElementName = htmlElement.name
    const htmlElementValue = htmlElement.value
    let newDatas = this.datas

    switch (htmlElementName) {
      case 'key':
        if (htmlElementValue) {
          newDatas = newDatas.filter(
            (row) => row.cle.trim() === htmlElementValue,
          )
        }
        break
      case 'action':
        if (htmlElementValue !== 'Choisir') {
          newDatas = newDatas.filter(
            (row) => row.action.trim() === htmlElementValue,
          )
        }
        break
      case 'type':
        if (htmlElementValue !== 'Tous') {
          const selectedType = this.eventsDictionary.find(
            (label) => label.libelle.trim() === htmlElementValue.trim(),
          )
          if (selectedType) {
            newDatas = newDatas.filter(
              (row) => row.event_type === selectedType.type,
            )
          }
        }
        break
      case 'previousEventDate':
        if (htmlElementValue) {
          newDatas = newDatas.filter(
            (row) =>
              this.utils.reformatDate(row.datederevent) ===
              this.utils.reformatDate(htmlElementValue),
          )
        }
        break
      case 'nextEventDate':
        if (htmlElementValue) {
          newDatas = newDatas.filter(
            (row) =>
              this.utils.reformatDate(row.datenextevent) ===
              this.utils.reformatDate(htmlElementValue),
          )
        }
        break
    }

    await this.insertDatas(newDatas) // Mettre à jour le tableau et le calendrier avec les données filtrées
  }

  async searchBy(elementName) {
    const htmlElement = document.querySelector(`[name="${elementName}"]`)
    htmlElement.addEventListener(
      'change',
      async () => await this.searchFromSelect(htmlElement),
    )
  }

  async initValidation(calendarInstance) {
    this.setCalendarInstance(calendarInstance)
    await this.getDatas()
    await this.initMain()
    await this.initForm()
    await this.initTable() // Assurez-vous que la table est initialisée avant d'insérer les données
    await this.insertDatas(this.datas) // Insérez les données après la création de la table
    await this.insertSelect()
    await this.footer.initFooter()
    await this.createNewEventButton()
    await this.initEventListeners()
  }

  getEventColor(eventType) {
    const eventCategory = this.eventsDictionary.find(
      (type) => type.type === eventType,
    )
    return eventCategory ? eventCategory.color : '#3788d8'
  }
}

const validation = new Event()
validation.initValidation()
