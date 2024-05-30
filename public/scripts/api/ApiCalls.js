class ApiCalls extends Utils {
  constructor() {
    super()
    this.data = null
    this.storedProcedureEndpoint =
      'http://192.168.0.112:8800/api/storedProcedure'
  }

  async postOptions(reqBody) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    }
  }

  async postRequest(reqBody) {
    const options = await this.postOptions(reqBody)
    try {
      return await fetch(this.storedProcedureEndpoint, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(
            'Fetch response —>',
            data,
            `fetched at : ${this.getDate()}`,
          )
          this.data = data
        })
    } catch (err) {
      console.error(`Can't fetch datas : ${err}, at : ${this.getDate()}`)
    }
  }


  async getRequest(url) {
    try {
      return await fetch(url)
        .then((res) => res.json())
        .then((data) => data)
    } catch (err) {
      console.error(`Can't fetch datas : ${err}`)
    }
  }
}
