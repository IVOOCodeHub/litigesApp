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
    goBackButton.textContent = 'Retour'

    container.appendChild(goBackButton)
    this.footer.appendChild(container)
  }

  async initFooter() {
    await this.renderFooter()
    await this.renderButton()
    this.root.appendChild(this.footer)
  }
}

const footer = new Footer()
footer
  .initFooter()
  .then(() =>
    console.log(`Footer successfully loaded at : ${footer.utils.getDate()}`),
  )
  .catch((err) =>
    console.error(
      `Footer failed to load : ${err} at: ${footer.utils.getDate()}`,
    ),
  )
