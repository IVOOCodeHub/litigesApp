class Folder {
  constructor() {
    this.folderHeader = new FolderHeader()
    this.createNewEvent = new CreateNewEvent()
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
    this.id = '52820' // DEV
  }

  async getDatas() {
    this.datas = JSON.parse(localStorage.getItem('datas'))
    if (!this.datas) {
      alert(
        '*DEV : FETCH DATA A FAIRE —> COURRIER A AFFECTER A VISITER AVANT DE VENIR ICI*',
      )
    }
    this.datas = this.datas['courriers'].find(
      (object) => object['cle'] === this.id,
    )
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
                <option>society2</option>
                <option>society3</option>
                <option>society4</option>
                <option>society5</option>
              </select>
            </li>
            <li>
              <label>Tièrs : </label>
              <select name="socity">
                <option>Choisir</option>
                <option selected="selected">${this.datas['societe_emettrice']}</option>
                <option>tiers2</option>
                <option>tiers3</option>
                <option>tiers5</option>
              </select>
            </li>
            <li>
              <label for="comment">Commentaire : </label>
              <textarea name="comment"></textarea>
            </li>
            <li>
              <label>Ref. Source</label>
              <input type="text" value="*refSource*">
            </li>
            <li>
              <label>Conseil</label>
              <input type="text" value="*conseil*"/>
            </li>
            <li>
              <label>Thème</label>
              <select>
                <option>theme1</option>
                <option>theme2</option>
                <option>theme3</option>
                <option>theme4</option>
                <option>theme5</option>
              </select>
            </li>     
            <li>
              <label>Multiple</label>
              <input type="checkbox" />
            </li>
            <li>
              <label>Statut</label>
              <select>
                <option>A valider</option>
                <option>En cours</option>
                <option>Ajourné</option>
                <option>Cloturé</option>
              </select>
            </li>
            <li>
              <label>Date de début</label>
              <input type="date" />
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

  async goToViewLitige(htmlSelectElement) {
    const id = htmlSelectElement.value
    if (id === '-1') {
      return
    }
    window.location.href = `viewLitige.html?id=${id}`
  }

  async initEventListeners() {
    const createNewEventButton = document.querySelector(
      '.displayCreateEventModal',
    )
    createNewEventButton.addEventListener('click', () =>
      this.createNewEvent.initCreateNewEvent(),
    )

    const select = document.querySelector('select[name="listMails"]')
    select.addEventListener('change', (event) => {
      this.goToViewLitige(event.target)
    })

    const displayHistory = document.querySelector('.displayHistory')
    displayHistory.addEventListener('click', () =>
      this.folderHistory.initFolderHistory(),
    )
  }

  async initFolder() {
    await this.getParams()
    await this.getDatas()
    await this.createMain()
    await this.folderHeader.initFolderHeader(this.datas)
    await this.renderFolder()
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
