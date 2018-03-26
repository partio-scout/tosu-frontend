const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_PLANS':
      return state.concat(action.plans)
    case 'SAVE_PLAN':
    console.log("Original state", state)
      const saved = state.map(item => {
        if (item.id !== action.id) {
          return item
        }
        return {
          ...item,
          plans: item.plans.concat({
            id: action.suggestionId,
            ...action.suggestion
          })
        }
      })
      console.log('Saved data', saved)
      return saved
    case 'DELETE_PLAN':
      const newState = state
      console.log('After deleting', newState)
      return newState
    default:
      return state
  }
}

export const initPlans = plans => {
  return async dispatch => {
    dispatch({
      type: 'INIT_PLANS',
      plans
    })
  }
}

export const savePlan = (suggestion, id, suggestionId) => {
  return async dispatch => {
    dispatch({
      type: 'SAVE_PLAN',
      id,
      suggestion,
      suggestionId
    })
  }
}

export const deletePlan = (id, activityId) => {
  return async dispatch => {
    dispatch({
      type: 'DELETE_PLAN',
      id,
      activityId
    })
  }
}
export default reducer
