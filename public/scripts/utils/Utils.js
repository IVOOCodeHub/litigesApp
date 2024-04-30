class Utils {
  constructor() {}

  getDate() {
    // retourne la date au format DD-MM-YYYY et l'heure au format HH:MM:SS
    const date = new Date()
    const dd = date.getDate().toString().padStart(2, '0')
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const hh = date.getHours().toString().padStart(2, '0')
    const min = date.getMinutes().toString().padStart(2, '0')
    const ss = date.getSeconds().toString().padStart(2, '0')

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`
  }
}
