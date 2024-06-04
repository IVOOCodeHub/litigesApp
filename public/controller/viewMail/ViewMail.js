class ViewMail {
  constructor() {
    this.searchBar = new SearchBar()
    this.utils = new Utils()
    this.affectationService = new AffectationService()
    this.folderService = new FolderService()
    this.folderHeader = new FolderHeader()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.createNewEvent = new CreateNewEvent()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
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
    const userDatas = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    if (!this.datas) {
      this.datas = await this.affectationService.getMail(userDatas)
      localStorage.setItem('datas', JSON.stringify(this.datas))
    }

    this.datas = this.datas.find((object) => object['cle'] === this.id)
    console.log('this.datas —>', this.datas)

    this.folderDatas = await this.folderService.getFolder(userDatas)
    this.folderDatas = this.folderDatas.find(
      (object) => object['cle'] === this.datas['cle_litige_dossier'],
    )
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
        <li class="typeFile">
            <label for="bindTo">Associer à un dossier </label>
            <select>
              <option>Choisir un dossier</option>
              <option>dossier1</option>
              <option>dossier2</option>
              <option>dossier3</option>
              <option>dossier4</option>
              <option>dossier5</option>
            </select>
        </li>
         <li>
            <label for="status">Crée un dossier : </label>
            <button class="button createFolder">Crée</button>
        </li>
        <li>
            <label for="status">Crée un évènement : </label>
            <button class="button createEvent">Crée</button>
        </li>
    </ul>
    `
  }

  async initEventListeners() {
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
    if (this.folderDatas)
      await this.folderHeader.initFolderHeader(this.folderDatas)
    await this.createSections()
    await this.displayCourrier()
    await this.editCourrier()
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
