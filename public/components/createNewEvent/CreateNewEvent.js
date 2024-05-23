class CreateNewEvent {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.main = null
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
      </form>
      <div class="btnWrapper">
        <button class="validButton submitEventCreation">Crée l'évènement</button>
        <button class="errorButton">Annuler</button>
      </div>
    `
    this.main.appendChild(section)
  }

  async destroyComponent() {
    const section = document.querySelector('#createEvent')
    section.remove()
  }

  async initEventListeners() {
    const cancelButton = document.querySelector('.errorButton')
    cancelButton.addEventListener('click', async () => this.destroyComponent())
  }

  async initCreateNewEvent() {
    await this.renderSection()
    await this.initEventListeners()
  }
}
