class CreateNewEvent {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.eventService = new EventService()
    this.folderList = new FolderList()
    this.main = null
    this.eventDictionary = JSON.parse(localStorage.getItem('eventTypes'))
    this.juridictionDictionary = JSON.parse(
      localStorage.getItem('juridictionTypes'),
    )
    this.selectedFolderID = null
  }

  async renderSection() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'createEvent')
    section.innerHTML += `
      <form>
        <h2>Crée un nouvel évènement</h2>
        
        <!-- boundTo -->
        <div class="buttonWrapper">
            <button class="button displayFolder">Choisir un dossier à associer à l'évènement</button>
        </div>        
        
        <!-- stade (action in database) -->
        
        <div class="radioBtnContainer">
          <label class="bold">Stade</label>
          <ul class="radioBtnWrapper">
            <li>
              <input type="radio" name="stade" id="preContentieux" value="Pré-contentieux" checked />
              <label for="preContentieux">Pré-contentieux</label>
            </li>
            <li>
              <input type="radio" name="stade" id="contentieux" value="Contentieux" />
              <label for="contentieux">Contentieux</label>
            </li>
            <li>
              <input type="radio" name="stade" id="execution" value="Éxecution" />
              <label for="execution">Éxecution</label>
            </li>
          </ul>
        </div>        
        
        <!-- évènement -->
        
        <div class="inputWrapper">
          <label>Évènement</label>
          <select name="eventType">
            <option>Choisir</option>
          </select>
        </div>
        
        <!-- juridiction -->
        
        <div class="inputWrapper">
          <label>Juridiction</label>
          <select name="juridictionType">
            <option>Choisir</option>
          </select>
        </div>
        
        <!-- lieux -->

        <div class="inputWrapper">
          <label for="lieuJuridiction">Lieu de l'évènement</label>
          <input type="text" name="lieuJuridiction"/>
        </div>
        
        <!-- eventDate -->        
        
        <div class="inputWrapper">
          <label for="dateDerEvent">Date</label>
          <input type="date" name="dateDerEvent" />
        </div>
        
        <!-- commentaire -->
        
        <div class="inputWrapper">
          <label for="commentaire">Commentaire</label>
          <textarea name="commentaire"></textarea>
        </div>
        
        <!-- nextEvent -->
        
        <div class="inputWrapper subSection">
          <label>Évènement suivant</label>
          <select name="nextEventType">
            <option>Choisir</option>
          </select>
        </div>
        
        <!-- nextJuridiction -->
        
        <div class="inputWrapper">
          <label>Juridiction à venir</label>
          <select name="nextJuridictionType">
            <option>Choisir</option>
          </select>
        </div>
        
        <!-- nextEventDate -->
        
         <div class="inputWrapper">
          <label for="dateNextEvent">Évènement à venir</label>
          <input type="date" name="dateNextEvent" />
        </div>
      </form>
      
      <!-- submit button -->
      
      <div class="btnWrapper">
        <button class="validButton submitEventCreation">Crée l'évènement</button>
        <button class="errorButton">Annuler</button>
      </div>
    `
    this.main.appendChild(section)
  }

  async insertSelectOptions() {
    const eventSelect = document.querySelector('select[name="eventType"]')
    const nextEventSelect = document.querySelector(
      'select[name="nextEventType"]',
    )
    const juridictionSelect = document.querySelector(
      'select[name="juridictionType"]',
    )
    const nextJuridictionSelect = document.querySelector(
      'select[name="nextJuridictionType"]',
    )

    this.eventDictionary.forEach((event) => {
      const option1 = document.createElement('option')
      option1.textContent = event['libelle']
      option1.value = event['libelle']
      eventSelect.appendChild(option1)

      const option2 = document.createElement('option')
      option2.textContent = event['libelle']
      option2.value = event['libelle']
      nextEventSelect.appendChild(option2)
    })

    this.juridictionDictionary.forEach((juridiction) => {
      const option1 = document.createElement('option')
      option1.textContent = juridiction['libelle']
      option1.value = juridiction['libelle']
      juridictionSelect.appendChild(option1)

      const option2 = document.createElement('option')
      option2.textContent = juridiction['libelle']
      option2.value = juridiction['libelle']
      nextJuridictionSelect.appendChild(option2)
    })
  }

  async handleSubmitEventCreation() {
    const selectedRadio = document.querySelector(
      'input[name="stade"]:checked',
    ).value

    const getEventKey = (eventSelection) => {
      return this.eventDictionary.find((event) => {
        const eventValue = document.querySelector(
          `select[name="${eventSelection}"]`,
        ).value
        if (eventValue === event['libelle']) {
          return event.type
        }
      })
    }

    const getJuridictionKey = (juridictionSelection) => {
      return this.juridictionDictionary.find((juridiction) => {
        const juridictionValue = document.querySelector(
          `select[name="${juridictionSelection}"]`,
        ).value
        if (juridictionValue === juridiction['libelle']) {
          return juridiction.type
        }
      })
    }

    const cle_litige_dossier = document
      .querySelector('#createEvent p')
      .textContent.split(' : ')[0]

    const action = selectedRadio

    const dh_action = document.querySelector('input[name="dateDerEvent"]').value

    const stade = selectedRadio

    const findEvent_type = getEventKey('eventType')
    const event_type = findEvent_type['type']

    const datederevent = document.querySelector(
      'input[name="dateDerEvent"]',
    ).value

    const findJuridiction_type = getJuridictionKey('juridictionType')
    const juridiction_type = findJuridiction_type['type']

    const lieu_juridiction = document.querySelector(
      'input[name="lieuJuridiction"]',
    ).value

    const findNext_event = getEventKey('nextEventType')
    const next_event = findNext_event['type']

    const datenextevent = document.querySelector(
      'input[name="dateNextEvent"]',
    ).value

    const findNext_juridiction_type = getJuridictionKey('nextJuridictionType')
    const next_juridiction_type = findNext_juridiction_type['type']
    console.log('next_juridiction_type —>', next_juridiction_type)

    const commentaire = document.querySelector(
      'textarea[name="commentaire"]',
    ).value

    const datas = {
      cle_litige_dossier: cle_litige_dossier,
      action: action,
      dh_action: dh_action,
      stade: stade,
      event_type: event_type,
      datederevent: datederevent,
      juridiction_type: juridiction_type,
      lieu_juridiction: lieu_juridiction,
      next_event: next_event,
      datenextevent: datenextevent,
      next_juridiction_type: next_juridiction_type,
      commentaire: commentaire,
    }

    await this.eventService.createEvent(datas)

    await this.destroyComponent()
  }

  async destroyComponent() {
    const section = document.querySelector('#createEvent')
    section.remove()
  }

  async initEventListeners() {
    const displayFolderBtn = document.querySelector('.displayFolder')
    displayFolderBtn.addEventListener('click', (event) => {
      event.preventDefault()
      this.folderList.initFolderList()
    })
    document.addEventListener('folderSelected', (event) => {
      this.selectedFolderID = event.detail.folderID
    })

    const cancelButton = document.querySelector('.errorButton')
    cancelButton.addEventListener('click', async () => this.destroyComponent())

    const submitButton = document.querySelector('.submitEventCreation')
    submitButton.addEventListener(
      'click',
      async () => await this.handleSubmitEventCreation(),
    )
  }

  async initCreateNewEvent() {
    await this.renderSection()
    await this.insertSelectOptions()
    await this.initEventListeners()
  }
}
