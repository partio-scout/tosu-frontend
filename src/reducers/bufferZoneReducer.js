import activityService from '../services/activities'

const addToBuffer = (action, state) => {
  const newActivities = state.activities.concat(action.activity.id)
  const newBuffer = Object.assign({}, state)
  newBuffer.activities = newActivities
  return newBuffer
}

const deleteFromBuffer = (action, state) => {
  const leActivities = state.activities.filter(
    activity => activity !== action.activityId
  )
  const leBuffer = Object.assign({}, state)
  leBuffer.activities = leActivities
  return leBuffer
}

const initBuffer = (action, state) => {
    const newState = {...state}
    newState.activities = action.buffer.activities.map(activity => activity.id)
    return newState
}

const reducer = (state = { id: 0, activities: [] }, action) => {
  switch (action.type) {
    case 'INIT_BUFFER':
      return initBuffer(action, state)
    case 'ADD_TO_BUFFER':
      return addToBuffer(action, state)
    case 'DELETE_FROM_BUFFER':
      return deleteFromBuffer(action, state)
    default:
      return state
  }
}

export const bufferZoneInitialization = (buffer) => dispatch => {
    dispatch({
      type: 'INIT_BUFFER',
      buffer,
    })
}

export const postActivityToBuffer = activity => dispatch => {
    dispatch({
      type: 'ADD_TO_BUFFER',
      activity,
    })
}

export const deleteActivityFromBuffer = activityId => async dispatch => {
  await activityService.deleteActivity(activityId)
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId,
  })
}

export const deleteActivityFromBufferOnlyLocally = activityId => async dispatch =>
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId,
  })

export const postActivityToBufferOnlyLocally = activity => async dispatch =>
  dispatch({
    type: 'ADD_TO_BUFFER',
    activity,
  })

export default reducer
