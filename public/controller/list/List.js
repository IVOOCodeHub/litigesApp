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
          <option>Toutes</option>
          <option>societe1</option>
          <option>societe2</option>
          <option>societe3</option>
          <option>societe4</option>
          <option>societe5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="tiers">Tiers:</label>
        <select name="tiers">
          <option>Toutes</option>
          <option>tiers1</option>
          <option>tiers2</option>
          <option>tiers3</option>
          <option>tiers4</option>
          <option>tiers5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="theme">Theme :</label>
        <select name="theme">
          <option>Choisir</option>
          <option>theme1</option>
          <option>theme2</option>
          <option>theme3</option>
          <option>theme4</option>
          <option>theme5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="statut">Statut :</label>
        <select name="statut">
          <option>Choisir</option>
          <option>A valider</option>
          <option>En cours</option>
          <option>Ajourné</option>
          <option>Cloturé</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="searchDate">Date début :</label>
        <input type="date" />
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
              <th data-sort="code">Code <span class="chevron"></span></th>
              <th data-sort="society">Société <span class="chevron"></span></th>
              <th data-sort="label">Libéllé <span class="chevron"></span></th>
              <th>Description</th>
              <th data-sort="date">Date <span class="chevron"></span></th>
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
          <td>${row['societe']}</td>
          <td>${row['societe']} vs ${row['tiers']}</td>
          <td>${row['commentaire']}</td>
          <td>${this.utils.reformatDate(row['datedebut'])}</td>
          <td>${row['statut']}</td>
        </tr>      
      `
    })
    await this.openFolder()
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value
    let newDatas = null

    if (htmlSelectElement.name === 'society') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row['societe'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'statut') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row['statut'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'unit') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row['libele'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'subUnit') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.description === selectedValue)
      } else {
        newDatas = this.datas
      }
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

  async searchByStatut() {
    const select = document.querySelector('select[name="statut"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchByUnit() {
    const select = document.querySelector('select[name="unit"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchBySubUnit() {
    const select = document.querySelector('select[name="subUnit"]')
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

    if (column === 'code') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['cle'].localeCompare(b['cle'])
          : b['cle'].localeCompare(a['cle']),
      )
    } else if (column === 'society') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['societe'].localeCompare(b['societe'])
          : b['cle'].localeCompare(b['societe']),
      )
    } else if (column === 'label') {
      sortedDatas.sort((a, b) =>
        direction === 'asc'
          ? a['societe'].localeCompare(b['societe'])
          : b['societe'].localeCompare(a['societe']),
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
    await this.searchByStatut()
    await this.searchByUnit()
    await this.searchBySubUnit()
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
