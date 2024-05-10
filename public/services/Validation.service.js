class ValidationService extends ApiCalls {
  constructor() {
    super()
  }

  async getValidation(url) {
    return await this.getRequest(url)
  }
}
