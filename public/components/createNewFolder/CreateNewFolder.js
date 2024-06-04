class CreateNewFolder {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.folderService = new FolderService()
    this.main = null
    this.user = null
    this.isMultiple = false
  }

  async getUser() {
    this.user = await JSON.parse(localStorage.getItem('user'))
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
          <input name="society" type="text" required />
        </div>
        <div class="inputWrapper">
          <label for="tiers">Tiers:</label>
          <input name="tiers" type="text" required />
        </div>
        <div class="inputWrapper">
          <label for="comment">Descriptif:</label>
          <textarea name="comment"></textarea>
        </div>
        <div class="inputWrapper">
          <label for="file">Theme:</label>
          <select>
            <option>Choisir</option>
            <option>Amauger</option>
            <option>Cial</option>
            <option>Divers</option>
            <option>Fiscal</option>
            <option>Pénal</option>
            <option>RC</option>
            <option>Social</option>
            <option>Sténico</option>
          </select>
        </div>
        <div class="inputWrapper checkBoxWrapper">
          <label for="isMultiple">Multiples:</label>
          <input type="checkbox" name="isMultiple" class="isMultiple"/>
        </div>        
        <div class="inputWrapper">
          <label for="conseil">Conseil:</label>
          <select name="conseil">
            <option>Choisir</option>
            <option>conseil2</option>
            <option>conseil2</option>
            <option>conseil3</option>
            <option>conseil4</option>
            <option>conseil5</option>
          </select>
        </div>      
        <div class="inputWrapper">
          <label for="file">Date de début:</label>
          <input type="date" required />
        </div>   
        <div class="inputWrapper">
          <label for="file">Statut:</label>
          <select required>
            <option>Choisir</option>
            <option>Statut1</option>
            <option>Statut2</option>
            <option>Statut3</option>
            <option>Statut4</option>
            <option>Statut5</option>
          </select>
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
    const isConfirmed = await this.alert.initAlert(
      'Confirmez vous la création du dossier de litige avec ses données ?'
    )

    if (!isConfirmed) {
      return
    }

    const societe = document.querySelector('input[name="society"]').value
    const tiers = document.querySelector('input[name="tiers"]').value
    const nom = `${societe} ${tiers}`
    const commentaire = document.querySelector('textarea[name="comment"]').value
    const auteur = this.user['matricule']
    const dh_creation = new Date().toISOString()
    const conseil = document.querySelector('select[name="conseil"]').value
    const theme = document.querySelector('select[name="theme"]').value
    const multiple = this.isMultiple
    if (this.isMultiple) {
      const linkedFolder = document.querySelector('input[name="linkedFolder"]').value
    }
    const statut = document.querySelector('select[name="statut"]').value
    const datedebut = document.querySelector('input[type="date"]').value

    const user = {
      userID: this.user['matricule'],
      password: this.user['mdp'],
    }
    const datas = {
      societe: societe,
      tiers: tiers,
      nom: nom,
      commentaire: commentaire,
      auteur: auteur,
      dh_creation: dh_creation,
      conseil: conseil,
      theme: theme,
      multiple: multiple,
      statut: statut,
      datedebut: datedebut,
    }

    console.log('datas —>', datas)
    await this.destroyComponent()
    await this.folderService.createFolder(user, datas)
  }

  async destroyComponent() {
    const section = document.querySelector('#createFolder')
    section.remove()
  }

  async isMultiples() {
    const checkBox = document.querySelector('.isMultiple')
    checkBox.addEventListener('change', (event) => {
      event.preventDefault()
      const isChecked = checkBox.checked
      if (isChecked) {
        this.isMultiple = true
        const newElement = document.createElement('div')
        newElement.setAttribute('class', 'inputWrapper multipleFolder')
        newElement.innerHTML += `
          <label>Liste de dossier : </label>
          <input type="text" placeholder="Clé du dossier à associé"/>
        `
        const checkBoxWrapper = document.querySelector('.checkBoxWrapper')
        checkBoxWrapper.insertAdjacentElement('afterend', newElement)
      } else {
        this.isMultiple = false
        const selectMultipleFolder = document.querySelector('.multipleFolder')
        selectMultipleFolder.remove()
      }
    })
  }

  async initEventListeners() {
    await this.isMultiples()
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
    await this.getUser()
    await this.renderSection()
    await this.initEventListeners()
  }
}
