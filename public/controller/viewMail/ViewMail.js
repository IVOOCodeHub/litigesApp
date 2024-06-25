class ViewMail {
  constructor() {
    this.searchBar = new SearchBar()
    this.utils = new Utils()
    this.affectationService = new AffectationService()
    this.bindMailService = new BindMailService()
    this.folderService = new FolderService()
    this.folderHeader = new FolderHeader()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.createNewEvent = new CreateNewEvent()
    this.folderList = new FolderList()
    this.selectedFolderID = null
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
    this.credentials = null
    this.folderDatas = null
    this.mailFolder = 'http://192.168.0.254:8080/usv_prod/courriers/'
  }

  async getParams() {
    const urlParams = new URLSearchParams(window.location.search)
    this.id = urlParams.get('id')
  }

  async getDatas() {
    this.datas = JSON.parse(localStorage.getItem('datas'))
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    if (!this.datas) {
      this.datas = await this.affectationService.getMail(this.credentials)
      localStorage.setItem('datas', JSON.stringify(this.datas))
    }

    console.log('this.id —>', this.id)
    this.datas = this.datas.find((object) => object['cle'] === this.id)

    this.folderDatas = await this.folderService.getFolder(this.credentials)

    this.folderDatas = this.folderDatas.find((folder) => {
      if (folder['courriers']) {
        let mails = folder['courriers']['rows']
        if (!Array.isArray(mails)) {
          mails = [mails]
        }
        return mails.some((mail) => mail['cle_courrier'] === this.id)
      }
      return false
    })
  }

  async createViewMailDom() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async createSections() {
    const section = document.createElement('section')
    section.setAttribute('id', 'viewMail')
    const leftArticle = document.createElement('article')
    leftArticle.setAttribute('id', 'leftArticle')
    const rightArticle = document.createElement('article')
    rightArticle.setAttribute('id', 'rightArticle')
    rightArticle.setAttribute('class', 'rightArticle')
    section.appendChild(leftArticle)
    section.appendChild(rightArticle)
    this.main.appendChild(section)
  }

  async displayCourrier() {
    const leftArticle = document.querySelector('#leftArticle')
    const iframe = document.createElement('iframe')
    iframe.setAttribute('class', 'courrier')
    iframe.setAttribute('src', `${this.mailFolder}${this.datas['nom_fichier']}`)

    leftArticle.appendChild(iframe)
  }

  async editCourrier() {
    const rightArticle = document.querySelector('#rightArticle')
    rightArticle.innerHTML = `
    <h2>Gestion du courier :</h2>
    <ul class="manageDossier">
        <li class="bindFolderWrapper">
            <label for="bindTo">Associer à un dossier </label>
            <button class="button displayFolder">Sélectionner</button>
        </li>
         <li>
            <label for="status">Crée un dossier : </label>
            <button class="button createFolder">Crée</button>
        </li>
        <li>
            <label for="status">Crée un évènement : </label>
            <button class="button createEvent">Crée</button>
        </li>
        <li>
          <label for="litigeComment">Commentaire : </label>
          <textarea name="litigeComment"></textarea>
        </li>
    </ul>
    <div>
        <button class="validButton submitForm">Sauvegarder les informations</button>
    </div>
    `
  }

  async insertComment() {
    const comment = document.querySelector('textarea[name="litigeComment"]')
    const litigeComment = this.datas['litiges_commentaire']
    litigeComment ? (comment.value = litigeComment) : (comment.value = '')
  }

  async submitMailUpdate() {
    if (!this.selectedFolderID) {
      // if we came from the folder view, we got the id from the header.
      this.selectedFolderID = document.querySelector('.headerKey').textContent
    }
    // if not, we got it from the form.
    const newDatas = {
      cle_courrier: this.datas['cle'],
      cle_dossier: this.selectedFolderID,
      commentaire: document.querySelector('textarea[name="litigeComment"]')
        .value,
    }
    await this.bindMailService.setBindMail(this.credentials, newDatas)
  }

  async initEventListeners() {
    const displayFolderBtn = document.querySelector('.displayFolder')
    displayFolderBtn.addEventListener('click', () =>
      this.folderList.initFolderList(),
    )
    document.addEventListener('folderSelected', (event) => {
      this.selectedFolderID = event.detail.folderID
    })

    const submitButton = document.querySelector('.submitForm')
    submitButton.addEventListener('click', () => {
      this.submitMailUpdate()
    })

    const createFolderBtn = document.querySelector('.createFolder')
    createFolderBtn.addEventListener('click', () => {
      this.createNewFolder.initCreateNewFolder()
    })
    const createEventBtn = document.querySelector('.createEvent')
    createEventBtn.addEventListener('click', () => {
      this.createNewEvent.initCreateNewEvent()
    })
  }

  async initViewMail() {
    await this.createViewMailDom()
    await this.getParams()
    await this.getDatas()
    if (this.folderDatas) {
      await this.folderHeader.initFolderHeader(this.folderDatas)
    }
    await this.createSections()
    await this.displayCourrier()
    await this.editCourrier()
    await this.insertComment()
    await this.footer.initFooter()
    await this.initEventListeners()
  }
}

const viewMail = new ViewMail()
viewMail
  .initViewMail()
  .then(() =>
    console.log(
      `ViewMail successfully loaded at : ${viewMail.utils.getDate()}`,
    ),
  )
  .catch((err) =>
    console.error(
      `ViewMail failed to load : ${err} at : ${viewMail.utils.getDate()}`,
    ),
  )
