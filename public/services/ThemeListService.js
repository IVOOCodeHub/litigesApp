// class ThemeService {
//   async getList(userDatas) {
//     // Make an API call to get the list of themes
//     const response = await fetch('/api/themes', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userDatas),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to fetch themes')
//     }

//     return response.json()
//   }

class ThemeListService extends ApiCalls {
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
    return this.data['data']['data']['themes']['rows']
  }

  async addTheme(user, theme) {
    // Make an API call to add a new theme
    const params = {
      ...user,
      request: 'read_litige_dossier',
      args: theme,
    }
    await this.postRequest(params)
  }

  async updateTheme(user, theme) {
    // Make an API call to update an existing theme
    const params = {
      ...user,
      request: 'read_litige_dossier',
      args: theme,
    }
    await this.postRequest(params)
  }
}
