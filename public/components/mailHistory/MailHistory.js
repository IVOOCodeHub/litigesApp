class MailHistory {
  constructor() {
    this.main = null
    this.datas = null
    this.section = null
    this.folderService = new FolderService()
  }

  async getDatas(folderID) {
    const user = await JSON.parse(localStorage.getItem('user'))
    const userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    const mails = await this.folderService.getBindCourrier(userCredentials)
    mails.forEach((folder) => {
      if (folder['cle'] === folderID) {
        if (folder['courriers']) {
          this.datas = folder['courriers']['rows']
        }
      }
    })
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async createTable() {
    this.section = document.createElement('section')
    this.section.setAttribute('id', 'mailHistory')

    if (!this.datas) {
      this.section.innerHTML += `
        <div class="tableContainer">
          <h2>Aucun courrier dans ce dossier</h2>
        </div>
      `
    } else {
      this.section.innerHTML += `    
        <div class="tableContainer">
          <h2>Courrier(s) du dossier : </h2>    
          <table>
            <thead>
              <tr>
                <th data-sort="cle">Cle <span class="chevron"></span></th>
                <th data-sort="societe_emettrice">Société émettrice<span class="chevron"></span></th>
                <th data-sort="societe">Société</th>
                <th data-sort="nature">Nature<span class="chevron"></span></th>
                <th data-sort="commentaire">Commentaire<span class="chevron"></span></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        `
    }

    this.main.appendChild(this.section)
  }

  async insertDatas(datas) {
    datas?.forEach((mail) => {
      const tableBody = document.querySelector('table tbody')
      tableBody.innerHTML += `
        <tr>
          <td>${mail['cle_courrier']}</td>
          <td>${mail['societe_emettrice']}</td>
          <td>${mail['societe']}</td>
          <td>${mail['nature']}</td>
          <td>${mail['litiges_commentaire']}</td>
        </tr>
      `
    })
  }

  async destroyComponent() {
    this.section.remove()
  }

  async insertClose() {
    const closeBtn = document.createElement('button')
    closeBtn.setAttribute('class', 'errorButton')
    closeBtn.textContent = 'Fermer'
    closeBtn.addEventListener('click', () => this.destroyComponent())

    this.section.appendChild(closeBtn)
  }

  async goToViewMail(id) {
    window.location.href = `viewMail.html?id=${id}`
  }

  async initEventListeners() {
    const rows = document.querySelectorAll('tr')
    rows.forEach((row) => {
      row.addEventListener('click', async (e) => {
        e.preventDefault()
        const id = row.firstElementChild.textContent
        await localStorage.setItem('datas', JSON.stringify(this.datas))
        await this.goToViewMail(id)
      })
    })
  }

  async initMailHistory(folderID) {
    await this.getDatas(folderID)
    await this.initMain()
    await this.createTable()
    await this.insertDatas(this.datas)
    await this.insertClose()
    await this.initEventListeners()
  }
}
