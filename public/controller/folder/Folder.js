class Folder {
  constructor() {
    this.folderService = new FolderService()
    this.folderHeader = new FolderHeader()
    this.createNewEvent = new CreateNewEvent()
    this.footer = new Footer()
    this.utils = new Utils()
    this.mailHistory = new MailHistory()
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

  async getDatas() {
    const user = await JSON.parse(localStorage.getItem('user'))
    const userDatas = {
      userID: user['matricule'],
      password: user['mdp'],
    }
    this.datas = await this.folderService.getFolder(userDatas)
    this.datas = this.datas.find((folder) => folder['cle'] === this.id)

    console.log('this.datas —>', this.datas)
  }

  async createMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async renderFolder() {
    this.main.innerHTML += `
      <section id="folderContainer">
       
       <!-- LEFT SIDE -->

        <article class="leftArticle">
          <ul class="element">
            <h3>Détails du dossier</h3>
            <li>
              <label>Société :</label>
              <select name="socity">
                <option>Choisir</option>
                <option selected="selected">${this.datas['societe']}</option>
                <option>BB</option>
                <option>ECOASSIS</option>
                <option>FLEURIAU</option>
                <option>GEAS</option>
                <option>GELS</option>
                <option>GEMP</option>
                <option>GEMV</option>
                <option>IVOB</option>
                <option>IVOO</option>
                <option>IVOS</option>
                <option>IVOT</option>
                <option>PVF</option>
                <option>SCI_IMMO_BECQUET</option>
                <option>SITAP</option>
                <option>STENICO_RE</option>
              </select>
            </li>
            <li>
              <label>Tièrs : </label>
              <select name="socity">
                <option>Choisir</option>
                <option selected="selected">${this.datas['tiers']}</option>
                <option>tiers2</option>
                <option>tiers3</option>
                <option>tiers5</option>
              </select>
            </li>
            <li>
              <label for="comment">Commentaire : </label>
              <textarea name="comment">${this.datas['commentaire']}</textarea>
            </li>
            <li>
              <label>Conseil</label>
              <input type="text" class="conseil" />
            </li>
            <li>
              <label>Thème</label>
              <select>
                <option>Choisir</option>
                <option selected="selected">${this.datas['theme']}</option>
                <option>theme3</option>
                <option>theme4</option>
                <option>theme5</option>
              </select>
            </li>     
            <li>
              <label>Multiple</label>
              <input type="checkbox" class="isMultiple"  />
            </li>
            <li>
              <label>Statut</label>
              <select>
                <option selected="selected">${this.datas['statut']}</option>
                <option>En cours</option>
                <option>Ajourné</option>
                <option>Cloturé</option>
              </select>
            </li>
            <li>
              <label>Date de début</label>
              <input type="date" class="startDate" />
            </li>
            <li class="buttonWrapper">
              <button class="validButton">Sauvegarder les modifications</button>
            </li>
          </ul>
        </article>        
        
        <!-- RIGHT SIDE -->        
        
        <article class="rightArticle">
          <!-- HISTORY  -->
          <ul class="historySection">
            <li class="buttonWrapper">
              <button class="button displayMailHistory">Liste des courriers</button>
            </li>
            <li class="buttonWrapper">
              <button class="button displayHistory">Liste des dossiers associers</button>
            </li>
             <li class="buttonWrapper">
              <button class="button ">Historique des évènements</button>
            </li>
          </ul>             
          <!-- PREVIOUS EVENT -->        
          <ul class="element">
            <h3>Dernier historique évènement</h3>
            <li>
              <label>Dernier évèment : </label>
              <p>DD/MM/YYYY</p>
            </li>
            <li>
              <label>Etat : </label>
              <p>Pré-contentntieux / Contentieux / Éxécution</p>
            </li>
            <li>
              <label>Type d'évènement : </label>
              <p>*type d'évènement*</p>
            </li>
            <li>
              <label>Type de juridiction : </label>
              <p>*type de juridiction*</p>
            </li>
            <li>
              <label>Commentaire : </label>
              <p>*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi asperiores consectetur corporis fuga nam quasi sapiente tempore. Ad consequatur libero natus nihil tempora! Mollitia, quae.*</p>
            </li>
          </ul>
          
          <!-- GEST DOSSIER  -->
        
          <ul class="element">
            <h3>Gestion du dossier</h3>
            <li>
              <label>Rattacher : </label>
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
              <label>Ajouter un évènement : </label>
              <button class="button displayCreateEventModal">Créer un évènement</button>
            </li>
            <li>
              <label>Ajouter une pièce écrite par téléchargement : </label>
              <input name="addMail" type="file"/>
            </li>
            <li class="buttonWrapper">
              <button class="validButton">Sauvegarder les modifications</button>
            </li>
          </ul>
        </article>
      </section>
    `
  }

  async displayLinkedMail() {
    const goToLinkedMail = document.querySelector('.displayMailHistory')
    goToLinkedMail.addEventListener('click', () =>
      this.mailHistory.initMailHistory(this.id),
    )
  }

  async initEventListeners() {
    const createNewEventButton = document.querySelector(
      '.displayCreateEventModal',
    )
    createNewEventButton.addEventListener('click', () =>
      this.createNewEvent.initCreateNewEvent(),
    )

    const displayHistory = document.querySelector('.displayHistory')
    displayHistory.addEventListener('click', () =>
      this.folderHistory.initFolderHistory(),
    )
    await this.displayLinkedMail()
  }

  async insertDatas() {
    const conseilInput = document.querySelector('.conseil')
    if (this.datas['conseil']) {
      conseilInput.value = this.datas['conseil']
    } else {
      conseilInput.value = 'Aucun'
    }

    const isMultiple = this.datas['multiple']
    if (isMultiple === '1') {
      const checkBox = document.querySelector('.isMultiple')
      checkBox.checked = true
    }

    if (this.datas['datedebut']) {
      const startDate = new Date(this.datas['datedebut'])
      const dateDebutInput = document.querySelector('.startDate')
      dateDebutInput.value = startDate.toISOString().split('T')[0]
    }
  }

  async initFolder() {
    await this.getParams()
    await this.getDatas()
    await this.createMain()
    await this.folderHeader.initFolderHeader(this.datas)
    await this.renderFolder()
    await this.insertDatas()
    await this.footer.initFooter()
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
