export const getGoogleToken = () => {
    const config = window.localStorage.getItem('googleLogin')

    return config
 }

 export const setGoogleToken = (token) => {
    window.localStorage.setItem('googleLogin', token)
 }

 export const removeGoogleToken = () => {
    window.localStorage.removeItem('googleLogin')
 }

export const getScout = () => {
    return window.localStorage.getItem('scout')
}
