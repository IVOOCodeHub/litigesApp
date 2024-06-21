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
    this.eventsDictionary = JSON.parse(localStorage.getItem('eventTypes')) // events dictionary
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
        <label for="name">Nom: </label>
        <select name="name">
          <option value="Choisir">Choisir</option>          
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
                <th>Commentaire</th>
                <th>Type d'évènement</th>
                <th>Date dernier évènement</th>
                <th>État</th>
                <th>Prochain évènement</th>
                <th>Date prochain évènement</th>
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
      const eventTypeConverted = findEventType['libelle']
      const nextEventTypeConverted = findNextEventType['libelle']

      tableBody.innerHTML += `
        <tr>
          <td>${event['cle']}</td>
          <td>${event['commentaire']}</td>
          <td>${eventTypeConverted}</td>
          <td>${this.utils.reformatDate(event['datederevent'])}</td>
          <td>${''}</td>
          <td>${nextEventTypeConverted}</td>
          <td>${this.utils.reformatDate(event['datenextevent'])}</td>
        </tr>      
      `
    })
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value
    let newDatas = null
    if (htmlSelectElement.name === 'key') {
      if (selectedValue !== '') {
        newDatas = this.datas.filter(
          (row) => row['key'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'name') {
      if (selectedValue !== 'Choisir') {
        newDatas = this.datas.filter(
          (row) => row['name'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'type') {
      if (selectedValue !== 'Tous') {
        newDatas = this.datas.filter(
          (row) => row['type'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'previousEventDate') {
      if (selectedValue !== '') {
        newDatas = this.datas.filter(
          (row) => row['previousEventDate'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'nextEventDate') {
      if (selectedValue !== '') {
        newDatas = this.datas.filter(
          (row) =>
            this.utils.reformatDate(row['nextEventDate']).split(' ')[0] ===
            this.utils.reformatDate(selectedValue).split(' ')[0],
        )
      } else {
        newDatas = this.datas
      }
    }

    await this.insertDatas(newDatas)
  }

  async searchBy(elementName) {
    const select = document.querySelector(`[name="${elementName}"]`)
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async insertSelect() {
    const nameSelectOption = []
    const typeSelectOption = []
    this.datas.forEach((el) => {
      if (!nameSelectOption.includes(el['name'])) {
        nameSelectOption.push(el['name'])
      }
      if (!typeSelectOption.includes(el['type']))
        typeSelectOption.push(el['type'])
    })

    const nameSelect = document.querySelector('select[name="name"]')
    nameSelectOption.forEach((name) => {
      nameSelect.innerHTML += `
        <option>${name}</option>
      `
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
    await this.searchBy('name')
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
