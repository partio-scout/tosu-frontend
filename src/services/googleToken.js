export const getGoogleToken = () => {
    const config = window.localStorage.getItem('googleLogin')
    
    return config
 }
 
 export const setGoogleToken = (token) => {
    window.localStorage.setItem('googleLogin', token)
    console.log(token)
 }
 
 export const removeGoogleToken = () => {
    window.localStorage.removeItem('googleLogin')
 }