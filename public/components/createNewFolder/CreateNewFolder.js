class CreateNewFolder {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.main = null
  }

  async renderSection() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'createFolder')
    section.innerHTML += `
      <form>
        <h2>Crée un nouveau dossier</h2>
        <div class="inputWrapper">
          <label for="society">Société:</label>
          <input name="society" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="tiers">Tiers:</label>
          <input name="tiers" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="comment">Commentaire:</label>
          <textarea name="comment"></textarea>
        </div>
        <div class="inputWrapper">
          <label for="file">Conseil:</label>
          <select>
            <option>Choisir</option>
            <option>conseil2</option>
            <option>conseil2</option>
            <option>conseil3</option>
            <option>conseil4</option>
            <option>conseil5</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label for="file">Theme:</label>
          <select>
            <option>Choisir</option>
            <option>theme2</option>
            <option>theme2</option>
            <option>theme3</option>
            <option>theme4</option>
            <option>theme5</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label for="file">Multiples:</label>
          <input type="checkbox" />
        </div>
        <div class="inputWrapper">
          <label for="file">Statut:</label>
          <select>
            <option>Choisir</option>
            <option>Statut1</option>
            <option>Statut2</option>
            <option>Statut3</option>
            <option>Statut4</option>
            <option>Statut5</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label for="file">Date de début:</label>
          <input type="date" />
        </div>        
        <div class="inputWrapper">
          <label for="file">Prochaine action</label>
          <input type="text" />
        </div>        
         <div class="inputWrapper">
          <label for="file">Date de prochaine action:</label>
          <input type="date" />
        </div>
      </form>
      <div class="btnWrapper">
        <button class="validButton submitFolderCreation">Crée le dossier</button>
        <button class="errorButton">Annuler</button>
      </div>
    `
    this.main.appendChild(section)
    await this.utils.trapFocus(section)
  }

  async handleSubmitFolderCreation() {
    console.log('handleSubmitFolderCreation')
    const datas = []

    const isConfirm = this.alert.initAlert(
      'Confirmez vous la création du dossier de litige avec ses données ?',
    )

    if (isConfirm) {
      const inputs = document.querySelectorAll('input')
      inputs.forEach((input) => {
        const value = input.value
        if (value) {
          datas.push({ name: input.name, value: value })
        }
      })

      console.log('datas —>', datas)
      // await this.destroyComponent()      }
    }
  }

  async destroyComponent() {
    const section = document.querySelector('#createFolder')
    section.remove()
  }

  async initEventListeners() {
    const cancelButton = document.querySelector('.errorButton')
    cancelButton.addEventListener('click', async () => this.destroyComponent())
    await this.handleSubmitFolderCreation

    const submitButton = document.querySelector('.submitFolderCreation')
    submitButton.addEventListener(
      'click',
      async () => await this.handleSubmitFolderCreation(),
    )
  }

  async initCreateNewFolder() {
    await this.renderSection()
    await this.initEventListeners()
  }
}
