class Folder {
  constructor() {
    this.footer = new Footer()
    this.utils = new Utils()
    this.folderHistory = new FolderHistory()
    this.main = null
    this.root = document.querySelector('#root')
    this.id = null
    this.datas = null
  }

  async getParams() {
    const urlParams = new URLSearchParams(window.location.search)
    this.id = urlParams.get('id')
  }

  async createMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async renderFolderTitle() {
    this.main.innerHTML = `
      <div class="titleWrapper">
        <h2>Dossier ${this.id} : *TITRE* </h2>
      </div>
    `
  }

  async renderFolder() {
    this.main.innerHTML += `
      <section id="folderContainer">
        <article class="leftArticle">
          <ul>
            <h3>Détails du dossier</h3>
            <li>
              <label>Reférence dossier :</label>
              <p>${this.id}</p>
            </li>
            <li>
              <label>Nom du dossier : </label>
              <p>*societe* VS *tiers*</p>
            </li>            
            <li>
              <label>Suivis par : </label>
              <p>*"conseil"*</p>
            </li>
            <li>
              <label for="comment">Commentaire : </label>
              <textarea name="comment"></textarea>
            </li>
            <li>
              <div>
                <label>Date création</label>
                <p>*jj/mm/yyyy*</p>
              </div>
              <div>
                <label>Date dernière mise à jour</label>
                <p>*jj/mm/yyyy*</p>
              </div>              
            </li>
            <li>
              <div>
                <label>Prochaine action</label>
                <p class="forceLeftAlign">*pAction*</p>
              </div>
              <div>
                <label for="dpaction">Date de prochaine action</label>
                <p>*jj/mm/yyyy*</p>
              </div>        
            </li>
            <li>
              <div>
                <label>Statut</label>
                <p>*Statut*</p>
              </div>
              <div>
                <label>Histo Statut</label>
                <p>*Statut*</p>
              </div>              
            </li>
          </ul>
        </article>
        <article class="rightArticle">
          <ul class="element">
            <h3>Gestion du dossier</h3>
            <li>
              <label>Ajouté un courrier au dossier : </label>
              <input name="addMail" type="file"/>
            </li>
            <li>
              <label>Ajouté une tache au dossier : </label>
              <select name="addTask">
                <option>Choisir</option>
                <option>Task1</option>
                <option>Task2</option>
                <option>Task3</option>
                <option>Task4</option>
                <option>Task5</option>
              </select>
            </li>
            <li>
              <label>Rattacher à un dossier : </label>
              <select name="add folder">
                <option>Choisir</option>
                <option>Folder1</option>
                <option>Folder2</option>
                <option>Folder3</option>
                <option>Folder4</option>
                <option>Folder5</option>
                <option>Folder6</option>
                <option>Folder7</option>
                <option>Folder8</option>
                <option>Folder9</option>
                <option>Folder10</option>
              </select>
            </li>
            <li>
              <label for="status">Prochaine action : </label>
              <button class="button folderAccess">Modifier</button> 
            </li>
          </ul>
          <ul class="element">
            <h3>Historique</h3>
            <li>
              <label>Liste des courriers du dossier : </label>
              <select name="listMails">
                <option value="-1">Choisir</option>  
                <option value="52876">Réglement frais de procédure</option>
                <option>Courrier2</option>
                <option>Courrier3</option>
                <option>Courrier4</option>
                <option>Courrier5</option>
                <option>Courrier6</option>
                <option>Courrier7</option>
              </select>
            </li>
            <li class="buttonWrapper">
              <button class="button displayHistory">Consulter l'historique des statuts</button>
            </li>
          </ul>
        </article>
      </section>
    `
  }

  async displayFolderModal() {
    const section = document.createElement('section')
    section.setAttribute('id', 'folderModal')

    section.innerHTML += `
        <div class="folderAccess">
            <h2>Dossier relatif à la pièce :</h2>
            <p>*TITRE DU DOSSIER*</p>
            <form>
                <div class="inputWrapper">
                    <label for="name">Prochaine action : </label>
                    <select>
                        <option>Choisir</option>
                        <option>pAction 1</option>
                        <option>pAction 2</option>
                        <option>pAction 3</option>
                    </select>
                </div>
                <div class="inputWrapper">
                    <label for="name">Date de prochaine action : </label>
                    <input type="date" />
                </div>
                <div class="btnWrapper">
                    <button class="button validButton">Valider</button>
                    <button class="errorButton closeModal">Fermer</button>
                </div>
            </form>
        </div>
    `
    this.main.appendChild(section)
    this.attachModalListeners()
  }

  attachModalListeners() {
    const closeModalBtn = document.querySelector('.closeModal')
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.closeFolderModal())
    }

    const submitBtn = document.querySelector('.validButton')
    submitBtn.addEventListener('click', () => this.submitDatas())
  }

  async closeFolderModal() {
    const modal = document.querySelector('#folderModal')
    if (modal) {
      modal.remove()
    }
  }

  async goToViewLitige(htmlSelectElement) {
    const id = htmlSelectElement.value
    if (id === '-1') {
      return
    }
    window.location.href = `viewLitige.html?id=${id}`
  }

  async initEventListeners() {
    const select = document.querySelector('select[name="listMails"]')
    select.addEventListener('change', (event) => {
      this.goToViewLitige(event.target)
    })

    const folderAccess = document.querySelector('.folderAccess')
    folderAccess.addEventListener('click', () => this.displayFolderModal())

    const displayHistory = document.querySelector('.displayHistory')
    displayHistory.addEventListener('click', () =>
      this.folderHistory.initFolderHistory(),
    )
  }

  async initFolder() {
    await this.getParams()
    await this.createMain()
    await this.renderFolderTitle()
    await this.renderFolder()
    await this.footer.initFooter(true, 'Sauvegarder les modifications')
    await this.initEventListeners()
  }
}

const folder = new Folder()
folder
  .initFolder()
  .then(() => {
    console.log(`Folder successfully loaded at : ${folder.utils.getDate()}`)
  })
  .catch((err) =>
    console.error(
      `Folder failed to load : ${err} at : ${folder.utils.getDate()}`,
    ),
  )
