class CreateNewFolder {
  constructor() {
    this.utils = new Utils()
    this.alert = new Alert()
    this.folderService = new FolderService()
    this.themeListService = new ThemeListService()
    this.themeList = null
    this.main = null
    this.credentials = null
    this.isMultiple = 0
  }

  async getUser() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
  }

  async getThemeList() {
    this.themeList = await this.themeListService.getList(this.credentials)
  }

  async renderSection() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'createFolder')
    section.innerHTML += `
      <form id="submitForm">
        <h2>Crée un nouveau dossier</h2>
        <div class="inputWrapper">
          <label for="society">Société:</label>
          <select name="society" required>
            <option value="-1">Choisir</option>
            <option value="BB">BB</option>
            <option value="ECOASSIS">ECOASSIS</option>
            <option value="FLEURIAU">FLEURIAU</option>
            <option value="GEAS">GEAS</option>
            <option value="GELS">GELS</option>
            <option value="GEMP">GEMP</option>
            <option value="GEMV">GEMV</option>
            <option value="IVOB">IVOB</option>
            <option value="IVOO">IVOO</option>
            <option value="IVOS">IVOS</option>
            <option value="IVOT">IVOT</option>
            <option value="PVF">PVF</option>
            <option value="SCI_IMMO_BECQUET">SCI_IMMO_BECQUET</option>
            <option value="SITAP">SITAP</option>
            <option value="STENICO_RE">STENICO_RE</option>          
          </select>
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
          <label for="theme">Theme:</label>
          <select name="theme" required>
            <option>Choisir</option>
          </select>
        </div>
        <div class="inputWrapper checkBoxWrapper">
          <label for="isMultiple">Multiples:</label>
          <input type="checkbox" name="isMultiple" class="isMultiple"/>
        </div>        
        <div class="inputWrapper">
          <label for="conseil">Conseil:</label>
          <input type="text" name="conseil">
        </div>      
        <div class="inputWrapper">
          <label for="startDate">Date de début:</label>
          <input type="date" name="startDate" required />
        </div>   
        <div class="inputWrapper">
          <label for="statut">Statut:</label>
          <select name="statut" required>
            <option value="-1">Choisir</option>
            <option value="A VALIDE">A Valider</option>
            <option value="EN COURS">En cours</option>
            <option value="AJOURNE">Ajourné</option>
            <option value="TERMINE">Terminé</option>
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

  async insertSelectOption() {
    const themeSelect = document.querySelector('#submitForm select[name="theme"]')

    if (!this.themeList || !Array.isArray(this.themeList)) {
      console.error(`This.themeList, is not defined or not an array`)
      return
    }

    this.themeList.forEach((theme) => {
      const option = document.createElement('option')
      option.setAttribute('value', theme['theme'])
      option.textContent = theme['theme']
      themeSelect.appendChild(option)
    })
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
        this.isMultiple = 1
        const newElement = document.createElement('div')
        newElement.setAttribute('class', 'inputWrapper multipleFolder')
        newElement.innerHTML += `
          <label>Liste de dossier : </label>
          <input type="text" name="linkedFolder" placeholder="Clé du dossier parent"/>
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

  async handleSubmitFolderCreation() {
    const isConfirmed = await this.alert.initAlert(
      'Confirmez vous la création du dossier de litige avec ses données ?',
    )

    if (!isConfirmed) {
      return
    }

    const societe = document.querySelector(
      '#submitForm select[name="society"]',
    ).value
    const tiers = document.querySelector(
      '#submitForm input[name="tiers"]',
    ).value
    const nom = `${societe} ${tiers}`
    const commentaire = document.querySelector(
      '#submitForm textarea[name="comment"]',
    ).value
    const auteur = this.credentials['userID']
    const conseil = document.querySelector(
      '#submitForm input[name="conseil"]',
    ).value
    const theme = document.querySelector(
      '#submitForm select[name="theme"]',
    ).value
    const multiple = this.isMultiple
    const statut = document.querySelector(
      '#submitForm select[name="statut"]',
    ).value
    const datedebut = document.querySelector(
      '#submitForm input[name="startDate"]',
    ).value

    let datas = {
      societe: societe,
      tiers: tiers,
      nom: nom,
      commentaire: commentaire,
      auteur: auteur,
      conseil: conseil,
      theme: theme,
      multiple: multiple,
      statut: statut,
      datedebut: datedebut,
    }

    if (this.isMultiple) {
      const linkedFolder = document.querySelector(
        '#submitForm input[name="linkedFolder"]',
      ).value
      datas = {
        ...datas,
        linkedFolder: linkedFolder,
      }
    }

    const replaceEmptyStringsWithNull = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === '') {
          obj[key] = null
        }
      })
    }

    replaceEmptyStringsWithNull(datas)

    await this.destroyComponent()
    await this.folderService.createEditFolder(this.credentials, datas)
    window.location.reload()
  }

  async initEventListeners() {
    await this.isMultiples()
    await this.insertSelectOption()
    const cancelButton = document.querySelector('.errorButton')
    cancelButton.addEventListener('click', async () => this.destroyComponent())

    const submitButton = document.querySelector('.submitFolderCreation')
    submitButton.addEventListener('click', async (event) => {
      event.preventDefault()
      await this.handleSubmitFolderCreation()
    })
  }

  async initCreateNewFolder() {
    await this.getUser()
    await this.getThemeList()
    await this.renderSection()
    await this.initEventListeners()
  }
}
