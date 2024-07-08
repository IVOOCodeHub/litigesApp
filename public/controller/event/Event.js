class Event {
  constructor() {
    this.eventService = new EventService()
    this.utils = new Utils()
    this.footer = new Footer()
    this.createNewEvent = new CreateNewEvent()
    this.alert = new Alert()
    this.main = null
    this.root = document.querySelector('#root')
    this.credentials = null
    this.datas = null
    this.eventsDictionary = JSON.parse(localStorage.getItem('eventTypes'))
    this.juridictionDictionary = JSON.parse(
      localStorage.getItem('juridictionTypes'),
    )
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.eventService.getEvent(this.credentials)
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

  async insertDatas() {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''

    this.datas?.forEach((event) => {
      const findEventType = this.eventsDictionary.find(
        (type) => type['type'] === event['event_type'],
      )
      const findNextEventType = this.eventsDictionary.find(
        (type) => type['type'] === event['next_event'],
      )
      const findJuridictionType = this.juridictionDictionary.find(
        (type) => type['type'] === event['juridiction_type'],
      )
      const findNextJuridictionType = this.juridictionDictionary.find(
        (type) => type['type'] === event['next_juridiction_type'],
      )
      const eventTypeConverted = findEventType['libelle']
      const nextEventTypeConverted = findNextEventType['libelle']
      const juridictionTypeConverted = findJuridictionType['libelle']
      const nextJuridictionTypeConverted = findNextJuridictionType['libelle']

      tableBody.innerHTML += `
        <tr>
          <td>${event['cle']}</td>
          <td>${event['cle_litige_dossier']}</td>
          <td>${event['action']}</td>
          <td>${eventTypeConverted}</td>
          <td>${juridictionTypeConverted}</td>
          <td>${event['lieu_juridiction']}</td>
          <td>${this.utils.reformatDate(event['datederevent'])}</td>
          <td>${event['commentaire']}</td>
          <td>${nextEventTypeConverted}</td>
          <td>${nextJuridictionTypeConverted}</td>
          <td>${this.utils.reformatDate(event['datenextevent'])}</td>
        </tr>      
      `
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
          const resultFromAction = await this.datas.filter(
            (row) => row['action'].trim() === htmlElementValue,
          )
          resultFromAction
            ? (newDatas = resultFromAction)
            : (newDatas = this.datas)
        } else {
          // TODO : Les recherches ne fonctionnes pas pour le moment. (En cas de vide, pas de changement visuel)
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
      case 'lastEventDate':
        if (htmlElementValue !== '') {
          const resultFromLastEventDate = await this.datas.filter(
            (row) => row['datederevent'].trim() === htmlElementValue,
          )
          resultFromLastEventDate
            ? (newDatas = resultFromLastEventDate)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'nextEventDate':
        if (htmlElementValue !== '') {
          const resultFromNextEventDate = await this.datas.filter(
            (row) => row['datenextevent'].trim() === htmlElementValue,
          )
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

  async initEventListeners() {
    await this.searchBy('key')
    await this.searchBy('action')
    await this.searchBy('type')
    await this.searchBy('previousEventDate')
    await this.searchBy('nextEventDate')
  }

  async initValidation() {
    await this.getDatas()
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.insertDatas()
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
