class FolderList {
  constructor() {
    this.folderService = new FolderService()
    this.themeListService = new ThemeListService()
    this.eventService = new EventService()
    this.utils = new Utils()
    this.userCredentials = null
    this.foldersDatas = null
    this.main = null
    this.themeList = null
    this.eventKey = null
  }

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    this.userCredentials = {
      userID: user['matricule'],
      password: user['mdp'],
    }

    this.foldersDatas = await this.folderService.getFolder(this.userCredentials)
    this.themeList = await this.themeListService.getList(this.userCredentials)
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderSearchBar() {
    const section = document.createElement('section')
    section.setAttribute('id', 'folderListModal')

    section.innerHTML += `
      <h2>Choisir un dossier auquel rattacher le courrier : </h2>
      <div class="searchContainer">
        <div class="inputWrapper">
          <label for="key">Clé:</label>
          <input type="text" id="key" name="key" />
        </div>
        <div class="inputWrapper">
          <label for="society">Société:</label>
          <select id="society" name="society">
            <option>Toutes</option>           
          </select>
        </div>
        <div class="inputWrapper">
          <label for="tiers">Tiers:</label>
          <select id="tiers" name="tiers">
            <option>Tous</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label for="theme">Theme:</label>
          <select id="theme" name="theme">
            <option value="Choisir">Choisir</option>
          </select>
        </div>
        <div class="inputWrapper">
          <label for="startDate">Date début:</label>
          <input type="date" id="startDate" name="startDate" />
        </div>
        <div class="inputWrapper">
          <label for="statut">Statut:</label>
          <select id="statut" name="statut">
            <option value="tous">Choisir</option>
            <option value="A VALIDER">A valider</option>
            <option value="EN COURS">En cours</option>
            <option value="AJOURNE">Ajourné</option>
            <option value="TERMINER">Terminé</option>
          </select>
        </div>
      </div>
    `

    this.main.appendChild(section)
    await this.utils.trapFocus(section)
  }

  async insertSelect() {
    const societySelectOption = []
    const tiersSelectOption = []
    const themeSelect = document.querySelector('select[name="theme"]')

    this.foldersDatas.forEach((el) => {
      if (!societySelectOption.includes(el['societe'])) {
        societySelectOption.push(el['societe'])
      }
      if (!tiersSelectOption.includes(el['tiers'])) {
        tiersSelectOption.push(el['tiers'])
      }
    })

    const societySelect = document.querySelector('select[name="society"]')
    societySelectOption.forEach((society) => {
      const option = document.createElement('option')
      option.setAttribute('value', society)
      option.textContent = society
      societySelect.appendChild(option)
    })

    const tiersSelect = document.querySelector('select[name="tiers"]')
    tiersSelectOption.forEach((tiers) => {
      const option = document.createElement('option')
      option.setAttribute('value', tiers)
      option.textContent = tiers
      tiersSelect.appendChild(option)
    })

    this.themeList.forEach((el) => {
      if (el['theme'] && el['actif'] === '1') {
        const option = document.createElement('option')
        option.setAttribute('value', el['theme'])
        option.textContent = el['theme']
        themeSelect.appendChild(option)
      }
    })
  }

