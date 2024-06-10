class ThemeList {
  constructor() {
    this.main = null
    this.themes = [
      'Amauger',
      'Cial',
      'Divers',
      'Fiscal',
      'Penal',
      'RC',
      'Social',
      'Stenico',
    ]
  }

  async renderThemeList() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'themeListModal')

    section.innerHTML += `
      <div class="themeListWrapper">
        <h2>Liste des Thèmes</h2>
        <ul id="themeList"></ul>
        <div class="inputWrapper">
          <input type="text" id="newThemeInput" placeholder="Ajouter un nouveau thème" />
          <button id="addThemeButton">Ajouter</button>
        </div>
        <button class="closeModal">Fermer</button>
      </div>
    `
    this.main.appendChild(section)

    this.themeListElement = section.querySelector('#themeList')
    this.newThemeInput = section.querySelector('#newThemeInput')
    this.addThemeButton = section.querySelector('#addThemeButton')
    this.closeButton = section.querySelector('.closeModal')

    this.addThemeButton.addEventListener('click', () => this.addTheme())
    this.closeButton.addEventListener('click', () => this.closeModal())

    this.renderThemes()
  }

  renderThemes() {
    this.themeListElement.innerHTML = ''
    this.themes.forEach((theme, index) => {
      const li = document.createElement('li')
      li.textContent = theme

      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Supprimer'
      deleteButton.addEventListener('click', () => this.removeTheme(index))

      li.appendChild(deleteButton)
      this.themeListElement.appendChild(li)
    })
  }

  addTheme() {
    const newTheme = this.newThemeInput.value.trim()
    if (newTheme) {
      this.themes.push(newTheme)
      this.newThemeInput.value = ''
      this.renderThemes()
    }
  }

  removeTheme(index) {
    this.themes.splice(index, 1)
    this.renderThemes()
  }

  closeModal() {
    const modal = document.getElementById('themeListModal')
    modal.remove()
  }

  async initEventListeners() {
    const closeBtn = document.querySelector('.closeModal')
    closeBtn.addEventListener('click', () => this.closeModal())
  }

  async initThemeList() {
    await this.renderThemeList()
    await this.initEventListeners()
  }
}

// Initialiser le composant après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  new ThemeList().initThemeList()
})
