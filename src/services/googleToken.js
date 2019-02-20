function getCookie(name) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2)
    return decodeURIComponent(
      parts
        .pop()
        .split(';')
        .shift()
    )
}

export const getGoogleToken = () => window.localStorage.getItem('googleLogin')

export const setGoogleToken = token => {
  window.localStorage.setItem('googleLogin', token)
}

export const removeGoogleToken = () => {
  window.localStorage.removeItem('googleLogin')
}

export const getScout = () => {
  const scout = getCookie('scout')
  return scout ? JSON.parse(scout) : null
}

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999;`
}

export const removeScout = () => {
  eraseCookie('scout')
}
