class FolderService extends ApiCalls {
  constructor() {
    super()
  }

  async getFolder(user) {
    const params = {
      ...user,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['rows']
  }

  async createFolder(user, datas) {
    const params = {
      ...user,
      request: 'create_edit_litige_dossier',
      args: datas,
    }
    await this.postRequest(params)
  }
}
