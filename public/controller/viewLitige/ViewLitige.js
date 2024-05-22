class ViewLitige {
  constructor() {
    this.searchBar = new SearchBar()
    this.utils = new Utils()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
    this.mailFolder = 'http://192.168.0.254:8080/usv_prod/courriers/'
  }

  async getParams() {
    const urlParams = new URLSearchParams(window.location.search)
    this.id = urlParams.get('id')
  }

  async getDatas() {
    this.datas = JSON.parse(localStorage.getItem('datas'))
    this.datas = this.datas['courriers'].find(
      (object) => object['cle'] === this.id,
    )
    console.log('this.datas —>', this.datas)
  }

  async createViewMailDom() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async title() {
    const titleWrapper = document.createElement('div')
    titleWrapper.setAttribute('class', 'titleWrapper')
    const h2 = document.createElement('h2')
    h2.textContent = this.datas['commentaire']

    titleWrapper.appendChild(h2)
    this.main.appendChild(titleWrapper)
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
    <h2>Dossier : </h2>
    <ul>
        <li>
            <label for="name">Nom : </label>
            <p>${this.datas['societe']} VS ${this.datas['societe_emettrice']}</p>
        </li>
        <li>
            <label for="comment">Commentaire : </label>
            <p>${this.datas['commentaire']}</p>
        </li>
         <li>
            <label for="pAction">Prochaine action : </label>
            <p>${this.datas['action']}</p>
        </li>
         <li>
            <label for="date">Date de prochaine action : </label>
            <p>*Date pAction*</p>
        </li>
         <li>
            <label for="status">Statut : </label>
            <p>${this.datas['statut']}</p>
        </li>
    </ul>
    <h2>Gestion du dossier :</h2>
    <ul class="manageDossier">
        <li class="typeFile">
            <label for="bindTo">Associer : </label>
            <input name="bindTo" type="file"/>
        </li>
         <li>
            <label for="status">Crée un dossier : </label>
            <button class="button createFolder">Crée</button>
        </li>
    </ul>
    `
  }

  async initEventListeners() {
    const createFolderBtn = document.querySelector('.createFolder')
    createFolderBtn.addEventListener('click', () => {
      this.createNewFolder.initCreateNewFolder()
    })
  }

  async initViewMail() {
    await this.createViewMailDom()
    await this.getParams()
    await this.getDatas()
    await this.title()
    await this.createSections()
    await this.displayCourrier()
    await this.editCourrier()
    await this.footer.initFooter()
    await this.initEventListeners()
  }
}

const viewMail = new ViewLitige()
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
