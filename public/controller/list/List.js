class List {
  constructor() {
    this.utils = new Utils()
    this.main = null
    this.root = document.querySelector('#root')
    this.footer = new Footer()
  }

  async initMain() {
    this.main = document.createElement('main')
    this.root.appendChild(this.main)
  }

  async initForm() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchList')

    section.innerHTML = `
     <div class="inputWrapper">
        <label>Société:</label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label>Statut:</label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label>Unité org. :</label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    <div class="inputWrapper">
        <label>SS Unité org. :</label>
        <select>
          <option>Toutes</option>
          <option>mockup1</option>
          <option>mockup2</option>
          <option>mockup3</option>
          <option>mockup4</option>
          <option>mockup5</option>
        </select>
    </div>
    `
    this.main.appendChild(section)
  }

  async initTable() {
    const section = document.createElement('section')
    section.setAttribute('id', 'tableContainer')
    section.innerHTML += `
    <table>
        <thead>
            <tr>
              <th>Code</th>
              <th>Société</th>
              <th>Libéllé</th>
              <th>Description</th>
              <th>Date</th>
              <th>Stat.</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>mockupCode</td>
            <td>mockupSoci</td>
            <td>mockupLibel</td>
            <td>mockupDescri</td>
            <td>mockupDate</td>
            <td>mockupStat</td>
        </tr>
        <tr>
            <td>mockupCode</td>
            <td>mockupSoci</td>
            <td>mockupLibel</td>
            <td>mockupDescri</td>
            <td>mockupDate</td>
            <td>mockupStat</td>
        </tr>
        </tbody>
    </table>
    `
    this.main.appendChild(section)
  }

  async initEventListeners() {}

  async initList() {
    await this.initMain()
    await this.initForm()
    await this.initTable()
    await this.footer.initFooter()
    await this.initEventListeners()
  }
}

const list = new List()
list
  .initList()
  .then(() => {
    console.log(`List successfully loaded at : ${list.utils.getDate()}`)
  })
  .catch((err) =>
    console.error(`List failed to load : ${err} at: ${list.utils.getDate()}`),
  )
