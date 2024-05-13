class ListService extends ApiCalls {
  constructor() {
    super()
  }

  async getList(url) {
    return await this.getRequest(url)
  }
}
