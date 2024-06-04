class Affectation {
  constructor() {
    this.affectationService = new AffectationService()
    this.main = null
    this.datas = null
    this.table = new Table()
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.footer = new Footer()
  }

  async getData() {
    await this.loader()
    const user = await JSON.parse(localStorage.getItem('user'))
    const userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.affectationService.getMail(userCredentials)
    localStorage.setItem('datas', JSON.stringify(this.datas))
    console.log('this.datas —>', this.datas)
    this.main.innerHTML = ''
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async initForm() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchMailAffectation')

    section.innerHTML = `
          <div class="inputWrapper">
              <label for="key">Clé du courrier:</label>
              <input type="text" name="key" />
          </div>
          <div class="inputWrapper">
              <label for="type">Type du courrier:</label>
              <select name="type">
                <option value="Choisir">Choisir</option>
                <option value="inbox">Entrant</option>
                <option value="outbox">Sortant</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="receptionDate">Date du récéption:</label>
              <input type="date" name="receptionDate" />
          </div>
          <div class="inputWrapper">
              <label for="society">Société:</label>
              <select name="society">
                <option value="Toutes">Toutes</option>
              </select>
          </div>
        `
    this.main.appendChild(section)
  }

  async renderTable(isOnLoad) {
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
      'Commentaire',
    ]
    await this.table.initTable(columnsNames, this.datas)
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''
    datas?.forEach((row) => {
      tableBody.innerHTML += `
        <tr>
          <td>${row['cle']}</td>
          <td>${this.utils.reformatDate(row['dh_saisie']).split(' ')[0]}</td>
          <td>${row['societe_emettrice']}</td>
          <td>${row['societe']}</td>
          <td>${row['nature']}</td>
          <td>${row['commentaire']}</td>
        </tr>
      `
    })
  }

  async goToViewMail(key) {
    window.location.href = `viewMail.html?id=${key}`
  }

  async loader() {
    const loader = document.createElement('div')
    loader.classList.add('loader')

    this.main.appendChild(loader)
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value
    let newDatas = null
    if (htmlSelectElement.name === 'cle') {
      if (selectedValue !== '') {
        newDatas = this.datas.filter(
          (row) => row['cle'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else {
      newDatas = this.datas
    }

    await this.insertDatas(newDatas)
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
  }

  async initAffectation() {
    await this.initMain()
    await this.getData()
    await this.initForm()
    await this.renderTable(true)
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
