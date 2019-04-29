/** @module bufferZoneReducer */

/**
 * Adds an activity to the buffer
 */
const addToBuffer = (action, state) => {
  const newActivities = state.activities.concat(action.activity.id)
  const newBuffer = Object.assign({}, state)
  newBuffer.activities = newActivities
  return newBuffer
}

/**
 * Deletes the activity from the buffer
 */
const deleteFromBuffer = (action, state) => {
  const leActivities = state.activities.filter(
    activity => activity !== action.activityId
  )
  const leBuffer = Object.assign({}, state)
  leBuffer.activities = leActivities
  return leBuffer
}

const initBuffer = action => {
  const newState = { ...action.buffer }
  newState.activities = action.buffer.activities.map(activity => activity.id)
  return newState
}
/**
 * Reducer for activity buffer
 * contains ID and list of activity IDs.
 * @method
 * @param state - state
 * @param action - reducer action
 *
 */
const reducer = (state = { id: 0, activities: [] }, action) => {
  switch (action.type) {
    case 'INIT_BUFFER':
      return initBuffer(action)
    case 'ADD_TO_BUFFER':
      return addToBuffer(action, state)
    case 'DELETE_FROM_BUFFER':
      return deleteFromBuffer(action, state)
    default:
      return state
  }
}
/**
 * Initialize bufferzone
 * @method
 *
 * @param {Object} buffer - initial buffer
 * @param {Number} buffer.id - id for the buffer
 * @param {Number[]} buffer.activities - list of activity id`s 
 *
 */
export const bufferZoneInitialization = buffer => dispatch => {
  dispatch({
    type: 'INIT_BUFFER',
    buffer,
  })
}
/**
 * Add activity to buffer
 * @method
 *
 * @param {Object} activity
 * @param {Number} activity.id - backend id for activity
 *
 */
export const postActivityToBuffer = activity => dispatch => {
  dispatch({
    type: 'ADD_TO_BUFFER',
    activity,
  })
}

/**
 * Delete activity from buffer
 * @method
 *
 * @param {Number} activityId
 */
export const deleteActivityFromBuffer = activityId => dispatch => {
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId,
  })
}

/**
 * Delete activity from buffer
 * @method
 * @deprecated
 * @param {Number} activityId
 */
export const deleteActivityFromBufferOnlyLocally = activityId => dispatch =>
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId,
  })

/**
 * Add activity to buffer
 * @method
 * @deprecated
 * @param {Object} activity
 * @param {Number} activity.id - backend id for activity
 *
 */
export const postActivityToBufferOnlyLocally = activity => dispatch =>
  dispatch({
    type: 'ADD_TO_BUFFER',
    activity,
  })

export default reducer
