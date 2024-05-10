class Header {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.pageName = null
  }

  async getPageName() {
    const url = new URL(window.location.href)

    switch (true) {
      case url.pathname.endsWith('/index.html'): {
        this.pageName = 'Litiges'
        break
      }
      case url.pathname.endsWith('/affectation.html'): {
        this.pageName = 'À affecter'
        break
      }
      case url.pathname.endsWith('/viewMail.html'): {
        this.pageName = 'Consulté un courrier'
        break
      }
      case url.pathname.endsWith('/validation.html'): {
        this.pageName = 'À valider'
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

    this.pageName === 'Litiges'
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
