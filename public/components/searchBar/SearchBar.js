class SearchBar {
  constructor() {
    this.main = null
    this.section = null
  }

  async createSection() {
    const section = document.createElement('section')
    section.setAttribute('id', 'searchBar')
    this.section = section
  }

  async renderTitle() {
    const title = document.createElement('h2')
    this.section.appendChild(title)
  }

  async renderInputs(inputs) {
    const existingUl = this.section.querySelector('ul')
    if (existingUl) {
      existingUl.remove()
    }

    const ul = document.createElement('ul')

    inputs.forEach((input) => {
      const li = document.createElement('li')
      const label = document.createElement('label')
      label.textContent = input.label
      li.appendChild(label)

      if (input.select) {
        const select = document.createElement('select')
        input.options.forEach((option) => {
          const opt = document.createElement('option')
          opt.textContent = option
          select.appendChild(opt)
        })
        li.appendChild(select)
      } else if (input.input) {
        const inputElement = document.createElement('input')
        inputElement.setAttribute('type', 'text')
        inputElement.setAttribute('placeholder', input.placeholder)
        li.appendChild(inputElement)

        const button = document.createElement('button')
        button.textContent = 'Chercher'
        li.appendChild(button)
      }

      ul.appendChild(li)
    })

    this.section.appendChild(ul)

    const article = document.createElement('article')
    this.section.appendChild(article)
  }

  async initSearchBar(inputs) {
    await this.createSection()
    await this.renderTitle()
    await this.renderInputs(inputs)
    this.main = document.querySelector('main')
    this.main.appendChild(this.section)
  }
}
