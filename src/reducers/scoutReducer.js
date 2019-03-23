import scoutService from '../services/scout'
import {
  removeGoogleToken,
  getScout,
  removeScout,
} from '../services/googleToken'

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

export const scoutGoogleLogin = token => dispatch =>
  scoutService.findOrCreateScout(token).then(scout =>
    dispatch({
      type: 'SCOUT_LOGIN',
      scout,
    })
  )

export const readScout = () => ({
  type: 'SCOUT_LOGIN',
  scout: getScout(),
})

export const scoutLogout = () => {
  removeGoogleToken()
  removeScout()
  return {
    type: 'SCOUT_LOGOUT',
  }
}

export const scoutDelete = () => dispatch => {
  scoutService
    .deleteScout()
    .then(
      dispatch({
        type: 'SCOUT_LOGOUT',
      })
    )
    .catch(error => console.log(error))
}

export default reducer
