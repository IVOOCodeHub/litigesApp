class CreateNewFolder {
  constructor() {
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
          <label for="name">Nom du dossier:</label>
          <input name="name" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="sender">Expéditeur:</label>
          <input name="sender" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="recipient">Destinataire:</label>
          <input name="recipient" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="comment">Commentaire:</label>
          <input name="comment" type="text" />
        </div>
        <div class="inputWrapper">
          <label for="file">Pièce:</label>
          <input name="file" type="file" />
        </div>
      </form>
      <div class="btnWrapper">
        <button class="validButton submitFolderCreation">Crée le dossier</button>
        <button class="errorButton">Annuler</button>
      </div>
    `
    this.main.appendChild(section)
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
