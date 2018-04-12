const reducer = (state = { text: null, status: null }, action) => {
  if (action.type === 'SHOW_MESSAGE') {
    return Object.assign({ ...state }, { text: action.text })
  } else if (action.type === 'SHOW_STATUS') {
    return Object.assign({ ...state }, { status: action.status })
  }
  return state
}

export const addStatusMessage = id => dispatch => {
  let text
  if (id === 1) {
    text = 'Valitse ensimmäisenä suoritettava tarppo.'
  } else if (id === 2) {
    text = 'Valitse aktiviteetteja ja raahaa ne haluamiisi tapahtumiin.'
  } else {
    text = 'Valitse aktiviteetteja'
  }

  dispatch({
    type: 'SHOW_MESSAGE',
    text
  })
}

export const addStatusInfo = status => dispatch => {

  const statusText = `Pakollisia valittu ${status.mandatory} ja vapaaehtoisia ${status.nonMandatory}`
  
  dispatch({
    type: 'SHOW_STATUS',
    status: statusText
  })
}

export default reducer
