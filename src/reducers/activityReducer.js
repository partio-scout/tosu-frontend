import activityService from '../services/activities'

const reducer = (state = {}, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case 'INIT_ACTIVITIES': {
      return action.activities
    }
    case 'ALTER_ACTIVITY': {
      // This can be used to add or update if ID is already known
      newState[action.activity.id] = action.activity
      return newState
    }
    case 'DELETE_ACTIVITY': {
      delete newState[action.activityId]
      return newState
    }
    default:
      return state
  }
}
/**
 * Init activity state
 * @param eventActivities{Object[]} - list of activities in events
 * @param bufferActivities{Object[]} - list of activities in buffer
 *
 */
export const activityInitialization = (
  eventActivities,
  bufferActivities
) => async dispatch => {
  const initialState = {}
  eventActivities.forEach(activity => {
    initialState[activity.id] = activity
  })
  bufferActivities.forEach(activity => {
    initialState[activity.id] = activity
  })
  dispatch({
    type: 'INIT_ACTIVITIES',
    activities: initialState,
  })
}

export const addActivity = activity => dispatch => {
  dispatch({
    type: 'ALTER_ACTIVITY',
    activity,
  })
}

export const updateActivity = activity => dispatch => {
  dispatch({
    type: 'ALTER_ACTIVITY',
    activity,
  })
}
export const deleteActivity = activityId => dispatch => {
  activityService.deleteActivity(activityId)
  dispatch({
    type: 'DELETE_ACTIVITY',
    activityId,
  })
}

export const getActivityList = state =>
  Object.keys(state).map(key => state[key])

export default reducer
