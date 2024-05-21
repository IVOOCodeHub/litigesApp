class Validation {
  constructor() {
    this.validationService = new ValidationService()
    this.utils = new Utils()
    this.footer = new Footer()
    this.alert = new Alert()
    this.main = null
    this.root = document.querySelector('#root')
    this.datas = [
      {
        ref: 'mockupRef',
        dest: 'mockupDest',
        emet: 'mockupEmet',
        date: 'mockupDate',
        piece: 'mockupPiece',
        refDoc: 'mockupRefDoc',
      },
      {
        ref: 'mockupRef2',
        dest: 'mockupDest2',
        emet: 'mockupEmet2',
        date: 'mockupDate2',
        piece: 'mockupPiece2',
        refDoc: 'mockupRefDoc2',
      },
      {
        ref: 'mockupRef3',
        dest: 'mockupDest2',
        emet: 'mockupEmet2',
        date: 'mockupDate3',
        piece: 'mockupPiece3',
        refDoc: 'mockupRefDoc3',
      },
    ]
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async initForm() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchFolder')

    section.innerHTML = `
    <div class="inputWrapper">
        <label for="recipient">Destinataire: </label>
        <select name="recipient">
          <option>Toutes</option>
          <option>mockupDest</option>
          <option>mockupDest2</option>
          <option>mockupDest3</option>
          <option>mockupDest4</option>
          <option>mockupDest5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label for="sender">Émetteur: </label>
        <select name="sender">
          <option>Toutes</option>
          <option>mockupEmet</option>
          <option>mockupEmet2</option>
          <option>mockupEmet3</option>
          <option>mockupEmet4</option>
          <option>mockupEmet5</option>
        </select>
    </div>
    
    <div class="inputWrapper">
        <button class="button">Gérer les sortants</button>
        <button class="button">Gérer les internes</button>
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
                <th>Réf.</th>
                <th>Destinataire</th>
                <th>Émetteur</th>
                <th>Date</th>
                <th>Pièce</th>
                <th>Réf.doc.</th>
                <th>Sélectionner</th>
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
          <td>${row.ref}</td>
          <td>${row.dest}</td>
          <td>${row.emet}</td>
          <td>${row.date}</td>
          <td>${row.piece}</td>
          <td>${row.refDoc}</td>
          <td><input type="checkbox"></td>
        </tr>      
      `
    })
  }

  async submitValidation() {
    const validatedLitiges = []
    const allRows = document.querySelectorAll('tbody tr')
    allRows.forEach((row) => {
      const checkbox = row.querySelector('input[type="checkbox"]')
      if (checkbox.checked) {
        // get the ref of the row where the checkbox is checked and push it in validatedLitiges array
        validatedLitiges.push(row.querySelector('td:nth-child(1)').textContent)
      }
    })

    const isValidate = await this.alert.initAlert(
      'Êtes-vous sur de vouloir valider ces litiges ?',
    )
    if (!isValidate) return

    console.log('validatedLitiges —>', validatedLitiges)
  }

  async searchByRecipient() {
    const select = document.querySelector('select[name="recipient"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchBySender() {
    const select = document.querySelector('select[name="sender"]')
    select.addEventListener(
      'change',
      async () => await this.searchFromSelect(select),
    )
  }

  async searchFromSelect(htmlSelectElement) {
    const selectedValue = htmlSelectElement.value
    let newDatas = null

    if (htmlSelectElement.name === 'recipient') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.dest === selectedValue)
      } else {
        newDatas = this.datas
      }
    } else if (htmlSelectElement.name === 'sender') {
      if (selectedValue !== 'Toutes') {
        newDatas = this.datas.filter((row) => row.emet === selectedValue)
      } else {
        newDatas = this.datas
      }
    }

    await this.insertDatas(newDatas)
  }

  async initEventListeners() {
    await this.searchByRecipient()
    await this.searchBySender()

    const submitButton = document.querySelector('.validButton')
    submitButton.addEventListener('click', () => this.submitValidation())
  }

  async initValidation() {
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.insertDatas(this.datas)
    await this.footer.initFooter(true)
    await this.initEventListeners()
  }
}

const validation = new Validation()
validation
  .initValidation()
  .then(() =>
    console.log(
      `Validation successfully loaded at : ${validation.utils.getDate()}`,
    ),
  )
  .catch((err) =>
    console.error(
      `Validation failed to load : ${err} at : ${validation.utils.getDate()}`,
    ),
  )
