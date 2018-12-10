import eventComparer from '../utils/EventCompare'

const filterEvents = (view, filter, initialEvents, start, end) => {
  let events
  switch (filter) {
    case 'ONLY_START':
      events = initialEvents.filter(event => event.endDate >= start.format('YYYY-MM-DD'))
      break
    case 'ONLY_END':
      events = initialEvents.filter(event => event.startDate <= end.format('YYYY-MM-DD'))
      break
    case 'RANGE':
      events = initialEvents.filter(event =>
        event.endDate >= start.format('YYYY-MM-DD')
        && event.startDate <= end.format('YYYY-MM-DD')
      )
      break
    default:
      events = initialEvents.sort(eventComparer)
  }
  switch (view) {
    case "OWN":
      events = events.filter(event => !event.kuksaEvent)
      break
    case "KUKSA":
      events = events.filter(event => event.kuksaEvent)
      break
    default:
      events = events.sort(eventComparer)
  }
  return events.sort(eventComparer)
}

export default filterEvents