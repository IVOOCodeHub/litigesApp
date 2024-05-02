class MainMenu {
  constructor() {
    this.utils = new Utils()
  }

  // TODO : A TOI DE JOUER LOLO 🤣 Exemple classe dans header/Header.js | MainMenu.js = index.html (entry point, menu général)
  // http://192.168.0.254:8080/usv_prod/litigesApp/public/views/affectation.html (1ère URL, (A affecter)


  async initMainMenu() {}
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
