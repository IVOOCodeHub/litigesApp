class Affectation {
  constructor() {
    this.searchBar = new SearchBar()
    this.affectationService = new AffectationService()
    this.endpoint = `http://192.168.0.112/Public/ndecr_test/aAffecter.php`
    this.datas = null
    this.table = new Table()
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.footer = new Footer()
  }

  async getAffectations() {
    const res = await this.affectationService.getAffectations(this.endpoint)
    res['courriers'].sort((a, b) => {
      return new Date(b['dh_saisie']) - new Date(a['dh_saisie'])
    })
    res['courriers'].map((object) => {
      object['dh_saisie'] = this.utils.reformatDate(object['dh_saisie'])
      return object
    })

    if (!this.datas) this.datas = res
    else {
      this.datas = {
        ...this.datas,
        courriers: res['courriers'],
      }
    }
  }

  async displayAffectation() {
    const main = document.createElement('main')
    this.root.appendChild(main)
  }

  async displaySearchBar() {
    const societes = this.datas['societes'].map((societe) => societe['societe'])
    societes.unshift('Toutes')

    const natures = this.datas['nature_pieces'].map(
      (nature) => nature['nature_piece'],
    )
    natures.unshift('Toutes')

    const inputs = [
      {
        label: 'Société:',
        select: true,
        options: societes,
      },
      {
        label: 'Nature:',
        select: true,
        options: natures,
      },
      {
        label: 'Clé courrier:',
        input: true,
        placeholder: 'Référence du courrier...',
      },
    ]

    await this.searchBar.initSearchBar(inputs)
    const h2 = document.querySelector('h2')
    h2.textContent = 'Filtre courrier'

    const searchBtn = document.querySelector('#searchBar button')
    searchBtn.remove()
  }

  async displayTable(isOnLoad) {
    if (!isOnLoad) {
      const tableContainer = document.querySelector('#tableContainer')
      tableContainer.remove()
    }

    const columnsNames = [
      'Clé',
      'Date Récéption',
      'Émetteur',
      'Déstinataire',
      'Pièce',
      'Action',
      'Commentaire',
    ]
    await this.table.initTable(columnsNames, this.datas['courriers'])
  }

  async goToViewMail(key) {
    localStorage.setItem('datas', JSON.stringify(this.datas))
    window.location.href = `viewLitige.html?id=${key}`
  }

  async changeListener(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value

    await this.getAffectations()

    if (htmlSelectElement.name === 'Société:') {
      if (selectedValue !== 'Toutes') {
        this.datas = {
          ...this.datas,
          courriers: this.datas['courriers'].filter(
            (object) => object['societe'] === selectedValue,
          ),
        }
      }
    } else if (htmlSelectElement.name === 'Nature:') {
      if (selectedValue !== 'Toutes') {
        this.datas = {
          ...this.datas,
          courriers: this.datas['courriers'].filter(
            (object) => object['nature'] === selectedValue,
          ),
        }
      }
    } else if (htmlSelectElement.name === 'Clé courrier:') {
      if (selectedValue !== '') {
        this.datas = {
          ...this.datas,
          courriers: this.datas['courriers'].filter(
            (object) => object['cle'] === selectedValue,
          ),
        }
      }
    }

    await this.displayTable(false)
    await this.initEventListeners()
  }

  async initEventListeners() {
    const rows = document.querySelectorAll('tr')
    rows.forEach((row) => {
      row.addEventListener('click', async (event) => {
        event.preventDefault()
        const key = row.firstElementChild.textContent
        await this.goToViewMail(key)
      })
    })

    const searchById = document.querySelector('#searchBar input')
    const selects = document.querySelectorAll('select')

    selects.forEach((select) => {
      select.addEventListener('change', () => this.changeListener(select))
    })
    searchById.addEventListener('change', () => this.changeListener(searchById))
  }

  async initAffectation() {
    await this.displayAffectation()
    await this.getAffectations()
    await this.displaySearchBar()
    await this.displayTable(true)
    await this.footer.initFooter()
    await this.initEventListeners()
  }
}

const affectation = new Affectation()
affectation
  .initAffectation()
  .then(() =>
    console.log(
      `affectation successfully loaded at : ${affectation.utils.getDate()}`,
    ),
  )
  .catch((err) =>
    console.error(
      `affectation failed to load : ${err} at : ${affectation.utils.getDate()}`,
    ),
  )
