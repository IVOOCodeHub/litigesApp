class ThemeService {
  async getList(userDatas) {
    // Make an API call to get the list of themes
    const response = await fetch('/api/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDatas),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch themes')
    }

    return response.json()
  }

  async addTheme(theme) {
    // Make an API call to add a new theme
    const response = await fetch('/api/themes/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theme),
    })

    if (!response.ok) {
      throw new Error('Failed to add theme')
    }
  }

  async updateTheme(theme) {
    // Make an API call to update an existing theme
    const response = await fetch(`/api/themes/update/${theme.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theme),
    })

    if (!response.ok) {
      throw new Error('Failed to update theme')
    }
  }
}
