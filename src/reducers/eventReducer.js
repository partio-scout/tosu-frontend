import eventService from '../services/events'
import eventGroupService from '../services/eventgroups'
import activityService from '../services/activities'

const addToEvent = (state, action) => {
  try {
    const newState = { ...state }
    const event = { ...state.events[action.eventId] }
    event.activities = Array.from(event.activities)
    event.activities.push(action.activity.id)
    newState.activities = { ...state.activities }
    newState.activities[action.activity.id] = action.activity
    newState.events = { ...state.events }
    newState.events[action.eventId] = event
    return newState
  } catch (err) {
    return state
  }
}

const deleteFromEvent = (state, action) => {
  try {
    const newState = { ...state }
    newState.events = { ...state.events }
    const deleteFrom = { ...newState.events[action.eventId] }
    deleteFrom.activities = deleteFrom.activities.filter(
      key => key !== action.activityId
    )
    newState.events[action.eventId] = deleteFrom
    return newState
  } catch (err) {
    return state
  }
}

const updateEvent = (state, action) => {
  const modEvent = Object.assign({}, action.modded)
  modEvent.activities = action.modded.activities.map(a => a.id)
  const newState = { ...state }
  newState.events = { ...state.events }
  newState.events[modEvent.id] = modEvent
  return newState
}

const addEventHelper = (state, action) => {
  const newState = { ...state }
  newState.events = { ...state.events }
  newState.events[action.event.id] = { ...action.event }
  return newState
}

const deleteEventHelper = (state, action) => {
  const newState = { ...state }
  newState.events = { ...state.events }
  delete newState.events[action.eventId]
  return newState
}

const reducer = (state = { events: {}, activities: {} }, action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      if (!action.events.activities) {
        action.events.activities = {}
      }
      return action.events
    case 'ADD_EVENT':
      return addEventHelper(state, action)
    case 'DELETE_EVENT':
      return deleteEventHelper(state, action)
    case 'DELETE_EVENTGROUP':
      return state.filter(
        event =>
          event.eventGroupId === null ||
          event.eventGroupId !== action.eventGroupId
      )
    case 'UPDATE_EVENT':
      return updateEvent(state, action)
    case 'ADD_ACTIVITY_TO_EVENT':
      return addToEvent(state, action)

    case 'DELETE_ACTIVITY_FROM_EVENT':
      return deleteFromEvent(state, action)

    default:
      return state
  }
}

export const eventsInitialization = userId => async dispatch => {
  eventService.getAll(userId).then(events =>
    dispatch({
      type: 'INIT_EVENTS',
      events,
    })
  )
}

export const deleteEvent = eventId => dispatch => {
  eventService.deleteEvent(eventId).then(() =>
    dispatch({
      type: 'DELETE_EVENT',
      eventId,
    })
  )
}

export const deleteSyncedEvent = event => dispatch => {
  eventService.deleteEvent(event.id).then(() => {
    dispatch({
      type: 'DELETE_EVENT',
      eventId: event.id,
    })

    // Add the event back to the list of Kuksa events (to show on the 'Kuksa' page)
    event.id = `kuksa${event.kuksaEventId}`
    event.kuksaEvent = true
    event.activities = []
    dispatch({
      type: 'ADD_EVENT',
      event,
    })
  })
}

export const deleteEventGroup = eventGroupId => dispatch => {
  eventGroupService.deleteEventGroup(eventGroupId).then(() =>
    dispatch({
      type: 'DELETE_EVENTGROUP',
      eventGroupId,
    })
  )
}

export const addEvent = event => dispatch => {
  eventService.create(event).then(created => {
    created.activities = []
    dispatch({
      type: 'ADD_EVENT',
      event: created,
    })
  })
}

export const addEventFromKuksa = event => dispatch => {
  eventService.create(event).then(created => {
    created.activities = []
    dispatch({
      type: 'ADD_EVENT',
      event: created,
    })
    // Delete the Kuksa event to not show the same event on multiple pages
    dispatch({
      type: 'DELETE_EVENT',
      id: `kuksa${event.kuksaEventId}`,
    })
  })
}

export const editEvent = event => dispatch => {
  eventService.edit(event).then(modded =>
    dispatch({
      type: 'UPDATE_EVENT',
      modded,
    })
  )
}

export const addActivityToEvent = (eventId, activity) => dispatch => {
  eventService.addActivity(eventId, activity).then(postedActivity =>
    dispatch({
      type: 'ADD_ACTIVITY_TO_EVENT',
      eventId,
      activity: postedActivity,
    })
  )
}

export const deleteActivityFromEvent = (activityId, eventId) => dispatch => {
  activityService.deleteActivity(activityId).then(() =>
    dispatch({
      type: 'DELETE_ACTIVITY_FROM_EVENT',
      activityId,
      eventId,
    })
  )
}

export const addActivityToEventOnlyLocally = (eventId, activity) => ({
  type: 'ADD_ACTIVITY_TO_EVENT',
  eventId,
  activity,
})

export const deleteActivityFromEventOnlyLocally = (activityId, eventId) => ({
  type: 'DELETE_ACTIVITY_FROM_EVENT',
  activityId,
  eventId,
})

export const eventList = state => {
  if (!state.events) return []
  const eventKeys = Object.keys(state.events)
  return eventKeys.map(key => {
    const event = Object.assign({}, state.events[key])
    event.activities = event.activities.map(a => {
      return Object.assign({}, state.activities[a])
    })
    return event
  })
}

export default reducer
