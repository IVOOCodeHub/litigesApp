class ThemeList {
  constructor() {
    this.utils = new Utils()
    this.themeService = new ThemeListService()
    this.footer = new Footer()
    this.main = null
    this.root = document.querySelector('#root')
  }

  async getData() {
    const user = await JSON.parse(localStorage.getItem('user'))
    const userDatas = {
      userID: '6237',
      password: 'lotri',
    }
    this.datas = await this.themeService.getList(userDatas)
    console.log('data: ', this.datas)
  }

  async initMain() {
    this.main = document.createElement('main')
    this.main.setAttribute('id', 'themeListPage')
    this.root.appendChild(this.main)
  }

  async initTable() {
    // Conteneur du tableau
    const tableSection = document.createElement('section')
    tableSection.setAttribute('id', 'tableContainer')
    tableSection.innerHTML += `
    <table>
      <thead>
        <tr>
          <th>Nom du Thème</th>
          <th>Actif</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `
    this.main.appendChild(tableSection)

    // Conteneur des boutons
    const buttonSection = document.createElement('section')
    buttonSection.setAttribute('id', 'buttonContainer')
    buttonSection.innerHTML += `
    <button id="addThemeButton" class="greenButton">Ajouter un Thème</button>
    <button id="backButton" class="retourButton">Retour</button>
  `
    this.main.appendChild(buttonSection)

    // Ajout des gestionnaires d'événements
    document
      .getElementById('addThemeButton')
      .addEventListener('click', () => this.openAddModal())

    document
      .getElementById('backButton')
      .addEventListener('click', () => window.history.back())
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    if (!tableBody) {
      console.error('Table body introuvable')
      return
    }

    tableBody.innerHTML = ''

    datas?.forEach((row) => {
      // Vérifiez précisément la valeur de `actif`
      const isActive =
        row['actif'] === true || row['actif'] === 1 || row['actif'] === '1'

      tableBody.innerHTML += `
      <tr data-id="${row['cle']}">
        <td>${row['theme']}</td>
        <td>${isActive ? 'Oui' : 'Non'}</td>
        <td><button class="editButton">Modifier</button></td>
      </tr>
    `
    })

    document.querySelectorAll('.editButton').forEach((button) => {
      button.addEventListener('click', (event) => {
        const row = event.target.closest('tr')
        this.openEditModal(row)
      })
    })
  }

  openAddModal() {
    const modal = document.createElement('div')
    modal.setAttribute('id', 'themeModal')

    modal.innerHTML = `
      <div class="modalWrapper">
        <h2>Ajouter un Thème</h2>
        <div class="inputWrapper">
          <label for="themeName">Nom du Thème :</label>
          <input type="text" id="themeName" />
        </div>
        <div class="btnWrapper">
          <button class="greenButton">Ajouter</button>
          <button class="closeModal">Fermer</button>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    modal
      .querySelector('.closeModal')
      .addEventListener('click', () => this.closeModal())
    modal
      .querySelector('.validButton')
      .addEventListener('click', () => this.addTheme())
  }

  openEditModal(row) {
    const themeId = row.dataset.id
    const theme = this.datas.find((t) => t['cle'] == themeId)

    if (!theme) {
      console.error('Thème non trouvé:', themeId)
      return
    }

    const modal = document.createElement('div')
    modal.setAttribute('id', 'themeModal')

    modal.innerHTML = `
      <div class="modalWrapper">
        <h2>Modifier le Thème</h2>
        <div class="inputWrapper">
          <label for="themeName">Nom du Thème :</label>
          <input type="text" id="themeName" value="${theme['theme'] || ''}" />
        </div>
        <div class="inputWrapper">
          <label for="themeActive">Actif :</label>
          <select id="themeActive">
            <option value="1" ${theme['actif'] ? 'selected' : ''}>Oui</option>
            <option value="0" ${!theme['actif'] ? 'selected' : ''}>Non</option>
          </select>
        </div>
        <div class="btnWrapper">
          <button class="greenButton">Valider</button>
          <button class="closeModal">Fermer</button>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    modal
      .querySelector('.closeModal')
      .addEventListener('click', () => this.closeModal())
    modal
      .querySelector('.validButton')
      .addEventListener('click', () => this.updateTheme(themeId))
  }

  closeModal() {
    const modal = document.getElementById('themeModal')
    if (modal) {
      modal.remove()
    }
  }

  async addTheme() {
    const user = JSON.parse(localStorage.getItem('user'))
    const credentials = {
      userID: user?.userID || '6237',
      password: user?.password || 'lotri',
    }

    const themeName = document.getElementById('themeName').value

    if (themeName.trim() === '') {
      alert('Le nom du thème ne peut pas être vide')
      return
    }

    const newTheme = {
      theme: themeName,
      actif: true, // Par défaut actif lors de la création
    }

    try {
      await this.themeService.addTheme(credentials, newTheme)

      // Rafraîchit les données et l'affichage
      await this.getData()
      this.insertDatas(this.datas)

      // Ferme la modale après succès
      this.closeModal()
      alert('Le thème a été ajouté avec succès.')
    } catch (error) {
      console.error('Erreur lors de l’ajout du thème :', error)
      alert(
        'Impossible d’ajouter le thème. Veuillez vérifier vos informations.',
      )
    }
  }

  async updateTheme(themeId) {
    const user = JSON.parse(localStorage.getItem('user'))
    const credentials = {
      userID: user?.userID || '6237',
      password: user?.password || 'lotri',
    }

    const themeName = document.getElementById('themeName').value
    const themeActive = document.getElementById('themeActive').value === '1'

    const updatedTheme = {
      cle: themeId, // Clé du thème à mettre à jour
      theme: themeName, // Nouveau nom
      actif: themeActive, // Actif ou non
    }

    console.log('updatedTheme : ', updatedTheme)

    try {
      await this.themeService.updateTheme(credentials, updatedTheme)
      await this.getData()
      this.insertDatas(this.datas) // Met à jour la table directement
      this.closeModal()
      alert('Le thème a été mis à jour avec succès.')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du thème :', error)
      alert(
        'Impossible de mettre à jour le thème. Veuillez vérifier vos informations.',
      )
    }
  }

  async initList() {
    await this.getData()
    await this.initMain()
    await this.initTable()
    await this.insertDatas(this.datas) // Insert data after fetching
  }
}

const themeList = new ThemeList()
themeList
  .initList()
  .then(() => {
    console.log(
      `Theme list successfully loaded at : ${themeList.utils.getDate()}`,
    )
  })
  .catch((err) =>
    console.error(
      `Theme list failed to load : ${err} at: ${themeList.utils.getDate()}`,
    ),
  )
