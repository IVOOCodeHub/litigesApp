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
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'À Affecter'

    const linkH2 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'À Valider'

    const linkH3 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'Liste'

    const linkH4 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'Calendrier'

    const linkV1 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'Alertes'

    const linkV2 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'Thèmes'

    const linkV3 = document.createElement('a')
    link.href =
      'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html'
    link.title = 'Conseils'

    // Création du conteneur du menu
    const menuContainer = document.createElement('div')
    menuContainer.classList.add('menu-container')

    // Création de la barre de boutons horizontaux
    const horizontalBar = document.createElement('div')
    horizontalBar.classList.add('horizontal-bar')
    for (let i = 0; i < 4; i++) {
      const button = document.createElement('button')
      button.textContent = `Bouton H${i + 1}`
      horizontalBar.appendChild(button)
    }

    // Création de la barre de boutons verticaux
    const verticalBar = document.createElement('div')
    verticalBar.classList.add('vertical-bar')
    for (let j = 0; j < 3; j++) {
      const button = document.createElement('button')
      button.textContent = `Bouton V${j + 1}`
      verticalBar.appendChild(button)
    }

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
