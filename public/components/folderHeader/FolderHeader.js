class FolderHeader {
  constructor() {
    this.utils = new Utils()
    this.main = null
  }

  async initMain() {
    this.main = document.querySelector('main')
  }

  async renderFolderTitle() {
    const titleWrapper = document.createElement('div')
    titleWrapper.className = 'titleWrapper'
    titleWrapper.innerHTML = `
      <ul class="details">
        <li>
          <label>Clé : </label>
          <p class="headerKey"></p>
        </li>
        <li>
          <label>Nom : </label>
          <p class="headerName"></p>
        </li>
        <li>
          <label>Statut : </label>
          <p class="headerStatus"></p>
        </li>
        <li>
          <label>Date début : </label>
          <p class="headerStartDate"></p>
        </li>
      </ul>
      <div class="commentWrapper">
        <label>Commentaire : </label>
        <p class="headerComment"></p>
<!--        <button class="validButton">MaJ commentaire</button>-->
      </div>
    `
    this.main.appendChild(titleWrapper)
  }

  insertDatas(datas) {
    const { cle, societe, tiers, statut, datedebut, commentaire } = datas

    const headerKey = document.querySelector('.headerKey')
    const headerName = document.querySelector('.headerName')
    const headerStatus = document.querySelector('.headerStatus')
    const headerStartDate = document.querySelector('.headerStartDate')
    const headerComment = document.querySelector('.headerComment')

    if (headerKey && cle) {
      headerKey.textContent = cle
    }
    if (headerName && societe && tiers) {
      headerName.textContent = `${societe} vs ${tiers}`
    }
    if (headerStatus && statut) {
      headerStatus.textContent = statut
    }
    if (headerStartDate && datedebut) {
      headerStartDate.textContent = this.utils.reformatDate(datedebut)
    }
    if (headerComment && commentaire) headerComment.textContent = commentaire
  }

  async initFolderHeader(datas) {
    await this.initMain()
    await this.renderFolderTitle()
    await this.insertDatas(datas)
  }
}
