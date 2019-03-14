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
      delete newState[action.activity.id]
      return newState
    }
    default:
      return state
  }
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
export const deleteActivity = activity => dispatch => {
  activityService.deleteActivity(activity.id).then(() =>
    dispatch({
      type: 'DELETE_ACTIVITY',
      activity,
    })
  )
}

export default reducer