  async renderFolderList() {
    const section = document.querySelector('#folderListModal')

    section.innerHTML += `
      <div class="tableContainer">
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
  }

  async insertDatas(datas) {
    const tableBody = document.querySelector('#folderListModal table tbody')
    tableBody.innerHTML = ''
    datas?.forEach((row) => {
      tableBody.innerHTML += `
        <tr>
          <td>${row['cle']}</td>
          <td>${row['societe']} vs ${row['tiers']}</td>
          <td>${row['commentaire']}</td>
          <td>${this.utils.reformatDate(row['datedebut']).split(' ')[0]}</td>
          <td>${row['theme']}</td>
          <td>${row['statut']}</td>
        </tr>
      `
    })
  }

  async searchFromBar(htmlElement) {
    const htmlElementName = htmlElement.name
    const htmlElementValue = htmlElement.value
    let newDatas = null

    switch (htmlElementName) {
      case 'key':
        if (htmlElementValue !== '') {
          const resultFromValue = await this.foldersDatas.filter(
            (row) => row['cle'].trim() === htmlElementValue,
          )
          resultFromValue
            ? (newDatas = resultFromValue)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break
      case 'society':
        if (htmlElementValue !== 'Toutes') {
          const resultFromSociety = await this.foldersDatas.filter(
            (row) => row['societe'].trim() === htmlElementValue,
          )
          resultFromSociety.length > 0
            ? (newDatas = resultFromSociety)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break
      case 'tiers':
        if (htmlElementValue !== 'Tous') {
          const resultFromTiers = await this.foldersDatas.filter(
            (row) => row['tiers'].trim() === htmlElementValue,
          )
          resultFromTiers.length > 0
            ? (newDatas = resultFromTiers)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break
      case 'theme':
        if (htmlElementValue !== 'Tous') {
          const resultFromTheme = await this.foldersDatas.filter(
            (row) => row['theme'].trim() === htmlElementValue,
          )
          resultFromTheme.length > 0
            ? (newDatas = resultFromTheme)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break
      case 'startDate':
        if (htmlElementValue !== '') {
          const resultFromDate = await this.foldersDatas.filter((row) => {
            return (
              this.utils.reformatDate(row['datedebut']).split(' ')[0] ===
              this.utils.reformatDate(htmlElementValue).split(' ')[0]
            )
          })
          resultFromDate.length > 0
            ? (newDatas = resultFromDate)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break

      case 'statut':
        if (htmlElementValue !== 'Tous') {
          const resultFromStatut = await this.foldersDatas.filter(
            (row) => row['statut'] === htmlElementValue,
          )
          resultFromStatut.length > 0
            ? (newDatas = resultFromStatut)
            : (newDatas = this.foldersDatas)
        } else {
          newDatas = this.foldersDatas
        }
        break

      default:
        newDatas = this.foldersDatas
    }

    await this.insertDatas(newDatas)
  }

  async searchBy(elementName) {
    const htmlElement = document.querySelector(`[name="${elementName}"]`)
    htmlElement.addEventListener('change', async () => {
      await this.searchFromBar(htmlElement)
      await this.selectFolder()
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

      const url = new URL(window.location.href)
      switch (true) {
        case url.pathname.includes(`viewMail.html`):
          {
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
          break

        case url.pathname.endsWith('/event.html'):
          {
            // create new HTMLElement in CreateNewEvent.js / createNewEvent.html
            const createNewEventFrom =
              document.querySelector('#createEvent form')
            if (createNewEventFrom) {
              const displayEventSelectedFolder = document.createElement('li')
              displayEventSelectedFolder.classList.add('inputWrapper')
              displayEventSelectedFolder.innerHTML = `
                <label>Clé du dossier sélectionné : </label>
                <p>${selectedFolderID} : ${selectedFolderName}</p>
              `
              createNewEventFrom.appendChild(displayEventSelectedFolder)

              const displayFolderBtn = document.querySelector('.displayFolder')
              displayFolderBtn.remove()
            } else {
              await this.eventService.bindEventToFolder(
                this.userCredentials,
                this.eventKey.toString(),
                selectedFolderID.toString(),
              )
              window.location.reload()
            }
          }
          break
      }
    }
  }

  async destroyComponent() {
    const section = document.querySelector('#folderListModal')
    section.remove()
  }

  async initEventListeners() {
    await this.searchBy('key')
    await this.searchBy('society')
    await this.searchBy('tiers')
    await this.searchBy('theme')
    await this.searchBy('startDate')
    await this.searchBy('statut')
    await this.selectFolder()
    const cancelButton = document.querySelector(
      '#folderListModal .folderListDestroy',
    )
    cancelButton.addEventListener('click', () => this.destroyComponent())
  }

  async initFolderList(eventKey) {
    this.eventKey = eventKey
    await this.getDatas()
    await this.initMain()
    await this.renderSearchBar()
    await this.insertSelect()
    await this.renderFolderList()
    await this.insertDatas(this.foldersDatas)
    await this.initEventListeners()
  }
}
