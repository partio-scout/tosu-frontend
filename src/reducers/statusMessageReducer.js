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
  const newStatus = {
    firstTaskgroup: status.firstTaskgroup,
    lastTaskgroup: status.lastTaskgroup,
    extraTaskgroup: status.extraTaskgroup,
    firstTask: status.firstTask,
    mandatory: status.mandatory,
    nonMandatory: status.nonMandatory,
    leaderTask: status.leaderTask,
    extraTask: status.extraTask
  }

  dispatch({
    type: 'SHOW_STATUS',
    status: newStatus
  })
}

export default reducer
