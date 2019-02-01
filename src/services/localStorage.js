export const loadCachedPofData = () => {
  try {
    const cachedData = window.localStorage.getItem('pofData')
    if (cachedData === null) {
      return undefined
    }
    return JSON.parse(cachedData)
  } catch (err) {
    return undefined
  }
}

export const savePofData = pofData => {
  try {
    window.localStorage.setItem('pofData', JSON.stringify(pofData))
  } catch (err) {
    //
  }
}
