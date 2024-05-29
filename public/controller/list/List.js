class List {
  constructor() {
    this.utils = new Utils()
    this.listService = new ListService()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.main = null
    this.root = document.querySelector('#root')
    this.sortDirection = {}
  }

  async getData() {
    const user = await JSON.parse(localStorage.getItem('user'))
    const userDatas = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.listService.getList(userDatas)
    console.log('datas —>', this.datas)
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async initForm() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchList')

    section.innerHTML = `
          <div class="inputWrapper">
              <label for="society">Société:</label>
              <select name="society">
                <option value="toutes">Toutes</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="tiers">Tiers:</label>
              <select name="tiers">
                <option value="toutes">Toutes</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="theme">Theme :</label>
              <select name="theme">
                <option value="choisir">Choisir</option>
                <option value="Amauger">Amauger</option>
                <option value="Cial">Cial</option>
                <option value="Divers">Divers</option>
                <option value="Fiscal">Fiscal</option>
                <option value="Penal">Penal</option>
                <option value="RC">RC</option>
                <option value="Social">Social</option>
                <option value="Stenico">Stenico</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="searchStartDate">Date début :</label>
              <input type="date" name="searchStartDate" />
          </div>
          <div class="inputWrapper">
              <label for="statut">Statut :</label>
              <select name="statut">
                <option value="choisir">Choisir</option>
                <option value="a_valider">A valider</option>
                <option value="en_cours">En cours</option>
                <option value="ajourne">Ajourné</option>
                <option value="cloture">Cloturé</option>
              </select>
          </div>
        `
    this.main.appendChild(section)
  }

  async initTable() {
    const section = document.createElement('section')
    section.setAttribute('id', 'tableContainer')
    section.innerHTML += `
    <table>
        <thead>
            <tr>
              <th data-sort="cle">Cle <span class="chevron"></span></th>
              <th data-sort="name">Nom <span class="chevron"></span></th>
              <th>Commentaire</th>
              <th data-sort="date">Date début<span class="chevron"></span></th>
              <th data-sort="theme">Theme <span class="chevron"></span></th>
              <th data-sort="stat">Stat. <span class="chevron"></span></th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
    `
    this.main.appendChild(section)
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''
    datas?.forEach((row) => {
      tableBody.innerHTML += `
        <tr>
          <td>${row['cle']}</td>
          <td>${row['tiers']} vs ${row['societe']}</td>
          <td>${row['commentaire']}</td>
          <td>${this.utils.reformatDate(row['datedebut']).split(' ')[0]}</td>
          <td>${row['theme']}</td>
          <td>${row['statut']}</td>
        </tr>
      `
    })
    await this.openFolder()

    // // J'extrais les valeurs uniques pour les 2 select concernés
    // const societies = [...new Set(datas.map((row) => row['societe']))]
    // const tiers = [...new Set(datas.map((row) => row['tiers']))]
    //
    // // J'insert les options dans les 2 select
    // this.insertOptions('select[name="society"]', ['Toutes', ...societies])
    // this.insertOptions('select[name="tiers"]', ['Toutes', ...tiers])
  }

  async insertSelect() {
    const societySelectOption = []
    const tiersSelectOption = []
    this.datas.forEach((el) => {
      if (!societySelectOption.includes(el['societe'])) {
        societySelectOption.push(el['societe'])
      }
      if (!tiersSelectOption.includes(el['tiers'])) {
        tiersSelectOption.push(el['tiers'])
      }
    })

    const societySelect = document.querySelector('select[name="society"]')
    societySelectOption.forEach((society) => {
      societySelect.innerHTML += `
        <option>${society}</option>
      `
    })
    const tiersSelect = document.querySelector('select[name="tiers"]')
    tiersSelectOption.forEach((tiers) => {
      tiersSelect.innerHTML += `
        <option>${tiers}</option>
      `
    })
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value.toLowerCase().trim()
    console.log('selectedValue —>', selectedValue)
    let newDatas = null

    if (htmlSelectElement.name === 'society') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row['societe'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'tiers') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.description === selectedValue)
      }
    } else if (htmlSelectElement.name === 'theme') {
      if (selectedValue !== 'choisir') {
        newDatas = this.datas.filter((row) => row['libele'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'statut') {
      if (selectedValue !== 'choisir') {
        newDatas = this.datas.filter((row) => row['statut'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else {
      newDatas = this.datas
    }

    await this.insertDatas(newDatas)
  }

  async searchBySociety() {
    const select = document.querySelector('select[name="society"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchByTiers() {
    const select = document.querySelector('select[name="tiers"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchByTheme() {
    const select = document.querySelector('select[name="theme"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchByStartDate() {
    const select = document.querySelector('input[name="searchStartDate"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchByStatut() {
    const select = document.querySelector('select[name="statut"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async openFolder() {
    const tableBody = document.querySelector('table tbody')
    const rows = tableBody.querySelectorAll('tr')

    rows.forEach((row) => {
      const code = row.querySelector('td:nth-child(1)').textContent
      row.addEventListener('click', () => {
        window.location.href = `folder.html?id=${code}`
      })
    })
  }

  async dataSort() {
    const headers = document.querySelectorAll('th[data-sort]')
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        this.sortTable(header.getAttribute('data-sort'))
      })
    })
  }

  async sortTable(column) {
    const direction = this.sortDirection[column] || 'asc'
    let sortedDatas = [...this.datas]

    if (column === 'cle') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['cle'].localeCompare(b['cle'])
          : b['cle'].localeCompare(a['cle']),
      )
    } else if (column === 'name') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['societe'].localeCompare(b['societe'])
          : b['cle'].localeCompare(b['societe']),
      )
    } else if (column === 'theme') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['theme'].localeCompare(b['theme'])
          : b['theme'].localeCompare(a['theme']),
      )
    } else if (column === 'date') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? new Date(a['datedebut']) - new Date(b['datedebut'])
          : new Date(b['datedebut']) - new Date(a['datedebut']),
      )
    } else if (column === 'stat') {
      sortedDatas.sort((a, b) => {
        direction === 'asc'
          ? a['statut'].localeCompare(b['statut'])
          : b['statut'].localeCompare(a['statut'])
      })
    }

    this.sortDirection[column] = direction === 'asc' ? 'desc' : 'asc'
    await this.insertDatas(sortedDatas)

    // update the sort icon (chevron) if the sort is called
    const headers = document.querySelectorAll('th[data-sort]')
    headers.forEach((header) => {
      header.classList.remove('th-sort-asc', 'th-sort-desc')
    })
    const header = document.querySelector(`th[data-sort="${column}"]`)
    header.classList.add(
      this.sortDirection[column] === 'asc' ? 'th-sort-asc' : 'th-sort-desc',
    )
  }

  async initEventListeners() {
    await this.searchBySociety()
    await this.searchByTiers()
    await this.searchByTheme()
    await this.searchByStartDate()
    await this.searchByStatut()
    await this.dataSort()

    const createNewFolderButton = document.querySelector('.validButton')
    createNewFolderButton.addEventListener(
      'click',
      async () => await this.createNewFolder.initCreateNewFolder(),
    )
  }

  async initList() {
    await this.getData()
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.insertDatas(this.datas)
    await this.insertSelect()
    await this.footer.initFooter(true, 'Créer un dossier vierge')
    await this.initEventListeners()
  }
}

const list = new List()
list
  .initList()
  .then(() => {
    console.log(`List successfully loaded at : ${list.utils.getDate()}`)
  })
  .catch((err) =>
    console.error(`List failed to load : ${err} at: ${list.utils.getDate()}`),
  )
