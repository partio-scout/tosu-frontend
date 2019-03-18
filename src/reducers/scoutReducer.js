import scoutService from '../services/scout'
import {
  removeGoogleToken,
  getScout,
  removeScout,
} from '../services/googleToken'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SCOUT_LOGIN':
      console.log(action.scout)
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
  await scoutService.findOrCreateScout(token).then(scout =>
    dispatch({
      type: 'SCOUT_LOGIN',
      scout,
    })
  )
}

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

// Never used...
// export const scoutDelete = () => {
//   scoutService.deleteScout()
//   return {
//     type: 'SCOUT_DELETE',
//   }
// }

export default reducer
