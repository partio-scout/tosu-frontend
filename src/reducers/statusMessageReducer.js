const reducer = (store = null, action) => {
  if (action.type === 'SHOW_MESSAGE') {
    return action.text
  }
  return store
}

export const addStatusMessage = text => dispatch => {
  dispatch({
    type: 'SHOW_MESSAGE',
    text
  })
}

export default reducer
