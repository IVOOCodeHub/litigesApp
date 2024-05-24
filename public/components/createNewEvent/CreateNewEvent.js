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
        <div class="inputWrapper">
          <label>Évènement</label>
          <select>
            <option>Choisir un évènement</option>
            <option>Évènement1</option>
            <option>Évènement2</option>
            <option>Évènement3</option>
            <option>Évènement4</option>
            <option>Évènement5</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label>Juridiction</label>
          <select>
            <option>Choisir une juridiction</option>
            <option>Juridiction1</option>
            <option>Juridiction2</option>
            <option>Juridiction3</option>
            <option>Juridiction4</option>
            <option>Juridiction5</option>
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
          <select>
            <option>Choisir un évènement</option>
            <option>nextEvent1</option>
            <option>nextEvent2</option>
            <option>nextEvent3</option>
            <option>nextEvent4</option>
            <option>nextEvent5</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label>Juridiction à venir</label>
          <select>
            <option>Choisir</option>
            <option>nextTypeJuridiction1</option>
            <option>nextTypeJuridiction2</option>
            <option>nextTypeJuridiction3</option>
            <option>nextTypeJuridiction4</option>
            <option>nextTypeJuridiction5</option>
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
    await this.initEventListeners()
  }
}
