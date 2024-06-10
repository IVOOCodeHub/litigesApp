class Folder {
  constructor() {
    this.folderService = new FolderService()
    this.folderHeader = new FolderHeader()
    this.createNewEvent = new CreateNewEvent()
    this.footer = new Footer()
    this.utils = new Utils()
    this.mailHistory = new MailHistory()
    this.folderHistory = new FolderHistory()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
    this.credentials = null
    this.isMultiple = 0
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

    console.log('this.datas —>', this.datas)
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
              <p>${this.datas['tiers']} vs ${this.datas['societe']}</p>
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
                <option selected="selected">${this.datas['theme']}</option>
                <option>theme3</option>
                <option>theme4</option>
                <option>theme5</option>
              </select>
            </li>     
            <li class="checkBoxWrapper">
              <label for="isMultiple">Multiple</label>
              <input name="isMultiple" type="checkbox" class="isMultiple"  />
            </li>
            <li>
              <label for="statut">Statut</label>
              <select name="statut">
                <option selected="selected">${this.datas['statut']}</option>
                <option>En cours</option>
                <option>Ajourné</option>
                <option>Cloturé</option>
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
              <button class="button displayMailHistory">Liste des courriers</button>
            </li>
            <li class="buttonWrapper">
              <button class="button displayHistory">Liste des dossiers associers</button>
            </li>
             <li class="buttonWrapper">
              <button class="button ">Historique des évènements</button>
            </li>
          </ul>             
          <!-- PREVIOUS EVENT -->        
          <ul class="element">
            <h3>Dernier historique évènement</h3>
            <li>
              <label>Dernier évèment : </label>
              <p>DD/MM/YYYY</p>
            </li>
            <li>
              <label>Etat : </label>
              <p>Pré-contentntieux / Contentieux / Éxécution</p>
            </li>
            <li>
              <label>Type d'évènement : </label>
              <p>*type d'évènement*</p>
            </li>
            <li>
              <label>Type de juridiction : </label>
              <p>*type de juridiction*</p>
            </li>
            <li>
              <label>Commentaire : </label>
              <p>*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi asperiores consectetur corporis fuga nam quasi sapiente tempore. Ad consequatur libero natus nihil tempora! Mollitia, quae.*</p>
            </li>
          </ul>
          
          <!-- GEST DOSSIER  -->
        
          <ul class="element">
            <h3>Gestion du dossier</h3>
            <li>
              <label>Rattacher : </label>
              <select name="add folder">
                <option>Choisir</option>
                <option>Folder1</option>
                <option>Folder2</option>
                <option>Folder3</option>
                <option>Folder4</option>
                <option>Folder5</option>
                <option>Folder6</option>
                <option>Folder7</option>
                <option>Folder8</option>
                <option>Folder9</option>
                <option>Folder10</option>
              </select>
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
              <button class="validButton">Sauvegarder les modifications</button>
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

  async insertDatas() {
    const conseilInput = document.querySelector('.conseil')
    if (this.datas['conseil']) {
      conseilInput.value = this.datas['conseil']
    } else {
      conseilInput.value = 'Aucun'
    }

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

    if (this.datas['datedebut']) {
      const startDate = new Date(this.datas['datedebut'])
      const dateDebutInput = document.querySelector('.startDate')
      console.log('dateDebutInput —>', dateDebutInput)
      dateDebutInput.value = startDate.toISOString().split('T')[0]
    }
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

    const societeSelect = document.querySelector('select[name="socity"]')
    if (societeSelect.value !== this.datas['societe']) {
      newDatas['societe'] = societeSelect.value
    }

    const tiersSelect = document.querySelector('select[name="tiers"]')
    if (tiersSelect.value !== this.datas['tiers']) {
      newDatas['tiers'] = tiersSelect.value
    }

    const commentaireInput = document.querySelector('textarea[name="comment"]')
    if (commentaireInput.value !== this.datas['commentaire']) {
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
      newDatas['datedebut'] = dateDebutInput.value
    }

    console.log('newDatas =>', newDatas)
    await this.folderService.createEditFolder(this.credentials, newDatas)
  }

  async initEventListeners() {
    await this.isMultiples()

    const submitUpdateFolderBtn = document.querySelector('.submitUpdateFolder')
    submitUpdateFolderBtn.addEventListener('click', async () => {
      await this.submitUpdateFolder()
    })

    const createNewEventButton = document.querySelector(
      '.displayCreateEventModal',
    )
    createNewEventButton.addEventListener('click', () =>
      this.createNewEvent.initCreateNewEvent(),
    )

    const displayHistory = document.querySelector('.displayHistory')
    displayHistory.addEventListener('click', () =>
      this.folderHistory.initFolderHistory(),
    )
    await this.displayLinkedMail()
  }

  async initFolder() {
    await this.getParams()
    await this.getDatas()
    await this.createMain()
    await this.folderHeader.initFolderHeader(this.datas)
    await this.renderFolder()
    await this.insertDatas()
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
