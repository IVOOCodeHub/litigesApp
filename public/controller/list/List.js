class List {
  constructor() {
    this.utils = new Utils()
    this.listService = new ListService()
    this.themeListService = new ThemeListService()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.main = null
    this.root = document.querySelector('#root')
    this.sortDirection = {}
    this.themeList = null
    this.datas = null
    this.activeDatas = null
  }

  async getData() {
    const user = await JSON.parse(localStorage.getItem('user'))
    const userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.listService.getList(userCredentials)

    this.activeDatas = this.datas.filter(
      (datas) => datas['statut'] === 'EN COURS',
    )

    this.themeList = await this.themeListService.getList(userCredentials)
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
              <label for="cle">Clé:</label>
              <input type="text" name="cle" />
          </div>
          <div class="inputWrapper">
              <label for="society">Société:</label>
              <select name="society">
                <option value="Toutes">Toutes</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="tiers">Tiers:</label>
              <select name="tiers">
                <option value="Toutes">Toutes</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="theme">Theme:</label>
              <select name="theme">
                <option value="Choisir">Choisir</option>
              </select>
          </div>
          <div class="inputWrapper">
              <label for="searchStartDate">Date début:</label>
              <input type="date" name="searchStartDate" />
          </div>
          <div class="inputWrapper">
              <label for="statut">Statut:</label>
              <select name="statut">
                <option value="Choisir">Tous</option>
                <option value="A VALIDER">A valider</option>
                <option selected value="EN COURS">En cours</option>
                <option value="AJOURNÉE">Ajournée</option>
                <option value="TERMINÉ">Terminé</option>
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
          <td>${row['societe']} vs ${row['tiers']}</td>
          <td>${row['commentaire']}</td>
          <td>${this.utils.reformatDate(row['datedebut']).split(' ')[0]}</td>
          <td>${row['theme']}</td>
          <td>${row['statut']}</td>
        </tr>
      `
    })
    await this.openFolder()
  }

  async insertSelect() {
    const societySelectOption = []
    const tiersSelectOption = []

    const themeSelect = document.querySelector('select[name="theme"]')

    this.datas.forEach((el) => {
      if (!societySelectOption.includes(el['societe'])) {
        societySelectOption.push(el['societe'])
      }
      if (!tiersSelectOption.includes(el['tiers'])) {
        tiersSelectOption.push(el['tiers'])
      }
    })

    societySelectOption.sort((a, b) => a.localeCompare(b))
    tiersSelectOption.sort((a, b) => a.localeCompare(b))

    const societySelect = document.querySelector('select[name="society"]')
    societySelectOption.forEach((society) => {
      const option = document.createElement('option')
      option.setAttribute('value', society)
      option.textContent = society
      societySelect.appendChild(option)
    })

    const tiersSelect = document.querySelector('select[name="tiers"]')
    tiersSelectOption.forEach((tiers) => {
      const option = document.createElement('option')
      option.setAttribute('value', tiers)
      option.textContent = tiers
      tiersSelect.appendChild(option)
    })

    this.themeList.sort((a, b) => a['theme'].localeCompare(b['theme']))
    this.themeList.forEach((theme) => {
      if (theme['theme'] && theme['actif'] === '1') {
        const option = document.createElement('option')
        option.setAttribute('value', theme['theme'])
        option.textContent = theme['theme']
        themeSelect.appendChild(option)
      }
    })
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
    } else if (htmlSelectElement.name === 'society') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter(
          (row) => row['societe'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'tiers') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter(
          (row) => row['tiers'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'theme') {
      if (selectedValue !== 'Choisir') {
        newDatas = this.datas.filter(
          (row) => row['theme'].trim() === selectedValue,
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'searchStartDate') {
      if (selectedValue !== '') {
        newDatas = this.datas.filter(
          (row) =>
            this.utils.reformatDate(row['datedebut']).split(' ')[0] ===
            this.utils.reformatDate(selectedValue).split(' ')[0],
        )
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'statut') {
      if (selectedValue !== 'Choisir') {
        newDatas = this.datas.filter((row) => row['statut'] === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else {
      newDatas = this.datas
    }

    await this.insertDatas(newDatas)
  }

  async searchBy(elementName) {
    const select = document.querySelector(`[name="${elementName}"]`)
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
    await this.searchBy('cle')
    await this.searchBy('society')
    await this.searchBy('tiers')
    await this.searchBy('theme')
    await this.searchBy('searchStartDate')
    await this.searchBy('statut')
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
    await this.insertDatas(this.activeDatas)
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
