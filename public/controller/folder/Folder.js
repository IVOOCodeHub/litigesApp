class Folder {
  constructor() {
    this.folderService = new FolderService()
    this.themeListService = new ThemeListService()
    this.eventService = new EventService()
    this.folderHeader = new FolderHeader()
    this.createNewEvent = new CreateNewEvent()
    this.footer = new Footer()
    this.utils = new Utils()
    this.mailHistory = new MailHistory()
    this.folderHistory = new FolderHistory()
    this.eventList = new EventList()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
    this.credentials = null
    this.eventTypes = null
    this.juridictionTypes = null
    this.isMultiple = 0
    this.bindMailcount = null
    this.selectedEventID = null
    this.selectedEventName = null
  }

  async getParams() {
    const urlParams = new URLSearchParams(window.location.search)
    this.id = urlParams.get('id')
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.folderService.getFolder(this.credentials)
    this.datas = this.datas.find((folder) => folder['cle'] === this.id)
  }

  async bindMailCountIncrementer() {
    if (!this.datas['courriers']) {
      this.bindMailCount = 0
    } else if (Array.isArray(this.datas['courriers']['rows'])) {
      this.bindMailCount = this.datas['courriers']['rows'].length
    } else if (typeof this.datas['courriers']['rows'] === 'object') {
      this.bindMailCount = 1
    } else {
      this.bindMailCount = 0
    }
  }

  async createMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async renderFolder() {
    this.main.innerHTML += `
      <section id="folderContainer">
       
       <!-- LEFT SIDE -->

        <article class="leftArticle">
          <ul class="element">
            <h3>Détails du dossier</h3>
            <li>
              <label>Société :</label>
              <p>${this.datas['societe']}</p>
            </li>
            <li>
              <label for="tiers">Tièrs : </label>
              <p>${this.datas['tiers']}</p>
            </li>
            <li>
              <label for="tiers">Nom : </label>
              <p>${this.datas['societe']} vs ${this.datas['tiers']}</p>
            </li>
            <li>
              <label for="comment">Commentaire : </label>
              <textarea name="comment">${this.datas['commentaire']}</textarea>
            </li>
            <li>
              <label for="conseil">Conseil</label>
              <input name="conseil" type="text" class="conseil" />
            </li>
            <li>
              <label for="theme">Thème</label>
              <select name="theme">
                <option>Choisir</option>
              </select>
            </li>     
            <li class="checkBoxWrapper">
              <label for="isMultiple">Multiple</label>
              <input name="isMultiple" type="checkbox" class="isMultiple"  />
            </li>
            <li>
              <label for="statut">Statut</label>
              <select name="statut">
                <option>Choisir</option>
                <option>A VALIDER</option>
                <option>EN COURS</option>
                <option>AJOURNÉE</option>
                <option>TERMINÉ</option>
              </select>
            </li>
            <li>
              <label for="startDate">Date de début</label>
              <input name="startDate" type="date" class="startDate" />
            </li>
            <li>
              <label for="endDate">Date de fin</label>
              <input name="endDate" type="date" class="endDate" />
            </li>
            <li class="buttonWrapper">
              <button class="validButton submitUpdateFolder">Sauvegarder les modifications</button>
            </li>
          </ul>
        </article>        
        
        <!-- RIGHT SIDE -->        
        
        <article class="rightArticle">
          <!-- HISTORY  -->
          <ul class="historySection">
            <li class="buttonWrapper">
              <button class="button displayMailHistory">Liste des courriers (${this.bindMailCount})</button>
            </li>
            <li class="buttonWrapper">
              <button class="button displayFolderHistory">Liste des dossiers associers</button>
            </li>
             <li class="buttonWrapper">
              <button class="button ">Historique des évènements</button>
            </li>
          </ul>             
          <!-- PREVIOUS EVENT -->        
          <ul class="element" id="lastEventSection">
            <h3>Dernier historique évènement</h3>
            <li class="date">
              <label>Dernier évèment : </label>
              <p>Aucun évènement</p>
            </li>
            <li class="eventType">
              <label>Type d'évènement : </label>
              <p>Aucun évènement</p>
            </li>
            <li class="juridictionType">
              <label>Type de juridiction : </label>
              <p>Aucun évènement</p>
            </li>
            <li class="comment">
              <label>Commentaire : </label>
              <p>Aucun évènement</p>
            </li>
          </ul>
          
          <!-- GEST DOSSIER  -->
        
          <ul class="element">
            <h3>Gestion du dossier</h3>
            <li class="bindEventWrapper">
              <label>Attacher un évènement : </label>
              <button class="button displayBindEventModal">Attacher un évènement</button>
            </li>
            <li>
              <label>Ajouter un évènement : </label>
              <button class="button displayCreateEventModal">Créer un évènement</button>
            </li>
            <li>
              <label>Ajouter une pièce écrite par téléchargement : </label>
              <input name="addMail" type="file"/>
            </li>
            <li class="buttonWrapper">
              <button class="validButton updateEventFolder">Sauvegarder les modifications</button>
            </li>
          </ul>
        </article>
      </section>
    `
  }

  async displayLinkedMail() {
    const goToLinkedMail = document.querySelector('.displayMailHistory')
    goToLinkedMail.addEventListener('click', () =>
      this.mailHistory.initMailHistory(this.id),
    )
  }

  async displayFolderHistory() {
    const goToFolderHistory = document.querySelector('.displayFolderHistory')
    goToFolderHistory.addEventListener('click', () =>
      this.folderHistory.initFolderHistory(this.id),
    )
  }

  async linkEvent() {
    const goToLinkEvent = document.querySelector('.displayBindEventModal')
    goToLinkEvent.addEventListener('click', () =>
      this.eventList.initEventList(this.id),
    )
    document.addEventListener('eventSelected', (event) => {
      this.selectedEventID = event.detail.eventID
      this.selectedEventName = event.detail.eventName
    })
  }

  async insertDatas() {
    const conseilInput = document.querySelector('.conseil')
    if (this.datas['conseil']) {
      conseilInput.value = this.datas['conseil']
    } else {
      conseilInput.value = 'Aucun'
    }

    const themeSelect = document.querySelector(
      '.leftArticle select[name="theme"]',
    )
    const themeList = await this.themeListService.getList(this.credentials)
    themeList.forEach((theme) => {
      if (theme['actif'] === '1') {
        themeSelect.innerHTML += `
        <option value="${theme['theme']}">${theme['theme']}</option>
      `
        if (this.datas['theme'] === theme['theme']) {
          themeSelect.value = theme['theme']
        }
      }
    })

    const isMultiple = this.datas['multiple']
    if (isMultiple === '1') {
      this.isMultiple = 1
      const checkBox = document.querySelector('.isMultiple')
      checkBox.checked = true

      const isChecked = checkBox.checked
      if (isChecked) {
        const newElement = document.createElement('li')
        newElement.setAttribute('class', 'inputWrapper multipleFolder')
        newElement.innerHTML += `
          <label>Dossier rattaché : </label>
          <input type="text" name="linkedFolder" value="${this.datas['cle_parent']}" />
        `

        const checkBoxWrapper = document.querySelector('.checkBoxWrapper')
        checkBoxWrapper.insertAdjacentElement('afterend', newElement)
      }
    }

    const statusSelect = document.querySelector(
      '.leftArticle select[name="statut"]',
    )
    statusSelect.value = this.datas['statut']

    if (this.datas['datedebut']) {
      const startDate = new Date(this.datas['datedebut'])
      const dateDebutInput = document.querySelector('.startDate')
      dateDebutInput.value = startDate.toISOString().split('T')[0]
    }

    if (this.datas['datefin']) {
      const endDate = new Date(this.datas['datefin'])
      const dateFinInput = document.querySelector('.endDate')
      dateFinInput.value = endDate.toISOString().split('T')[0]
    }
  }

  async insertLastEventDatas(datas) {
    await this.readDictionary()

    const lastEventDate = document.querySelector('#lastEventSection .date p')
    lastEventDate.textContent = this.utils.reformatDate(datas['datederevent'])

    const eventType = document.querySelector('#lastEventSection .eventType p')
    const getEventType = this.eventTypes.find(
      (eventType) => eventType['type'] === datas['event_type'],
    )
    eventType.textContent = getEventType['libelle']

    const juridictionType = document.querySelector(
      '#lastEventSection .juridictionType p',
    )
    const getJuridictionType = this.juridictionTypes.find(
      (juridictionType) =>
        juridictionType['type'] === datas['juridiction_type'],
    )
    juridictionType.textContent = getJuridictionType['libelle']

    const comment = document.querySelector('#lastEventSection .comment p')
    comment.textContent = datas['commentaire']
  }

  async readDictionary() {
    this.eventTypes = JSON.parse(localStorage.getItem('eventTypes'))
    this.juridictionTypes = JSON.parse(localStorage.getItem('juridictionTypes'))
  }

  async isMultiples() {
    const checkBox = document.querySelector('.isMultiple')
    checkBox.addEventListener('change', (event) => {
      event.preventDefault()

      const isChecked = checkBox.checked
      if (isChecked) {
        this.isMultiple = 1
        const newElement = document.createElement('li')
        newElement.setAttribute('class', 'inputWrapper multipleFolder')
        newElement.innerHTML += `
          <label>Dossier rattaché : </label>
          <input type="text" name="linkedFolder" />
        `

        const checkBoxWrapper = document.querySelector('.checkBoxWrapper')
        checkBoxWrapper.insertAdjacentElement('afterend', newElement)
      } else {
        this.isMultiple = 0
        const selectMultipleFolder = document.querySelector('.multipleFolder')
        selectMultipleFolder.remove()
      }
    })
  }

  async submitUpdateFolder() {
    const newDatas = {
      cle: this.datas['cle'],
      ...this.datas,
    }

    const commentaireInput = document.querySelector('textarea[name="comment"]')
    if (commentaireInput.value !== this.datas['commentaire']) {
      console.log('commentaireInput update true')
      newDatas['commentaire'] = commentaireInput.value
    }

    const conseilInput = document.querySelector('input[name="conseil"]')
    if (conseilInput.value !== this.datas['conseil']) {
      newDatas['conseil'] = conseilInput.value
    }

    const themeSelect = document.querySelector('select[name="theme"]')
    if (themeSelect.value !== this.datas['theme']) {
      newDatas['theme'] = themeSelect.value
    }

    const isMultipleCheckbox = document.querySelector(
      'input[name="isMultiple"]',
    )
    const isMultipleValue = isMultipleCheckbox.checked ? '1' : '0'
    if (isMultipleValue !== this.datas['multiple']) {
      newDatas['multiple'] = isMultipleValue
    }

    const statutSelect = document.querySelector('select[name="statut"]')
    if (statutSelect.value !== this.datas['statut']) {
      newDatas['statut'] = statutSelect.value
    }

    const dateDebutInput = document.querySelector('input[name="startDate"]')
    if (dateDebutInput.value !== this.datas['datedebut']) {
      newDatas['datedebut'] = new Date(dateDebutInput.value)
    }

    const dateEndInput = document.querySelector('input[name="endDate"]')
    if (dateEndInput.value !== this.datas['endDate']) {
      newDatas['datefin'] = new Date(dateEndInput.value)
    }

    Object.keys(newDatas).forEach((key) => {
      if (typeof newDatas[key] === 'string' && newDatas[key].includes('T')) {
        newDatas[key] = new Date(newDatas[key])
      }
    })

    await this.folderService.createEditFolder(this.credentials, newDatas)
    window.location.reload()
  }

  async submitEventUpdate() {
    const submitButton = document.querySelector('.updateEventFolder')
    submitButton.addEventListener('click', async () => {
      await this.eventService.bindEventToFolder(
        this.credentials,
        this.selectedEventID,
        this.id,
      )
      window.location.reload()
    })
  }

  async initEventListeners() {
    await this.isMultiples()

    const submitUpdateFolderBtn = document.querySelector('.submitUpdateFolder')
    submitUpdateFolderBtn.addEventListener('click', async () => {
      await this.submitUpdateFolder()
      window.location.reload()
    })


    const createNewEventButton = document.querySelector(
      '.displayCreateEventModal',
    )
    createNewEventButton.addEventListener('click', () =>
      this.createNewEvent.initCreateNewEvent(),
    )

    await this.submitEventUpdate()
    await this.displayLinkedMail()
    await this.displayFolderHistory()
    await this.linkEvent()
  }



  async initFolder() {
    await this.getParams()
    await this.getDatas()
    await this.bindMailCountIncrementer()
    await this.createMain()
    await this.folderHeader.initFolderHeader(this.datas)
    await this.renderFolder()
    await this.insertDatas()
    if (this.datas['last_event']) {
      await this.insertLastEventDatas(this.datas['last_event'])
    }
    await this.footer.initFooter()
    await this.initEventListeners()
  }
}

const folder = new Folder()
folder
  .initFolder()
  .then(() => {
    console.log(`Folder successfully loaded at : ${folder.utils.getDate()}`)
  })
  .catch((err) =>
    console.error(
      `Folder failed to load : ${err} at : ${folder.utils.getDate()}`,
    ),
  )
