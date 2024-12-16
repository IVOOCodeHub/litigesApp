class ThemeListService extends ApiCalls {
  constructor() {
    super()
  }

  async getList(credentials) {
    const params = {
      ...credentials,
      request: 'read_litige_dossier',
      args: null,
    }
    await this.postRequest(params)
    return this.data['data']['data']['themes']['rows']
  }

  async addTheme(credentials, theme) {
    const params = {
      ...credentials,
      request: 'create_edit_litige_theme',
      args: {
        // cle: null,
        theme: theme.theme,
        actif: theme.actif ? 1 : 0,
      },
    }

    try {
      await this.postRequest(params)

      // Vérifiez explicitement le statut de la réponse
      if (!this.data || this.data.result !== '0') {
        console.error('Erreur API lors de l’ajout du thème:', this.data)
        throw new Error(this.data?.message || 'Erreur inconnue du backend')
      }

      // Log de succès pour vérifier
      console.log('Thème ajouté avec succès :', this.data)
    } catch (error) {
      console.error('Erreur lors de l’ajout du thème:', error)
      throw new Error(
        'Impossible d’ajouter le thème. Veuillez vérifier vos informations.',
      )
    }
  }

  async updateTheme(credentials, theme) {
    const params = {
      ...credentials,
      request: 'create_edit_litige_theme',
      args: {
        cle: theme.cle,
        theme: theme.theme,
        actif: theme.actif ? 1 : 0,
      },
    }

    try {
      await this.postRequest(params)

      // Vérifiez explicitement le statut de la réponse
      if (!this.data || this.data.result !== '0') {
        console.error('Erreur API lors de la mise à jour du thème:', this.data)
        throw new Error(this.data?.message || 'Erreur inconnue du backend')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du thème:', error)
      throw new Error(
        'Impossible de mettre à jour le thème. Vérifiez votre connexion ou contactez un administrateur.',
      )
    }
  }
}
