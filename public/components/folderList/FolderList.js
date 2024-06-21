class FolderList {
  constructor() {
    this.folderService = new FolderService()
    this.utils = new Utils()
    this.userCredentials = null
    this.foldersDatas = null
    this.main = null
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }

    this.foldersDatas = await this.folderService.getFolder(this.userCredentials)
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderFolderList() {
    const section = document.createElement('section')
    section.setAttribute('id', 'folderListModal')

    section.innerHTML += `
      <div class="tableContainer">
        <h2>Choisir un dossier auquel rattacher le courrier : </h2>
        <table>
          <thead>
            <tr>
              <th data-sort="cle">Cle <span class="chevron"></span></th>
              <th data-sort="name">Nom <span class="chevron"></span></th>
              <th>Commentaire</th>
              <th data-sort="date">Date début<span class="chevron"></span></th>
              <th data-sort="theme">Theme <span class="chevron"></span></th>
              <th data-sort="stat">Stat. <span class="chevron"></span></th>
            <tr/>
          </thead>
          <tbody></tbody>
        </table>       
      </div>
      <div class="buttonWrapper">
        <button class="errorButton folderListDestroy">Annuler</button>
      </div>
    `

    this.main.appendChild(section)
    await this.utils.trapFocus(section)
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''
    datas?.forEach((row) => {
      tableBody.innerHTML += `
        <tr>
          <td>${row['cle']}</td>
          <td>${row['tiers']} vs ${row['societe']}</td>
          <td>${row['commentaire']}</td>
          <td>${this.utils.reformatDate(row['datedebut']).split(' ')[0]}</td>
          <td>${row['theme']}</td>
          <td>${row['statut']}</td>
        </tr>
      `
    })
  }

  async selectFolder() {
    const rows = document.querySelectorAll('tr')

    rows.forEach((row) => {
      row.addEventListener('click', async () => {
        const selectedFolderID = row.firstElementChild.textContent
        const selectedFolderName = row.children[1].textContent

        // return the ID on the component ViewMail.js who's send the values to backend
        const event = new CustomEvent('folderSelected', {
          detail: { folderID: selectedFolderID },
        })
        document.dispatchEvent(event)

        // displayDatas in DoM, then destroy modal
        await this.isFolderSelected(selectedFolderID, selectedFolderName)
        await this.destroyComponent()
      })
    })
  }

  async isFolderSelected(selectedFolderID, selectedFolderName) {
    if (selectedFolderID) {
      const isAlreadySelected = document.querySelector(
        '.selectedFolderContainer',
      )
      if (isAlreadySelected) {
        isAlreadySelected.remove()
      }

      // create new HTMLElement in VewMail.js / viewMail.html
      const editMail = document.querySelector('.bindFolderWrapper')
      const displaySelectedFolder = document.createElement('li')
      displaySelectedFolder.classList.add('selectedFolderContainer')
      displaySelectedFolder.innerHTML = `
        <label>Clé du dossier sélectionné : </label>
        <p>${selectedFolderID} : ${selectedFolderName}</p>
      `
      editMail.insertAdjacentElement('afterend', displaySelectedFolder)
    }
  }

  async destroyComponent() {
    const section = document.querySelector('#folderListModal')
    section.remove()
  }

  async initEventListeners() {
    await this.selectFolder()
    const cancelButton = document.querySelector(
      '#folderListModal .folderListDestroy',
    )
    cancelButton.addEventListener('click', () => this.destroyComponent())
  }

  async initFolderList() {
    await this.getDatas()
    await this.initMain()
    await this.renderFolderList()
    await this.insertDatas(this.foldersDatas)
    await this.initEventListeners()
  }
}
