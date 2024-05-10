class Table {
  constructor() {
    this.main = null
    this.section = null
  }

  async renderTable(columnNames, datas) {
    this.section = document.createElement('section')
    this.section.setAttribute('id', 'tableContainer')
    this.main = document.querySelector('main')
    this.main.appendChild(this.section)
    this.section.innerHTML += `
        <table>
          <thead>
              <tr></tr>
          </thead>
          <tbody>
              <tr></tr>
          </tbody>
        </table>
      `

    columnNames.forEach((columnName) => {
      const th = document.createElement('th')
      th.textContent = columnName
      this.main.querySelector('thead tr').appendChild(th)
    })

    datas.forEach((data) => {
      const tbody = this.main.querySelector('tbody')
      tbody.innerHTML += `
        <tr>
          <td>${data['cle']}</td>
          <td>${data['dh_saisie']}</td>
          <td>${data['societe_emettrice']}</td>
          <td>${data['societe']}</td>
          <td>${data['nature']}</td>
          <td>${data['statut']}</td>
          <td>${data['commentaire']}</td>
      `
    })
  }

  async initTable(columnNames, datas) {
    await this.renderTable(columnNames, datas)
  }
}
