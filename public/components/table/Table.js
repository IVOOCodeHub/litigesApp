class Table {
  constructor() {
    this.main = null
  }

  async renderTable() {
    this.main = document.querySelector('main')
    this.main.innerHTML += `
    <div class="tableContainer">
          <table>
            <thead>
                <tr>
                    <th>Clé</th>
                    <th>Date Récéption</th>
                    <th>Émetteur</th>
                    <th>Déstinataire</th>
                    <th>Pièce</th>
                    <th>Action</th>
                    <th>Commentaire</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                   <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
                <tr>
                    <td>54818</td>
                    <td>03/01/2024 11:38:11</td>
                    <td>DGFP</td>
                    <td>IVOS</td>
                    <td>RELANCE REÇU</td>
                    <td>À TRAITER</td>
                    <td>236.99€ / Relance Eau Assainissement</td>
                </tr>
            </tbody>
          </table>
      </div>
      `
  }

  async initTable() {
    await this.renderTable()
  }
}
