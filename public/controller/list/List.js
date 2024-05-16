class List {
  constructor() {
    this.utils = new Utils()
    this.footer = new Footer()
    this.createNewFolder = new CreateNewFolder()
    this.main = null
    this.root = document.querySelector('#root')
    this.datas = [
      {
        code: 'mockupCode',
        societe: 'mockupSociete',
        statut: 'mockupStatut',
        libele: 'mockupLibele',
        description: 'mockupDescription',
        date: 'mockupDate',
        stat: 'mockupStat',
      },
      {
        code: 'mockupCode2',
        societe: 'mockupSociete2',
        statut: 'mockupStatut2',
        libele: 'mockupLibele2',
        description: 'mockupDescription2',
        date: 'mockupDate2',
        stat: 'mockupStat2',
      },
      {
        code: 'mockupCode3',
        societe: 'mockupSociete3',
        statut: 'mockupStatut3',
        libele: 'mockupLibele3',
        description: 'mockupDescription3',
        date: 'mockupDate3',
        stat: 'mockupStat3',
      },
    ]
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
          <option>mockupSociete</option>
          <option>mockupSociete2</option>
          <option>mockupSociete3</option>
          <option>mockupSociete4</option>
          <option>mockupSociete5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="statut">Statut:</label>
        <select name="statut">
          <option>Toutes</option>
          <option>mockupStatut</option>
          <option>mockupStatut2</option>
          <option>mockupStatut3</option>
          <option>mockupStatut4</option>
          <option>mockupStatut5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="unit">Unité org. :</label>
        <select name="unit">
          <option>Toutes</option>
          <option>mockupLibele</option>
          <option>mockupLibele2</option>
          <option>mockupLibele3</option>
          <option>mockupLibele4</option>
          <option>mockupLibele5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="subUnit">SS Unité org. :</label>
        <select name="subUnit">
          <option>Toutes</option>
          <option>mockupDescription</option>
          <option>mockupDescription2</option>
          <option>mockupDescription3</option>
          <option>mockupDescription4</option>
          <option>mockupDescription5</option>
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
              <th>Code</th>
              <th>Société</th>
              <th>Libéllé</th>
              <th>Description</th>
              <th>Date</th>
              <th>Stat.</th>
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
    datas.forEach((row) => {
      tableBody.innerHTML += `
        <tr>
          <td>${row.code}</td>
          <td>${row.societe}</td>
          <td>${row.libele}</td>
          <td>${row.description}</td>
          <td>${row.date}</td>
          <td>${row.stat}</td>
        </tr>      
      `
    })
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value
    let newDatas = null

    if (htmlSelectElement.name === 'society') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.societe === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'statut') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.statut === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'unit') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.libele === selectedValue)
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

  async initEventListeners() {
    await this.searchBySociety()
    await this.searchByStatut()
    await this.searchByUnit()
    await this.searchBySubUnit()

    const createNewFolderButton = document.querySelector('.validButton')
    createNewFolderButton.addEventListener(
      'click',
      async () => await this.createNewFolder.initCreateNewFolder(),
    )
  }

  async initList() {
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
