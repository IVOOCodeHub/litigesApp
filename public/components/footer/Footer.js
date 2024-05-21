class Footer {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.footer = null
  }

  async renderFooter() {
    this.footer = document.createElement('footer')
  }

  async renderButton(withValidBtn, buttonMessage) {
    const container = document.createElement('div')
    container.setAttribute('class', 'buttonWrapper')
    const goBackButton = document.createElement('button')
    goBackButton.classList.add('goBackButton')
    goBackButton.classList.add('errorButton')
    goBackButton.textContent = 'Retour'

    if (withValidBtn) {
      const validButton = document.createElement('button')
      validButton.setAttribute('class', 'validButton')
      if (buttonMessage) {
        validButton.textContent = buttonMessage
      } else {
        validButton.textContent = 'Valider'
      }
      container.appendChild(validButton)
    }

    container.appendChild(goBackButton)
    this.footer.appendChild(container)
  }

  async initEventListeners() {
    const goBackButton = document.querySelector('.goBackButton')
    goBackButton.addEventListener('click', () => window.history.back())
  }

  async initFooter(withValidBtn, buttonMessage) {
    await this.renderFooter()
    await this.renderButton(withValidBtn, buttonMessage)
    this.root.appendChild(this.footer)
    await this.initEventListeners()
  }
}
