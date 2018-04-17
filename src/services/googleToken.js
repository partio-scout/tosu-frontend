export const getGoogleToken = () => {
    const config = {
        headers: { 'Authorization': window.localStorage.getItem('googleLogin') }
    }
    return config
 }
 
 export const setGoogleToken = (response) => {
    window.localStorage.setItem('googleLogin', response)
 }
 
 export const removeGoogleToken = () => {
    window.localStorage.removeItem('googleLogin')
 }