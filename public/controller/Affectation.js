class Affectation {
  constructor() {
    this.searchBar = new SearchBar()
    this.table = new Table()
    this.utils = new Utils()
    this.root = document.querySelector('#root')
  }

  async displayAffectation() {
    const main = document.createElement('main')
    this.root.appendChild(main)
  }

  async displaySearchBar() {
    const inputs = [
      {
        label: 'Société : ',
        select: true,
        options: ['Toutes', 'Mockup1', 'Mockup2', 'Mockup3'],
      },
      {
        label: 'Nature : ',
        select: true,
        options: ['Toutes', 'Mockup1', 'Mockup2', 'Mockup3'],
      },
      {
        label: 'Clé courrier : ',
        input: true,
        placeholder: 'Référence du courrier...',
      },
    ]
    await this.searchBar.initSearchBar(inputs)
    const h2 = document.querySelector('h2')
    h2.textContent = 'Filtre courrier'
  }

  async displayTable() {
    await this.table.renderTable()
  }

  async initAffectation() {
    await this.displayAffectation()
    await this.displaySearchBar()
    await this.displayTable()
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
