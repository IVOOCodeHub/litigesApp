// class ThemeList {
//   constructor() {
//     this.main = null
//     this.themes = [
//       'Amauger',
//       'Cial',
//       'Divers',
//       'Fiscal',
//       'Penal',
//       'RC',
//       'Social',
//       'Stenico',
//     ]
//   }

//   async renderThemeList() {
//     this.main = document.querySelector('main')
//     const section = document.createElement('section')
//     section.setAttribute('id', 'themeListModal')

//     section.innerHTML += `
//       <div class="themeListWrapper">
//         <h2>Liste des Thèmes</h2>
//         <ul id="themeList"></ul>
//         <div class="inputWrapper">
//           <input type="text" id="newThemeInput" placeholder="Ajouter un nouveau thème" />
//           <button id="addThemeButton">Ajouter</button>
//         </div>
//         <button class="closeModal">Fermer</button>
//       </div>
//     `
//     this.main.appendChild(section)

//     this.themeListElement = section.querySelector('#themeList')
//     this.newThemeInput = section.querySelector('#newThemeInput')
//     this.addThemeButton = section.querySelector('#addThemeButton')
//     this.closeButton = section.querySelector('.closeModal')

//     this.addThemeButton.addEventListener('click', () => this.addTheme())
//     this.closeButton.addEventListener('click', () => this.closeModal())

//     this.renderThemes()
//   }

//   renderThemes() {
//     this.themeListElement.innerHTML = ''
//     this.themes.forEach((theme, index) => {
//       const li = document.createElement('li')
//       li.textContent = theme

//       const deleteButton = document.createElement('button')
//       deleteButton.textContent = 'Supprimer'
//       deleteButton.addEventListener('click', () => this.removeTheme(index))

//       li.appendChild(deleteButton)
//       this.themeListElement.appendChild(li)
//     })
//   }

//   addTheme() {
//     const newTheme = this.newThemeInput.value.trim()
//     if (newTheme) {
//       this.themes.push(newTheme)
//       this.newThemeInput.value = ''
//       this.renderThemes()
//     }
//   }

//   removeTheme(index) {
//     this.themes.splice(index, 1)
//     this.renderThemes()
//   }

//   closeModal() {
//     const modal = document.getElementById('themeListModal')
//     modal.remove()
//   }

//   async initEventListeners() {
//     const closeBtn = document.querySelector('.closeModal')
//     closeBtn.addEventListener('click', () => this.closeModal())
//   }

//   async initThemeList() {
//     await this.renderThemeList()
//     await this.initEventListeners()
//   }
// }

// // Initialiser le composant après le chargement de la page
// document.addEventListener('DOMContentLoaded', () => {
//   new ThemeList().initThemeList()
// })

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
    this.root.appendChild(this.main)
  }

  async initTable() {
    const section = document.createElement('section')
    section.setAttribute('id', 'tableContainer')
    section.innerHTML += `
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
      <button id="addThemeButton">Ajouter un Thème</button>
    `
    this.main.appendChild(section)

    document
      .getElementById('addThemeButton')
      .addEventListener('click', () => this.openAddModal())
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('table tbody')
    tableBody.innerHTML = ''
    datas?.forEach((row) => {
      tableBody.innerHTML += `
        <tr data-id="${row['id']}">
          <td>${row['theme']}</td>
          <td>${row['active'] ? 'Oui' : 'Non'}</td>
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
          <button class="validButton">Ajouter</button>
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
    const theme = this.datas.find((t) => t['id'] === themeId)

    const modal = document.createElement('div')
    modal.setAttribute('id', 'themeModal')

    modal.innerHTML = `
      <div class="modalWrapper">
        <h2>Modifier le Thème</h2>
        <div class="inputWrapper">
          <label for="themeName">Nom du Thème :</label>
          <input type="text" id="themeName" value="${theme['theme']}" />
        </div>
        <div class="inputWrapper">
          <label for="themeActive">Actif :</label>
          <select id="themeActive">
            <option value="1" ${theme['actif'] ? 'selected' : ''}>Oui</option>
            <option value="0" ${!theme['actif'] ? 'selected' : ''}>Non</option>
          </select>
        </div>
        <div class="btnWrapper">
          <button class="validButton">Valider</button>
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
    const themeName = document.getElementById('themeName').value

    if (themeName.trim() === '') {
      alert('Le nom du thème ne peut pas être vide')
      return
    }

    const newTheme = {
      name: themeName,
      active: true,
    }

    // Make an API call to add the new theme to the database
    await this.themeService.addTheme(newTheme)
    this.closeModal()
    this.getData() // Refresh the list
  }

  async updateTheme(themeId) {
    const themeName = document.getElementById('themeName').value
    const themeActive = document.getElementById('themeActive').value === 'true'

    const updatedTheme = {
      id: themeId,
      name: themeName,
      active: themeActive,
    }

    // Make an API call to update the theme in the database
    await this.themeService.updateTheme(updatedTheme)
    this.closeModal()
    this.getData() // Refresh the list
  }

  async initList() {
    await this.getData()
    await this.initMain()
    await this.initTable()
    await this.insertDatas(this.datas)
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
