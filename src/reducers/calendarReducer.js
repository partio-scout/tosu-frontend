const calendarReducer = (state = { popperOpen: false, showKuksa: false, popperEventId: -1 }, action) => {
  switch (action.type) {
    case 'OPEN_CALENDAR_POPPER':
      return { ...state, popperOpen: true, popperEventId: action.eventId }
    case 'CLOSE_CALENDAR_POPPER':
      return { ...state, popperOpen: false, popperEventId: -1 }
    case 'CALENDAR_SHOW_KUKSA_EVENTS':
      return { ...state, showKuksa: true }
    case 'CALENDAR_HIDE_KUKSA_EVENTS':
      return { ...state, showKuksa: false }
    default:
      return state
  }
}

export const openPopper = (eventId) => dispatch => {
  dispatch({
    type: 'OPEN_CALENDAR_POPPER',
    eventId,
  })
}
export const closePopper = () => dispatch =>  {
  dispatch({
    type: 'CLOSE_CALENDAR_POPPER',
  })
}
export const showKuksaEvents = () => dispatch =>  {
  dispatch({
    type: 'CALENDAR_SHOW_KUKSA_EVENTS',
  })
}
export const hideKuksaEvents = () => dispatch =>  {
  dispatch({
    type: 'CALENDAR_HIDE_KUKSA_EVENTS',
  })
}



export default calendarReducer
