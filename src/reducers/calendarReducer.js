/** @module calendarReducer*/

/**
 * Reducer for calendar state
 */
const calendarReducer = (
  state = { popperOpen: false, showKuksa: false, popperEventId: -1 },
  action
) => {
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

/**
 * Open Calendar popper eventcard
 * @method
 * @param {(Number | String)} eventId
 */
export const openPopper = eventId => ({
  type: 'OPEN_CALENDAR_POPPER',
  eventId,
})

/**
 * Close Calendar popper eventcard
 * @method
 * @param {(Number | String)} eventId
 */
export const closePopper = () => ({
  type: 'CLOSE_CALENDAR_POPPER',
})

/**
 * Show Kuksa events in calendar view
 * @method 
 */
export const showKuksaEvents = () => ({
  type: 'CALENDAR_SHOW_KUKSA_EVENTS',
})

/**
 * Hide Kuksa events in calendar view
 * @method
 *
 */
export const hideKuksaEvents = () => ({
  type: 'CALENDAR_HIDE_KUKSA_EVENTS',
})

export default calendarReducer
