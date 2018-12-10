export const getGoogleToken = () => {
  return window.localStorage.getItem('googleLogin')
}

export const setGoogleToken = (token) => {
  window.localStorage.setItem('googleLogin', token)
}

export const removeGoogleToken = () => {
  window.localStorage.removeItem('googleLogin')
}

export const getScout = () => {
  const scout = getCookie("scout")
  return scout ? JSON.parse(scout) : null
}

export const removeScout = () => {
  eraseCookie("scout")
}

function getCookie(name) {
  var value = "; " + document.cookie
  var parts = value.split("; " + name + "=")
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift())
}

function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=-99999999;'
}
