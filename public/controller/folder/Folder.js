class Folder {
  constructor() {
    this.footer = new Footer()
    this.utils = new Utils()
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
                <label>Date création : </label>
                <p>*DATE*</p>
              </div>
              <div>
                <label>Date dernière mise à jour : </label>
                <p>*DATE*</p>
              </div>              
            </li>
            <li>
              <div>
                <label>Prochaine action : </label>
                <select>
                  <option>Choisir</option>
                  <option>ProchaineAction1</option>
                  <option>ProchaineAction2</option>
                  <option>ProchaineAction3</option>
                  <option>ProchaineAction4</option>
                  <option>ProchaineAction5</option>
                </select>
              </div>
              <div>
                <label for="dpaction">Date de prochaine action : </label>
                <input type="date" name="dpaction" />
              </div>        
            </li>
            <li>
              <div>
                <label>Statut : </label>
                <p>*Statut*</p>
              </div>
              <div>
                <label>Histo Statut : </label>
                <p>*Statut*</p>
              </div>              
            </li>
          </ul>
        </article>
        <article class="rightArticle"></article>
      </section>
    `
  }

  async initFolder() {
    await this.getParams()
    await this.createMain()
    await this.renderFolderTitle()
    await this.renderFolder()
    await this.footer.initFooter()
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
