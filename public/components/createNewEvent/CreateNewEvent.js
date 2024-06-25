class CreateNewEvent {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.main = null
    this.eventDictionary = JSON.parse(localStorage.getItem('eventTypes'))
    this.juridictionDictionary = JSON.parse(
      localStorage.getItem('juridictionTypes'),
    )
  }

  async renderSection() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'createEvent')
    section.innerHTML += `
      <form>
        <h2>Crée un nouvel évènement</h2>
        <div class="radioBtnContainer">
          <label class="bold">Stade</label>
          <ul class="radioBtnWrapper">
            <li>
              <input type="radio" name="eta" id="eta" />
              <label for="eta">Pré-contentieux</label>
            </li>
            <li>
              <input type="radio" name="eta" id="eta" />
              <label for="eta">Contentieux</label>
            </li>
            <li>
              <input type="radio" name="eta" id="eta" />
              <label for="eta">Execution</label>
            </li>
          </ul>
        </div>
        <div class="inputWrapper">
          <label>Évènement</label>
          <select name="eventSelection">
            <option>Choisir</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label>Juridiction</label>
          <select name="juridictionSelection">
            <option>Choisir</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label>Lieu</label>
          <input type="text" />
        </div>
        <div class="inputWrapper">
          <label>Date</label>
           <input type="date" />
        </div>
        <div class="inputWrapper">
          <label>Commentaire</label>
          <textarea></textarea>
        </div>
        <div class="inputWrapper subSection">
          <label>Évènement suivant</label>
          <select name="nextEventSelection">
            <option>Choisir</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label>Juridiction à venir</label>
          <select name="nextJuridictionSelection">
            <option>Choisir</option>
          </select>
        </div>
         <div class="inputWrapper">
          <label>Évènement à venir</label>
          <input type="date" />
        </div>
      </form>
      <div class="btnWrapper">
        <button class="validButton submitEventCreation">Crée l'évènement</button>
        <button class="errorButton">Annuler</button>
      </div>
    `
    this.main.appendChild(section)
  }

  async insertSelectOptions() {
    const eventSelect = document.querySelector('select[name="eventSelection"]')
    const nextEventSelect = document.querySelector(
      'select[name="nextEventSelection"]',
    )
    const juridictionSelect = document.querySelector(
      'select[name="juridictionSelection"]',
    )
    const nextJuridictionSelect = document.querySelector(
      'select[name="nextJuridictionSelection"]',
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
    console.log('handleSubmitEventCreation')
    const datas = []

    const isConfirm = this.alert.initAlert(
      `Confirmez vous la création de l'évènement avec ses données ?`,
    )

    if (isConfirm) {
      const inputs = document.querySelectorAll('input')
      inputs.forEach((input) => {
        const value = input.value
        if (value) {
          datas.push({ name: input.name, value: value })
        }
      })
    }

    console.log('datas —>', datas)
    // await this.destroyComponent()
  }

  async destroyComponent() {
    const section = document.querySelector('#createEvent')
    section.remove()
  }

  async initEventListeners() {
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
