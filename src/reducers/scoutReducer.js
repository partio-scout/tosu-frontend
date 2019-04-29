import scoutService from '../services/scout'
import {
  removeGoogleToken,
  getScout,
  removeScout,
} from '../services/googleToken'

/** @module scoutReducer */

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SCOUT_LOGIN':
      return action.scout
    case 'SCOUT_LOGOUT':
      return null
    default:
      return state
  }
}

/**
 * Login using Google token
 * @method 
 * @param {Object} token - google login token
 */
export const scoutGoogleLogin = token => async dispatch => {
  await scoutService.findOrCreateScout(token).then(scout =>
    dispatch({
      type: 'SCOUT_LOGIN',
      scout,
    })
  )
}

/**
 * Login using saml
 * @method
 */
export const readScout = () => ({
  type: 'SCOUT_LOGIN',
  scout: getScout(),
})

/**
 * Logout
 * @method
 *
 */
export const scoutLogout = () => {
  removeGoogleToken()
  removeScout()
  scoutService.logout()
  return {
    type: 'SCOUT_LOGOUT',
  }
}

export default reducer
