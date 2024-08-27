class FolderHistory {
  constructor() {
    this.utils = new Utils()
    this.folderService = new FolderService()
    this.foldersDatas = null
    this.main = null
    this.credentials = null
    this.section = null
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.credentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.foldersDatas = await this.folderService.getFolder(this.credentials)

    console.log('this.foldersDatas —>', this.foldersDatas)
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderModale() {
    this.section = document.createElement('section')
    this.section.setAttribute('id', 'folderHistory')

    if (!this.foldersDatas) {
      this.section.innerHTML += `
       <div class="tableContainer">
         <h2>Aucun dossier n'est associé à celui-ci</h2>
       </div>
      `
    } else {
      this.section.innerHTML += `
        <div class="tableContainer">
          <h2>Liste des dossiers associés à celui-ci</h2>
          <table>
            <thead>
              <tr>
                <th data-sort="folderID">Clé <span class="chevron"</span></th>
              </tr>
            </thead>
          </table>
        </div>
      `
    }

    this.main.appendChild(this.section)
  }

  async initEventListeners() {}

  async initFolderHistory() {
    await this.getDatas()
    await this.initMain()
    await this.renderModale()
    await this.initEventListeners()
  }
}
