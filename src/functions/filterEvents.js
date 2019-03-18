import eventComparer from '../utils/EventCompare'

/**
 * Method that determines the date range of the filter
 * @param start start date. The method only checks if it is defined
 * @param end end date. The method only checks if it is defined
 */
const determineCase = (start, end) => {
  if (start && end) {
    return 'RANGE'
  }
  if (start && !end) {
    return 'ONLY_START'
  }
  if (!start && end) {
    return 'ONLY_END'
  }
  return 'NONE'
}
/**
 * Filters the events based on date range and type
 * @param view determines what type of events are shown (own/kuksa)
 * @param initialEvents events that are filtered
 * @param start start date
 * @param end end date
 */
const filterEvents = (view, initialEvents, start, end) => {
  let events
  switch (determineCase(start, end)) {
    case 'ONLY_START':
      events = initialEvents.filter(
        event => event.endDate >= start.format('YYYY-MM-DD')
      )
      break
    case 'ONLY_END':
      events = initialEvents.filter(
        event => event.startDate <= end.format('YYYY-MM-DD')
      )
      break
    case 'RANGE':
      events = initialEvents.filter(
        event =>
          event.endDate >= start.format('YYYY-MM-DD') &&
          event.startDate <= end.format('YYYY-MM-DD')
      )
      break
    default:
      events = initialEvents
  }
  switch (view) {
    case 'OWN':
      events = events.filter(event => !event.kuksaEvent)
      break
    case 'KUKSA':
      events = events.filter(event => event.kuksaEvent)
      break
    default:
  }
  return events.sort(eventComparer)
}

export default filterEvents
