const reducer = (store = null, action) => {
  if (action.type === 'SHOW_MESSAGE') {
    console.log('addinc status message:', action.text)
    return action.text
  }
  return store
}

export const addStatusMessage = text => dispatch => {
  console.log("Before dispatch")
  dispatch({
    type: 'SHOW_MESSAGE',
    text
  })
}

export default reducer
