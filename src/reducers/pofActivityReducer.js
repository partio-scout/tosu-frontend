import eventService from '../services/events'
import pofService from '../services/pof'
import activityService from '../services/activities'
import filterOffExistingOnes from '../functions/searchBarFiltering'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_POF':
      return action.pofActivities
    default:
      return state
  }

}

export const pofInitialization = () => {
  return async (dispatch) => {
    const pofActivities = await pofService.getAll()
    dispatch({
      type: 'INIT_POF',
      pofActivities
    })
  }
}

export default reducer