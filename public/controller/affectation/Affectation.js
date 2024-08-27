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
                <option>Tous</option>
                <option value="LITIGE REÇU">Entrant</option>
                <option value="LITIGE EMIS">Sortant</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="receptionDate">Date du récéption:</label>
              <input type="date" name="receptionDate" />
          </div>
          <div class="inputWrapper">
              <label for="society">Société:</label>
              <select name="society">
                <option>Toutes</option>
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

  async insertSelect() {
    const societySelectOption = []
    this.datas.forEach((el) => {
      if (!societySelectOption.includes(el['societe'])) {
        societySelectOption.push(el['societe'])
      }
    })

    const societySelect = document.querySelector('select[name="society"]')
    societySelectOption.forEach((society) => {
      societySelect.innerHTML += `
        <option>${society}</option>
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

  async searchFromForm(htmlElement) {
    const htmlElementName = htmlElement.name
    const htmlElementValue = htmlElement.value
    let newDatas = null

    switch (htmlElementName) {
      case 'key':
        if (htmlElementValue !== '') {
          console.log('here !')
          const resultFromValue = await this.datas.filter(
            (row) => row['cle'].trim() === htmlElementValue,
          )
          resultFromValue
            ? (newDatas = resultFromValue)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'type':
        if (htmlElementValue !== 'Tous') {
          const resultFromType = await this.datas.filter(
            (row) => row['nature'].trim() === htmlElementValue,
          )
          resultFromType ? (newDatas = resultFromType) : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break
      case 'receptionDate':
        if (htmlElementValue !== '') {
          const resultFromReceptionDate = await this.datas.filter((row) => {
            return (
              this.utils.reformatDate(row['dh_saisie']).split(' ')[0] ===
              this.utils.reformatDate(htmlElementValue).split(' ')[0]
            )
          })
          resultFromReceptionDate.length > 0
            ? (newDatas = resultFromReceptionDate)
            : (newDatas = this.datas)
        }
        break
      case 'society':
        if (htmlElementValue !== 'Toutes') {
          const resultFromSociety = await this.datas.filter(
            (row) => row['societe'].trim() === htmlElementValue,
          )
          resultFromSociety.length > 0
            ? (newDatas = resultFromSociety)
            : (newDatas = this.datas)
        } else {
          newDatas = this.datas
        }
        break

      default:
        newDatas = this.datas
    }

    await this.insertDatas(newDatas)
    await this.initEventListeners()
  }

  async searchBy(elementName) {
    const htmlElement = document.querySelector(`[name="${elementName}"]`)
    htmlElement.addEventListener(
      'change',
      async () => await this.searchFromForm(htmlElement),
    )
  }

  async initEventListeners() {
    await this.searchBy('key')
    await this.searchBy('type')
    await this.searchBy('receptionDate')
    await this.searchBy('society')

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
    await this.insertSelect()
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
