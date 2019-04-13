const reducer = (store = null, action) => {
  if (action.type === 'NOTIFY') {
    return action.note
  } else if (action.type === 'CLEAR_NOTIFICATION') {
    return null
  }
  return store
}

export const notify = (
  text,
  textType = 'error',
  timeout = 5
) => async dispatch => {
  dispatch({
    type: 'NOTIFY',
    note: {
      text,
      textType,
    },
  })
  setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, timeout * 1000)
}

export default reducer
