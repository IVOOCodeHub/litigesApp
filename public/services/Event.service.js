class EventService extends ApiCalls {
  constructor() {
    super()
  }

  async getEvent(url) {
    return await this.getRequest(url)
  }
}
