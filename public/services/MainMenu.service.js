class MainMenuService extends ApiCalls {
  constructor() {
    super()
  }

  async getDictionary (credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['data']
  }
}