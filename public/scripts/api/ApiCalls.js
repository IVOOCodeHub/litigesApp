class ApiCalls {
  constructor() {
    this.validStatus = [200, 201, 204]
  }

  async optionsRequest(body) {}

  async getRequest(url) {
    try {
      const res = await fetch(url)
      if (!this.validStatus.includes(res.status)) {
        return console.error(`${res.status} : ${res.statusText}`)
      }
      return await res.data.json()
    } catch (err) {
      console.error(`Cannot fetch datas : ${err}`)
    }
  }

  async postRequest(url, options) {}
}
