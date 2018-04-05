const reducer = (store = null, action) => {
  if (action.type === 'NOTIFY') {
    return action.note
  } else if (action.type === 'CLEAR_NOTIFICATION') {
    return null
  }
  return store
}

const showNotification = (text, textType) => {
  const note = { text, textType }
  return { type: 'NOTIFY', note }
}
const hideNotification = () => ({ type: 'CLEAR_NOTIFICATION' })

export const notify = (
  text,
  textType = 'error',
  timeout = 5
) => async dispatch => {
  dispatch(showNotification(text, textType))

  setTimeout(() => {
    dispatch(hideNotification())
  }, timeout * 1000)
}

export default reducer
