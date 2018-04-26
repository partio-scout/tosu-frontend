export const loadCachedPofData = () => {
  try {
      const cachedData = window.localStorage.getItem('pofData')
      if (cachedData === null || cachedData === {}) {
          return undefined
      }
      return cachedData
  } catch (err) {
      return undefined
  }
}

export const savePofData = (pofData) => {
    try {
      window.localStorage.setItem('pofData', pofData)
    } catch (err) {
        // 
    }
}
