import activityService from '../services/activities'

/** @module activityReducer */
/*
 * Reducer for backend activities
 * @method
 * @param action - INIT_ACTIVITES, ALTER_ACTIVITY, DELETE_ACTIVITY
 * Alter activity is used to add or update activity
 */
const reducer = (state = {}, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case 'INIT_ACTIVITIES': {
      return action.activities
    }
    case 'ALTER_ACTIVITY': {
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
 * @method
 * @param eventActivities{Object[]} - list of activities in events
 * @param bufferActivities{Object[]} - list of activities in buffer
 */
export const activityInitialization = (
  eventActivities,
  bufferActivities
) => dispatch => {
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
/**
 * Add activity to state
 * @method
 * @param {Object} activity - activity
 * @param {Number} activity.id - activity nodebackend id
 * @param {String} activity.guid - activity pofbackend guid
 */
export const addActivity = activity => dispatch => {
  dispatch({
    type: 'ALTER_ACTIVITY',
    activity,
  })
}

/**
 * Update activity in state
 * @method
 * @param {Object} activity - activity
 * @param {Number} activity.id - activity nodebackend id
 * @param {String} activity.guid - activity pofbackend guid
 */
export const updateActivity = activity => dispatch => {
  dispatch({
    type: 'ALTER_ACTIVITY',
    activity,
  })
}
/**
 * Delete activity from state
 * @method
 * @param {Number} activityId - id of the activity
 */
export const deleteActivity = activityId => async dispatch => {
  await activityService.deleteActivity(activityId)
  dispatch({
    type: 'DELETE_ACTIVITY',
    activityId,
  })
}

export const getActivityList = state =>
  Object.keys(state).map(key => state[key])

export default reducer
