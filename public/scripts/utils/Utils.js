console.log('Utils.js chargé')
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

  reformatDate(dateString) {
    const date = new Date(dateString)

    const jour = date.getDate().toString().padStart(2, '0')
    const mois = (date.getMonth() + 1).toString().padStart(2, '0') // getMonth() retourne un mois de 0 à 11
    const annee = date.getFullYear()

    return `${jour}/${mois}/${annee}`
  }

  reformatDateFromSelect(dateString) {
    const date = new Date(dateString)
    const jour = date.getDate().toString().padStart(2, '0')
    const mois = (date.getMonth() + 1).toString().padStart(2, '0')
    const annee = date.getFullYear()

    return `${jour}/${mois}/${annee}`
  }

  trapFocus = (el) => {
    // add all the elements inside modal which you want to make focusable
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const firstFocusableElement = el.querySelectorAll(focusableElements)[0]
    const focusableContent = el.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1]

    document.addEventListener('keydown', function (e) {
      let isTabPressed = e.key === 'Tab' || e.keyCode === 9

      if (!isTabPressed) {
        return
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    })

    firstFocusableElement.focus()
  }
}
