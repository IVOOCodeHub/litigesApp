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

  async initEventListeners() {}

  async initValidation() {
    await this.initMain()
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
