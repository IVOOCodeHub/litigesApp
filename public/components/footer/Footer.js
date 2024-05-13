class Footer {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.footer = null
  }

  async renderFooter() {
    this.footer = document.createElement('footer')
  }

  async renderButton() {
    const container = document.createElement('buttonWrapper')
    const goBackButton = document.createElement('button')
    goBackButton.classList.add('goBackButton')
    goBackButton.classList.add('errorButton')
    goBackButton.textContent = 'Retour'

    container.appendChild(goBackButton)
    this.footer.appendChild(container)
  }

  async initEventListeners() {
    const goBackButton = document.querySelector('.goBackButton')
    goBackButton.addEventListener('click', () => window.history.back())
  }

  async initFooter() {
    await this.renderFooter()
    await this.renderButton()
    this.root.appendChild(this.footer)
    await this.initEventListeners()
  }
}
