class FolderHistory {
  constructor() {
    this.main = null
  }

  async renderFolderHistory() {
    this.main = document.querySelector('main')
    const section = document.createElement('section')
    section.setAttribute('id', 'folderHistory')

    section.innerHTML += `
      <div class="historyWrapper">
       <h2>Historique du dossier : </h2>
       <p class="subtitle">*TITRE DU DOSSIER*</p>
       <article>
        <div>
          <label>Statut : </label>
          <p>*statut*</p>
        </div>
        <div>
          <label>Statut : </label>
          <p>*statut*</p>
        </div>
        <div>
          <label>Statut : </label>
          <p>*statut*</p>
        </div>
        <div class="btnWrapper">
          <button class="button closeModal">Fermer</button>
        </div>
      </article>
      </div>
    `
    this.main.appendChild(section)
  }

  async closeModal() {
    const section = document.querySelector('#folderHistory')
    section.remove()
  }

  async initEventListeners() {
    const closeBtn = document.querySelector('.closeModal')
    closeBtn.addEventListener('click', () => this.closeModal())
  }

  async initFolderHistory() {
    await this.renderFolderHistory()
    await this.initEventListeners()
  }
}
