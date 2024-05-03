class MainMenu {
  constructor() {
    this.utils = new Utils()
    this.root = document.querySelector('#root')
    this.pageName = null
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
        title: 'À Affecter',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
      {
        title: 'À Valider',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
      {
        title: 'Liste',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
      {
        title: 'Calendrier',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
    ]

    buttonsInfoH.forEach((info) => {
      const button = document.createElement('a')
      button.href = info.href
      button.title = info.title
      button.textContent = info.title
      button.classList.add('button')
      horizontalBar.appendChild(button)
    })

    // Création de la barre de boutons verticaux
    const verticalBar = document.createElement('div')
    verticalBar.classList.add('vertical-bar')

    // Les titres et les liens pour les boutons verticaux
    const buttonsInfoV = [
      {
        title: 'Alertes',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
      {
        title: 'Thèmes',
        href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
      },
      {
        title: 'Conseils',
        // href: 'http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html',
        href: '#',
      },
    ]

    buttonsInfoV.forEach((info) => {
      const button = document.createElement('a')
      button.href = info.href
      button.title = info.title
      button.textContent = info.title
      button.classList.add('button')
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
