import eventComparer from '../utils/EventCompare'

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
}

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
