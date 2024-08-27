class EventService extends ApiCalls {
  constructor() {
    super()
  }

  async createEvent(credentials, datas) {
    const params = {
      ...credentials,
      request: 'create_litige_event',
      args: datas,
    }
    await this.postRequest(params)
  }

  async readEvent(credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier_events',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['rows']
  }

  // old version of readEvent() function
  // but a lot of refactoring is needed if we want to remove it
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

  async bindEventToFolder(credentials, eventID, folderID) {
    const params = {
      ...credentials,
      request: 'bind_litige_dossier_event',
      args: {
        cle: eventID,
        cle_litige_dossier: folderID,
      },
    }
    await this.postRequest(params)
  }
}
