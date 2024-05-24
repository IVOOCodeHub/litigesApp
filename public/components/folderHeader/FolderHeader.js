class FolderHeader {
  constructor() {
    this.main = null
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderFolderTitle(datas) {
    const titleWrapper = document.createElement('div')
    titleWrapper.setAttribute('class', 'titleWrapper')
    titleWrapper.innerHTML += `
      <ul class="details">
        <li>
          <label>Clé : </label>
          <p>${datas['cle']}</p>
        </li>
        <li>
          <label>Nom : </label>
          <p>${datas['societe_emettrice']} vs ${datas['societe']}</p>
        </li>
        <li>
          <label>Statut : </label>
          <p>${datas['statut']}</p>
        </li>
        <li>
          <label>Date début : </label>
          <p>${datas['dh_saisie']}</p>
        </li>
      </ul>
      <div class="commentWrapper">
        <label>Commentaire : </label>
        <input type="text" value="${datas['commentaire']}"/>
        <button class="validButton">MaJ commentaire</button>
      </div>
    `
    this.main.appendChild(titleWrapper)
  }

  async initFolderHeader(datas) {
    await this.initMain()
    await this.renderFolderTitle(datas)
  }
}
