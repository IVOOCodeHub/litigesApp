class Footer {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.footer = null
  }

  async renderFooter() {
    this.footer = document.createElement('footer')
  }

  async renderButton(withValidBtn) {
    const container = document.createElement('div')
    container.setAttribute('class', 'buttonWrapper')
    const goBackButton = document.createElement('button')
    goBackButton.classList.add('goBackButton')
    goBackButton.classList.add('errorButton')
    goBackButton.textContent = 'Retour'

    if (withValidBtn) {
      const validButton = document.createElement('button')
      validButton.setAttribute('class', 'validButton')
      validButton.textContent = 'Valider'
      container.appendChild(validButton)
    }

    container.appendChild(goBackButton)
    this.footer.appendChild(container)
  }

  async initEventListeners() {
    const goBackButton = document.querySelector('.goBackButton')
    goBackButton.addEventListener('click', () => window.history.back())
  }

  async initFooter(withValidBtn) {
    await this.renderFooter()
    await this.renderButton(withValidBtn)
    this.root.appendChild(this.footer)
    await this.initEventListeners()
  }
}
