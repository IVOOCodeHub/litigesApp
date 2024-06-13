class BindMailService extends ApiCalls {
  constructor() {
    super()
  }

  async setBindMail(credentials, datas) {
    const params = {
      ...credentials,
      request: 'bind_courrier',
      args: datas,
    }

    await this.postRequest(params)
    return this.data
  }
}
