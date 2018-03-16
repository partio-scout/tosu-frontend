import activityService from '../services/activities'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BUFFER':
      return action.bufferActivities
    case 'ADD_TO_BUFFER':
      const newActivities = state.activities.concat(action.activity)
      let newBuffer = Object.assign({}, state)
      newBuffer.activities = newActivities
      return newBuffer
    case 'DELETE_FROM_BUFFER':
      const leActivities = state.activities.filter(activity => activity.id.toString() !== action.activityId.toString())
      let leBuffer = Object.assign({}, state)
      leBuffer.activities = leActivities
      return leBuffer
    default:
      return state
  }

}

export const bufferZoneInitialization = (userId) => {
  return async (dispatch) => {
    const bufferActivities = await activityService.getBufferZoneActivities(userId)
    dispatch({
      type: 'INIT_BUFFER',
      bufferActivities
    })
  }
}

export const postActivityToBuffer = (activity) => {
  return async (dispatch) => {
    const responseActivity = await activityService.addActivityToBufferZone(activity)
    dispatch({
      type: 'ADD_TO_BUFFER',
      activity: responseActivity
    })
  }
}
export const deleteActivityFromBuffer = (activityId) => {
  return async (dispatch) => {
     await activityService.deleteActivity(activityId)
    dispatch({
      type: 'DELETE_FROM_BUFFER',
      activityId
    })
  }
}

export default reducer