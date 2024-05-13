class ViewMail {
  constructor() {
    this.searchBar = new SearchBar()
    this.utils = new Utils()
    this.footer = new Footer()
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
    iframe.setAttribute(
      'src',
      `${this.mailFolder}${this.datas['nom_fichier']}`,
    )

    leftArticle.appendChild(iframe)
  }

  async editCourrier() {
    const rightArticle = document.querySelector('#rightArticle')
    rightArticle.innerHTML = `
    <h2>Dossier : </h2>
    <ul>
        <li>
            <label>Nom : </label>
            <input type="text" placeholder="Société VS Tiers"/>
        </li>
        <li>
            <label>Commentaire : </label>
            <input type="text" placeholder="Résumé du litige"/>
        </li>
         <li>
            <label>Prochaine action : </label>
            <select>
                <option>Choisir</option>
                <option>pAction1</option>
                <option>pAction2</option>
                <option>pAction3</option>
                <option>pAction4</option>
                <option>pAction5</option>
                <option>pAction6</option>
            </select>
        </li>
         <li>
            <label>Date de prochaine action : </label>
            <input type="date"/>
        </li>
         <li>
            <label>Statut : </label>
            <select>
                <option>Choisir</option>
                <option>statut1</option>
                <option>statut2</option>
                <option>statut3</option>
                <option>statut4</option>
                <option>statut5</option>
                <option>statut6</option>
            </select>
        </li>
        <li>
            <label>Associer : </label>
            <input type="file"/>
        </li>
        <li>
            <button>Crée un dossier</button>
        </li>
    </ul>
    
    <div class="btnWrapper">
        <button>Valider</button>
        <button>Annuler</button>
    </div>
    `
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
