class FolderService extends ApiCalls {
  constructor() {
    super()
  }

  async getFolder(url) {
    return await this.getRequest(url)
  }
}
