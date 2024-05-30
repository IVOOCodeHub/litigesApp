class AffectationService extends ApiCalls {
  constructor() {
    super()
  }

  async getMail(userCredentials) {
    const params = {
      ...userCredentials,
      request: 'read_litige_courrier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['rows']
  }
  async getAffectations(url) {
    return await this.getRequest(url)
  }
}
