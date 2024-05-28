class ListService extends ApiCalls {
  constructor() {
    super()
  }

  async getList(user) {
    const params = {
      ...user,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['rows']
  }
}
