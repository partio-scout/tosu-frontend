const reducer = (state = null, action) => {
  if (action.type === 'SELECT') {
    return action.taskgroup
  } else if (action.type === 'EMPTY') {
    return null
  }
  return state
}

export const selectTaskgroup = taskgroup => dispatch => {
  dispatch({
    type: 'SELECT',
    taskgroup,
  })
}

export const emptyTaskgroup = () => dispatch => {
  dispatch({
    type: 'EMPTY',
  })
}

export default reducer
