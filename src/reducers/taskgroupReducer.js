const reducer = (state = null, action) => {
  if (action.type === 'SELECT') {
    return action.taskgroup
  } else if (action.type === 'EMPTY') {
    return null
  }
  return state
}

export const selectTaskgroup = taskgroup => ({
  type: 'SELECT',
  taskgroup,
})

export const emptyTaskgroup = () => ({
  type: 'EMPTY',
})

export default reducer
