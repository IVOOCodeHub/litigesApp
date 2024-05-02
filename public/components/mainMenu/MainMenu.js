class MainMenu {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.pageName = null
  }

  // TODO : A TOI DE JOUER LOLO 🤣 Exemple classe dans header/Header.js | MainMenu.js = index.html (entry point, menu général)
  // http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html (1ère URL, (A affecter)

  async render() {
    const linkH1 = document.createElement('a')
    linkH1.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkH1.title = 'À Affecter'

    const linkH2 = document.createElement('a')
    linkH2.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkH2.title = 'À Valider'

    const linkH3 = document.createElement('a')
    linkH3.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkH3.title = 'Liste'

    const linkH4 = document.createElement('a')
    linkH4.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkH4.title = 'Calendrier'

    const linkV1 = document.createElement('a')
    linkV1.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkV1.title = 'Alertes'

    const linkV2 = document.createElement('a')
    linkV2.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkV2.title = 'Thèmes'

    const linkV3 = document.createElement('a')
    linkV3.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    linkV3.title = 'Conseils'

    // Création du conteneur du menu
    const menuContainer = document.createElement('div')
    menuContainer.classList.add('menu-container')

    // Création de la barre de boutons horizontaux
    const horizontalBar = document.createElement('div')
    horizontalBar.classList.add('horizontal-bar')

    const buttonH1 = document.createElement('button')
    buttonH1.textContent = 'À Affecter'
    horizontalBar.appendChild(buttonH1)
    buttonH1.appendChild(linkH1)

    const buttonH2 = document.createElement('button')
    buttonH2.textContent = 'À Valider'
    horizontalBar.appendChild(buttonH2)
    buttonH2.appendChild(linkH2)

    const buttonH3 = document.createElement('button')
    buttonH3.textContent = 'Liste'
    horizontalBar.appendChild(buttonH3)
    buttonH3.appendChild(linkH3)

    const buttonH4 = document.createElement('button')
    buttonH4.textContent = 'Calendrier'
    horizontalBar.appendChild(buttonH4)
    buttonH4.appendChild(linkH4)

    // Création de la barre de boutons verticaux
    const verticalBar = document.createElement('div')
    verticalBar.classList.add('vertical-bar')

    const buttonV1 = document.createElement('button')
    buttonV1.textContent = 'Alertes'
    verticalBar.appendChild(buttonV1)
    buttonV1.appendChild(linkV1)

    const buttonV2 = document.createElement('button')
    buttonV2.textContent = 'Thèmes'
    verticalBar.appendChild(buttonV2)
    buttonV2.appendChild(linkV2)

    const buttonV3 = document.createElement('button')
    buttonV3.textContent = 'Conseils'
    verticalBar.appendChild(buttonV3)
    buttonV3.appendChild(linkV3)

    // Ajout des barres au conteneur du menu
    menuContainer.appendChild(horizontalBar)
    menuContainer.appendChild(verticalBar)

    // Ajout du menu au root de la page
    this.root.appendChild(menuContainer)
  }

  async initMainMenu() {
    await this.render()
  }
}

const mainMenu = new MainMenu()
mainMenu
  .initMainMenu()
  .then(() =>
    console.log(
      `MainMenu successfully loaded at : ${mainMenu.utils.getDate()}`,
    ),
  )
  .catch((err) => console.error(`MainMenu failed to load : ${err}`))
