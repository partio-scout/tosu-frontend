import activityService from '../services/activities'

const addToBuffer = (action, state) => {
  const newActivities = state.activities.concat(action.activity)
  const newBuffer = Object.assign({}, state)
  newBuffer.activities = newActivities
  return newBuffer
}

const deleteFromBuffer = (action, state) => {
  const leActivities = state.activities.filter(
    activity => activity.id.toString() !== action.activityId.toString()
  )
  const leBuffer = Object.assign({}, state)
  leBuffer.activities = leActivities
  return leBuffer
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BUFFER':
      return action.buffer
    case 'ADD_TO_BUFFER':
      return addToBuffer(action, state)
    case 'DELETE_FROM_BUFFER':
      return deleteFromBuffer(action, state)
    default:
      return state
  }
}

export const bufferZoneInitialization = userId => async dispatch => {
  const buffer = await activityService.getBufferZoneActivities(userId)
  dispatch({
    type: 'INIT_BUFFER',
    buffer
  })
}

export const postActivityToBuffer = activity => async dispatch => {
  const responseActivity = await activityService.addActivityToBufferZone(
    activity
  )
  dispatch({
    type: 'ADD_TO_BUFFER',
    activity: responseActivity
  })
}

export const deleteActivityFromBuffer = activityId => async dispatch => {
  await activityService.deleteActivity(activityId)
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId
  })
}

export const deleteActivityFromBufferOnlyLocally = activityId => async dispatch => {
  dispatch({
    type: 'DELETE_FROM_BUFFER',
    activityId
  })
}

export const postActivityToBufferOnlyLocally = activity => async dispatch => {
  dispatch({
    type: 'ADD_TO_BUFFER',
    activity
  })
}

export default reducer
