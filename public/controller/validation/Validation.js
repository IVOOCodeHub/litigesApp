class Validation {
  constructor() {
    this.validationService = new ValidationService()
    this.utils = new Utils()
    this.footer = new Footer()
    this.main = null
    this.root = document.querySelector('#root')
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
        <label>Destinataire: </label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label>Émetteur: </label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    
    <div class="inputWrapper">
        <button>Gérer les sortants</button>
        <button>Gérer les internes</button>
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
          <tbody>
            <tr>
                <td>mockupRef</td>
                <td>mockupDesti</td>
                <td>mockupEmet</td>
                <td>mockupDate</td>
                <td>mockupPiece</td>
                <td>mockupRefDoc</td>
                <td><input type="checkbox"></td>
            </tr>
            <tr>
                <td>mockupRef2</td>
                <td>mockupDesti2</td>
                <td>mockupEmet2</td>
                <td>mockupDate2</td>
                <td>mockupPiece2</td>
                <td>mockupRefDoc2</td>
                <td><input type="checkbox"></td>
            </tr>
          </tbody>
        </table>
    `
    this.main.appendChild(section)
  }

  async initEventListeners() {}

  async initValidation() {
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.footer.initFooter()
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
