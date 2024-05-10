class ViewMail extends Affectation {
  constructor() {
    super()
    this.searchBar = new SearchBar()
    this.utils = new Utils()
    this.footer = new Footer()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
  }

  async getParams() {
    const urlParams = new URLSearchParams(window.location.search)
    this.id = urlParams.get('id')
    console.log('this.id —>', this.id)
    console.log('this.datas —>', this.datas)
  }

  async displaySearchBar() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)

    const inputs = [
      {
        label: 'Société:',
        input: true,
        placeholder: 'Société',
      },
      {
        label: 'Nature:',
        input: true,
        placeholder: 'Nature',
      },
      {
        label: 'Action:',
        input: true,
        placeholder: 'A traiter',
      },
      {
        label: 'Commentaire:',
        input: true,
        placeholder: 'P.DOZ - Facture F20231202',
      },
    ]
    await this.searchBar.initSearchBar(inputs)
    const h2 = document.querySelector('h2')
    h2.textContent = inputs[3].placeholder
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
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/assets/sample.pdf',
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
                <option>Mockup pAction1</option>
                <option>Mockup pAction2</option>
                <option>Mockup pAction3</option>
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
                <option>Mockup statut1</option>
                <option>Mockup statut2</option>
                <option>Mockup statut3</option>
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
    await this.getParams()
    await this.displaySearchBar()
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
