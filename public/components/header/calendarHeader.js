class HeaderRenderer {
  constructor(rootSelector, pageName) {
    this.root = document.querySelector(rootSelector)
    if (!this.root) throw new Error('Root element not found')
    this.pageName = pageName
  }
// ceci est un Header retravaillé pour la page du calendrier
  async render() {
    const header = document.createElement('header')

    const link = document.createElement('a')
    link.href = 'http://192.168.0.254:8080/usv_prod/menugeneral.asp'
    link.title = 'Menu général'

    const logoWrapper = document.createElement('figure')
    logoWrapper.classList.add('logoWrapper')

    const brandingLogo = document.createElement('img')
    brandingLogo.classList.add('logoWrapper__logo')
    brandingLogo.src =
      this.pageName === 'Litiges'
        ? './public/assets/brandingLogo.png'
        : './public/assets/brandingLogo.png'

    const appTitle = document.createElement('h1')
    appTitle.textContent = this.pageName

    logoWrapper.appendChild(brandingLogo)
    link.appendChild(logoWrapper)
    header.appendChild(link)
    header.appendChild(appTitle)

    this.root.appendChild(header)
  }
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  const pageName = document.title // or another method to get the current page context
  const headerRenderer = new HeaderRenderer('#headerContainer', pageName)
  headerRenderer
    .render()
    .catch((error) => console.error('Failed to render header:', error))
})
