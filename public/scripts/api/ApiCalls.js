class ApiCalls {
  constructor() {
    this.validStatus = [200, 201, 204]
  }

  async optionsRequest(body) {}

  async getRequest(url) {
    try {
      return await fetch(url)
          .then((res) => res.json())
          .then((data) => data)
    } catch (err) {
      console.error(`Can't fetch datas : ${err}`);
    }
  }

  async postRequest(url, options) {}
}
