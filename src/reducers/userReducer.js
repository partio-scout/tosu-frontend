import scoutService from '../services/scout'
import { getGoogleToken } from '../services/googleToken';



const reducer = (state = null, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return action.scout
        case 'USER_LOGOUT':
            return null
        case 'USER_DELETE':
            return null

        default:
            return state        
    }
}

export const userLogin = () => async dispatch => {
    console.log(getGoogleToken())
   const scout = await scoutService.findOrCreateScout(getGoogleToken())
    
    dispatch({
        type: 'USER_LOGIN',
        scout: 'replace me when backend is done, login'
    })
}

export const userLogout = () => async dispatch => {
    await scoutService.logout()
    dispatch({
        type: 'USER_LOGOUT'
    })
}

export const userDelete = () => async dispatch => {
    await scoutService.deleteScout()
    dispatch({
        type: 'USER_DELETE'
    })
}

export default reducer