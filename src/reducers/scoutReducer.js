import scoutService from '../services/scout'
import {
  setGoogleToken,
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
    case 'SCOUT_DELETE':
      return null

    default:
      return state
  }
}

export const scoutGoogleLogin = token => async dispatch => {
  const scout = await scoutService.findOrCreateScout(token)
  setGoogleToken(token)

  dispatch({
    type: 'SCOUT_LOGIN',
    scout: scout,
  })
}

export const readScout = () => async dispatch => {
  const scout = getScout()
  dispatch({
    type: 'SCOUT_LOGIN',
    scout: scout,
  })
}

export const scoutLogout = () => async dispatch => {
  removeGoogleToken()
  removeScout()
  dispatch({
    type: 'SCOUT_LOGOUT',
  })
}

export const scoutDelete = () => async dispatch => {
  await scoutService.deleteScout()
  dispatch({
    type: 'SCOUT_DELETE',
  })
}

export default reducer
