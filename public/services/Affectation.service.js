class AffectationService extends ApiCalls {
  constructor() {
    super()
  }

  async getAffectations(url) {
    return await this.getRequest(url)
  }
}
