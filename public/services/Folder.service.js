class FolderService extends ApiCalls {
  constructor() {
    super()
  }

  async getFolder(credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['data']['data']['rows']
  }

  async getBindCourrier(credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['data']['data']['rows']
  }

  async createEditFolder(credentials, datas) {
    const params = {
      ...credentials,
      request: 'create_edit_litige_dossier',
      args: datas,
    }
    await this.postRequest(params)
  }
}
