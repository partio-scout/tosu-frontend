import eventService from '../services/events'
import eventGroupService from '../services/eventgroups'
import activityService from '../services/activities'

const addToEvent = (state, action) => {
  const event = state.find(e => e.id.toString() === action.eventId.toString())
  event.activities = event.activities.concat(action.activity)

  const outdated = state.filter(
    e => e.id.toString() !== action.eventId.toString()
  )
  return outdated.concat(event)
}

const deleteFromEvent = (state, action) => {
  const deleteFrom = state.find(
    e => e.activities.find(a => a.id === action.activityId) !== undefined
  )
  if (deleteFrom === undefined) {
    return state
  }
  deleteFrom.activities = deleteFrom.activities.filter(
    a => a.id.toString() !== action.activityId.toString()
  )
  const outdatedd = state.filter(
    event => event.id.toString() !== deleteFrom.id.toString()
  )
  return outdatedd.concat(deleteFrom)
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return action.events
    case 'ADD_EVENT':
      return state.concat(action.event)
    case 'DELETE_EVENT':
      return state.filter(event => event.id !== action.eventId)
    case 'DELETE_EVENTGROUP':
      return state.filter(
        event => event.eventGroupId === null || event.eventGroupId !== action.eventGroupId
      )
    case 'UPDATE_EVENT':
      return state
        .filter(event => event.id.toString() !== action.modded.id.toString())
        .concat(action.modded)

    case 'ADD_ACTIVITY_TO_EVENT':
      return addToEvent(state, action)

    case 'DELETE_ACTIVITY_FROM_EVENT':
      return deleteFromEvent(state, action)

    default:
      return state
  }
}

export const eventsInitialization = userId => async dispatch => {
  const events = await eventService.getAll(userId)
  dispatch({
    type: 'INIT_EVENTS',
    events
  })
}

export const deleteEvent = eventId => async dispatch => {
  await eventService.deleteEvent(eventId)
  dispatch({
    type: 'DELETE_EVENT',
    eventId
  })
}

export const deleteSyncedEvent = event => async dispatch => {
  await eventService.deleteEvent(event.id)
  dispatch({
    type: 'DELETE_EVENT',
    eventId: event.id
  })
  // Add the event back to the list of Kuksa events (to show on the "Kuksa" page)
  event.id = "kuksa" + event.kuksaEventId
  event.kuksaEvent = true
  event.activities = []
  dispatch({
    type: 'ADD_EVENT',
    event: event
  })
}

export const deleteEventGroup = eventGroupId => async dispatch => {
  await eventGroupService.deleteEventGroup(eventGroupId)
  dispatch({
    type: 'DELETE_EVENTGROUP',
    eventGroupId
  })
}

export const addEvent = event => async dispatch => {
  const created = await eventService.create(event)
  created.activities = []
  dispatch({
    type: 'ADD_EVENT',
    event: created
  })
}

export const addEventFromKuksa = event => async dispatch => {
  const created = await eventService.create(event)
  const kuksaEventId = event.id
  created.activities = []
  dispatch({
    type: 'ADD_EVENT',
    event: created
  })
  // Delete the Kuksa event to not shot the same event on multiple pages
  dispatch({
    type: 'DELETE_EVENT',
    kuksaEventId
  })
}

export const editEvent = event => async dispatch => {
  const modded = await eventService.edit(event)
  dispatch({
    type: 'UPDATE_EVENT',
    modded
  })
}

export const addActivityToEvent = (eventId, activity) => async dispatch => {
  const postedActivity = await eventService.addActivity(eventId, activity)

  dispatch({
    type: 'ADD_ACTIVITY_TO_EVENT',
    eventId,
    activity: postedActivity
  })
}

export const deleteActivityFromEvent = activityId => async dispatch => {
  await activityService.deleteActivity(activityId)

  dispatch({
    type: 'DELETE_ACTIVITY_FROM_EVENT',
    activityId
  })
}

export const addActivityToEventOnlyLocally = (
  eventId,
  activity
) => async dispatch => {
  dispatch({
    type: 'ADD_ACTIVITY_TO_EVENT',
    eventId,
    activity
  })
}

export const deleteActivityFromEventOnlyLocally = activityId => async dispatch => {
  dispatch({
    type: 'DELETE_ACTIVITY_FROM_EVENT',
    activityId
  })
}

export default reducer
