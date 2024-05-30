class Header {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.pageName = null
    this.url = null
  }

  async getPageName() {
    this.url = new URL(window.location.href)

    switch (true) {
      case this.url.pathname.endsWith('/index.html'): {
        this.pageName = 'Gestion des Litiges'
        break
      }
      case this.url.pathname.endsWith('/affectation.html'): {
        this.pageName = 'Courrier à affecter'
        break
      }
      case this.url.pathname.endsWith('/viewMail.html'): {
        this.pageName = 'Consulter un courier'
        break
      }
      case this.url.pathname.endsWith('/event.html'): {
        this.pageName = 'Liste des évènements'
        break
      }
      case this.url.pathname.endsWith('/list.html'): {
        this.pageName = 'Liste des dossiers'
        break
      }
      case this.url.pathname.endsWith('/calendrier.html'): {
        this.pageName = 'Calendrier des litiges'
        break
      }
      case this.url.pathname.endsWith('/folder.html'): {
        this.pageName = 'Dossier'
        break
      }
      default: {
        this.pageName = ''
      }
    }
  }

  async render() {
    const header = document.createElement('header')

    const link = document.createElement('a')
    link.href = 'http://192.168.0.254:8080/usv_prod/menugeneral.asp'
    link.title = 'Menu général'

    const logoWrapper = document.createElement('figure')
    logoWrapper.classList.add('logoWrapper')

    const brandingLogo = document.createElement('img')
    brandingLogo.classList.add('logoWrapper__logo')

    this.url.pathname.endsWith('/index.html')
      ? (brandingLogo.src = './public/assets/brandingLogo.png')
      : (brandingLogo.src = '../assets/brandingLogo.png')

    const appTitle = document.createElement('h1')
    appTitle.textContent = this.pageName

    logoWrapper.appendChild(brandingLogo)
    link.appendChild(logoWrapper)
    header.appendChild(link)
    header.appendChild(appTitle)
    this.root.appendChild(header)
  }

  async initHeader() {
    await this.getPageName()
    await this.render()
  }
}

const header = new Header()
header
  .initHeader()
  .then(() =>
    console.log(`Header successfully loaded at : ${header.utils.getDate()}`),
  )
  .catch((err) => console.error(`Header failed to load : ${err}`))
