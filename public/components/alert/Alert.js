class Alert {
  constructor() {
    this.utils = new Utils()
    this.main = null
  }

  async displayAlert(message) {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'alert')

    section.innerHTML += `
        <div class='alertWrapper'>
            <form>
                <h2>${message}</h2>
                <div class="buttonWrapper">
                    <button class="validButton alertValidation">Valider</button>
                    <button class="errorButton alertCancel">Annuler</button>
                </div>
            </form>
        </div>
        `
    this.main.appendChild(section)
    await this.utils.trapFocus(section)
  }

  async closeAlert() {
    const alert = document.querySelector('#alert')
    alert.remove()
  }

  async initEventListeners() {
    const cancelButton = document.querySelector('.alertCancel')
    const validButton = document.querySelector('.alertValidation')
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.closeAlert())
      return false
    }
    if (validButton) {
      return true
    }
  }

  async initAlert(message) {
    await this.displayAlert(message)
    await this.initEventListeners()
  }
}
