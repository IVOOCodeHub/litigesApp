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
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.eventService.readEvent(this.credentials)
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

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
    section.innerHTML += `
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
                <th>Prochaine évènement</th>
                <th>Prochaine juridiction</th>
                <th>Date de l'évènement suivant</th>
              </tr>
          </thead>
          <tbody></tbody>
        </table>
    `
    this.main.appendChild(section)
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''

    datas?.forEach((event) => {
      const events = Array.isArray(event) ? event : [event]

      events.forEach((singleEvent) => {
        const findEventType = this.eventsDictionary.find(
          (type) => type['type'] === singleEvent['event_type'],
        )
        const findNextEventType = this.eventsDictionary.find(
          (type) => type['type'] === singleEvent['next_event'],
        )
        const findJuridictionType = this.juridictionDictionary.find(
          (type) => type['type'] === singleEvent['juridiction_type'],
        )
        const findNextJuridictionType = this.juridictionDictionary.find(
          (type) => type['type'] === singleEvent['next_juridiction_type'],
        )

        const eventTypeConverted = findEventType ? findEventType['libelle'] : ''
        const nextEventTypeConverted = findNextEventType
          ? findNextEventType['libelle']
          : ''
        const juridictionTypeConverted = findJuridictionType
          ? findJuridictionType['libelle']
          : ''
        const nextJuridictionTypeConverted = findNextJuridictionType
          ? findNextJuridictionType['libelle']
          : ''

        tableBody.innerHTML += `
        <tr>
          <td>${singleEvent['cle']}</td>
          <td>
              ${
                singleEvent['cle_litige_dossier'] !== '' &&
                singleEvent['cle_litige_dossier'] !== '0'
                  ? singleEvent['cle_litige_dossier']
                  : '<button class="button attachFolder">Attacher à un dossier</button>'
              }
          </td>
          <td>${singleEvent['action']}</td>
          <td>${eventTypeConverted}</td>
          <td>${juridictionTypeConverted}</td>
          <td>${singleEvent['lieu_juridiction'] ? singleEvent['lieu_juridiction'] : 'Non renseigné'}</td>
          <td>${this.utils.reformatDate(singleEvent['datederevent'])}</td>
          <td>${singleEvent['commentaire']}</td>
          <td>${nextEventTypeConverted}</td>
          <td>${nextJuridictionTypeConverted}</td>
          <td>${this.utils.reformatDate(singleEvent['datenextevent'])}</td>
        </tr>
      `
      })
    })
  }

  async searchFromSelect(htmlElement) {
    const htmlElementName = htmlElement.name
    const htmlElementValue = htmlElement.value
    let newDatas = null

    switch (htmlElementName) {
      case 'key':
        if (htmlElementValue !== '') {
          const resultFromValue = await this.datas.filter(
            (row) => row['cle'].trim() === htmlElementValue,
          )
          resultFromValue
            ? (newDatas = resultFromValue)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'action':
        if (htmlElementValue !== 'Choisir') {
          const resultFromAction = await this.datas.filter((row) => {
            return row['action'].trim() === htmlElementValue
          })
          resultFromAction
            ? (newDatas = resultFromAction)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'type':
        if (htmlElementValue !== 'Tous') {
          const resultFromType = await this.datas.filter((row) => {
            const getTypeFromDictionary = this.eventsDictionary.find(
              (label) => {
                return htmlElementValue.trim() === label['libelle'].trim()
              },
            )
            return row['event_type'] === getTypeFromDictionary['type']
          })
          resultFromType ? (newDatas = resultFromType) : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'previousEventDate':
        if (htmlElementValue !== '') {
          const resultFromLastEventDate = await this.datas.filter((row) => {
            return (
              this.utils.reformatDate(row['datederevent']) ===
              this.utils.reformatDate(htmlElementValue)
            )
          })
          resultFromLastEventDate
            ? (newDatas = resultFromLastEventDate)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'nextEventDate':
        if (htmlElementValue !== '') {
          const resultFromNextEventDate = await this.datas.filter((row) => {
            return (
              this.utils.reformatDate(row['datenextevent']) ===
              this.utils.reformatDate(htmlElementValue)
            )
          })
          resultFromNextEventDate
            ? (newDatas = resultFromNextEventDate)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
    }

    await this.insertDatas(newDatas)
  }

  async searchBy(elementName) {
    const htmlElement = document.querySelector(`[name="${elementName}"]`)
    htmlElement.addEventListener(
      'change',
      async () => await this.searchFromSelect(htmlElement),
    )
  }

  async insertSelect() {
    const typeSelectOption = []
    this.eventsDictionary.forEach((event) => {
      typeSelectOption.push(event['libelle'])
    })
    typeSelectOption.sort((a, b) => a.localeCompare(b))
    const typeSelect = document.querySelector('select[name="type"]')
    typeSelectOption.forEach((type) => {
      typeSelect.innerHTML += `
        <option>${type}</option>
      `
    })
  }

  async createNewEventButton() {
    const btnWrapper = document.querySelector('footer .buttonWrapper')
    const createdBtn = document.createElement('button')
    createdBtn.classList.add('validButton')
    createdBtn.textContent = 'Crée un évènement'
    createdBtn.addEventListener('click', () =>
      this.createNewEvent.initCreateNewEvent(),
    )

    btnWrapper.appendChild(createdBtn)
  }

  async displayFolders(eventKey, htmlButtonElement) {
    htmlButtonElement.classList.add('selectedEventButton')
    htmlButtonElement.addEventListener('click', async () => {
      await this.folderList.initFolderList(eventKey)
    })
    document.addEventListener('folderSelected', (event) => {
      this.selectedFolderID = event.detail.folderID
    })
  }

  async initEventListeners() {
    await this.searchBy('key')
    await this.searchBy('action')
    await this.searchBy('type')
    await this.searchBy('previousEventDate')
    await this.searchBy('nextEventDate')

    // search for the attachFolder button if it exists, and attach the listener to it
    const rows = document.querySelectorAll('tbody tr')
    rows.forEach((row) => {
      if (row.children[1].firstElementChild) {
        const eventKey = row.children[0].textContent // get the eventKey for update the event
        const attachFolderButton =
          row.children[1].querySelector('.attachFolder')
        this.displayFolders(eventKey, attachFolderButton)
      }
    })
  }

  async initValidation() {
    await this.getDatas()
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.insertDatas(this.datas)
    await this.insertSelect()
    await this.footer.initFooter()
    await this.createNewEventButton()
    await this.initEventListeners()
  }
}

const validation = new Event()
validation
  .initValidation()
  .then(() =>
    console.log(
      `Validation successfully loaded at : ${validation.utils.getDate()}`,
    ),
  )
  .catch((err) =>
    console.error(
      `Validation failed to load : ${err} at : ${validation.utils.getDate()}`,
    ),
  )
