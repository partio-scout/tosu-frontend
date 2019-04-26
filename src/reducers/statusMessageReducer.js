const reducer = (state = { text: null, status: null }, action) => {
  switch (action.type) {
    case 'SHOW_MESSAGE':
      return Object.assign({ ...state }, { text: action.text })
    case 'SHOW_STATUS':
      return Object.assign({ ...state }, { status: action.status })
    default:
      return state
  }
}

export const addStatusMessage = id => {
  let text
  switch (id) {
    case 1:
      text = 'Valitse ensimmäisenä suoritettava tarppo.'
      break
    case 2:
      text = 'Valitse aktiviteetteja ja raahaa ne haluamiisi tapahtumiin.'
      break
    case 3:
      text = 'Luo ensin toimintasuunnitelma vasemmasta valikosta.'
      break
    default:
      text = 'Valitse aktiviteetteja.'
      break
  }

  return {
    type: 'SHOW_MESSAGE',
    text,
  }
}

export const addStatusInfo = status => {
  const newStatus = {
    taskgroupDone: status.taskgroupDone,
    firstTaskgroup: status.firstTaskgroup,
    lastTaskgroup: status.lastTaskgroup,
    extraTaskgroup: status.extraTaskgroup,
    firstTask: status.firstTask,
    mandatory: status.mandatory,
    nonMandatory: status.nonMandatory,
    leaderTask: status.leaderTask,
    extraTask: status.extraTask,
    dates: status.dates,
    warnings: status.warnings,
  }

  return {
    type: 'SHOW_STATUS',
    status: newStatus,
  }
}

export default reducer
