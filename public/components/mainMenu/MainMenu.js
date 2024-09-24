class MainMenu {
  constructor() {
    this.utils = new Utils()
    this.mainMenuService = new MainMenuService()
    this.root = document.querySelector('#root')
    this.footer = new Footer()
    this.user = null
    this.credentials = null
  }

  async isUserAlreadyConnected() {
    this.user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: this.user['matricule'],
      password: this.user['mdp'],
    }
    if (!this.user) {
      window.location.href = `http://srv-web:8080/usv_prod/menu0.asp`
    }
  }

  async getLitigesDictionary() {
    const datas = await this.mainMenuService.getDictionary(this.credentials)
    localStorage.setItem('eventTypes', JSON.stringify(datas['event_types']['rows']))
    localStorage.setItem('juridictionTypes', JSON.stringify(datas['juridiction_types']['rows']))
  }

  async render() {
    // Création du conteneur du menu
    const menuContainer = document.createElement('div')
    menuContainer.classList.add('menu-container')

    // Création de la barre de boutons horizontaux
    const horizontalBar = document.createElement('div')
    horizontalBar.classList.add('horizontal-bar')

    // Les titres et les liens pour les boutons horizontaux
    const buttonsInfoH = [
      {
        title: 'Courrier a affecter',
        href: './public/views/affectation.html',
      },
      {
        title: 'Liste des dossiers',
        href: './public/views/list.html',
      },
      {
        title: 'Liste des évènements',
        href: './public/views/event.html',
      },
      {
        title: 'Calendrier events',
        href: './public/views/calendrier.html',
      },
    ]

    buttonsInfoH.forEach((info) => {
      const button = document.createElement('a')
      button.href = info.href
      button.title = info.title
      button.textContent = info.title
      button.classList.add('menuButton')
      horizontalBar.appendChild(button)
    })

    // Création de la barre de boutons verticaux
    const verticalBar = document.createElement('div')
    verticalBar.classList.add('vertical-bar')

    // Les titres et les liens pour les boutons verticaux
    const buttonsInfoV = [
      {
        title: 'Alertes',
        href: './public/views/views/#.html',
      },
      {
        title: 'Thèmes',
        href: './public/views/themeList.html',
      },
      {
        title: 'Conseils',
        href: './public/views/#.html',
      },
    ]

    buttonsInfoV.forEach((info) => {
      const button = document.createElement('a')
      button.href = info.href
      button.title = info.title
      button.textContent = info.title
      button.classList.add('menuButton')
      verticalBar.appendChild(button)
      // test du php au clic
      if (info.title === 'Conseils') {
        button.addEventListener('click', (e) => {
          e.preventDefault() // Empêche le navigateur de suivre le lien
          this.fetchTest() // Déclenche la fonction de récupération des données
        })
      }
    })

    // Ajout des barres au conteneur du menu
    menuContainer.appendChild(horizontalBar)
    menuContainer.appendChild(verticalBar)

    // Ajout du menu au root de la page
    this.root.appendChild(menuContainer)
  }

  async fetchTest() {
    const url = 'http://192.168.0.112/Public/ndecr_test/aAffecter.php'
    const options = {
      method: 'GET', // ou 'POST' selon la méthode que votre serveur attend
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez d'autres en-têtes ici si nécessaire
      },
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('data récupérées :', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async initMainMenu() {
    await this.isUserAlreadyConnected()
    await this.getLitigesDictionary()
    await this.render()
    await this.footer.initFooter()
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
