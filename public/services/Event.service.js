class EventService extends ApiCalls {
  constructor() {
    super()
  }

  async createEvent(credentials, datas) {
    const params = {
      ...credentials,
      request: '',
      args: datas,
    }
  }

  async getEvent(credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)

    const res = this.data['data']['data']['data']['rows']

    const events = []
    res.forEach((folder) => {
      const row = folder['events']
      if (row) {
        if (row['rows']) {
          events.push(row['rows'])
        }
      }
    })
    return events
  }
}
