import eventService from '../services/events'
import eventGroupService from '../services/eventgroups'
import activityService from '../services/activities'

/**
 * Add activity to a state event
 * @param {Object} state - event state object
 * @param {Object} action - reducer action
 * @param {Number} action.eventId - nodebackend id of the event
 * @param {Object} action.activity - activity to add
 * @param {String} action.activity.id - node backend id of the activity
 */
const addToEvent = (state, action) => {
  try {
    const newState = { ...state }
    const event = { ...state[action.eventId] }
    event.activities = Array.from(event.activities)
    event.activities.push(action.activity.id)
    newState[action.eventId] = event
    return newState
  } catch (err) {
    return state
  }
}

/**
 * Delete activity from a state event
 * @param {Object} state - hashmap of the state-events
 * @param {Object} action - reducer action
 * @param {String} action.eventId - node backend id of the target event
 * @param {Number} action.activitId - node backend id of the target activity
 */
const deleteFromEvent = (state, action) => {
  try {
    const newState = { ...state }
    const deleteFrom = { ...newState[action.eventId] }
    deleteFrom.activities = deleteFrom.activities.filter(
      key => key !== action.activityId
    )
    newState[action.eventId] = deleteFrom
    return newState
  } catch (err) {
    return state
  }
}

/**
 * Update event in state hashmap
 * @param {Object} state - state hashmap
 * @param {Object} action - reducer action
 * @param {Object} action.event - event to update
 * @param {Object[]} action.event.activities - list of event activities in object form that will be mapped to ids in this func
 * @param {String} action.event.id - node backend id of this event
 *
 */
const updateEvent = (state, action) => {
  const modEvent = Object.assign({}, action.modded)
  modEvent.activities = action.modded.activities.map(a => a.id)
  const newState = { ...state }
  newState[modEvent.id] = modEvent
  return newState
}

/**
 * Add event to state hashmap
 * @param {Object} state - state hashmap
 * @param {Object} action - reducer action
 * @param {Object} action.event - event ot add
 * @param {Number} action.event.id - id of the event
 *
 */
const addEventHelper = (state, action) => {
  const newState = { ...state }
  newState[action.event.id] = { ...action.event }
  return newState
}

/**
 * Delete event from state hashmap
 * @param {Object}
 * @param {Object} action - reducer action
 * @param {Number} action.eventId - Id of the event to be deleted
 */
const deleteEventHelper = (state, action) => {
  const newState = { ...state }
  delete newState[action.eventId]
  return newState
}

/**
 * Delete eventgrop from event state hashmap
 * @param {Object} state - event state hashmap
 * @param {Object} action - reducer action
 * @param {Number} action.eventGroupId - eventGroup to be deleted
 */
const deleteEventGroupHelper = (state, action) => {
  const newState = { ...state }
  Object.keys(newState)
    .filter(key => newState[key].eventGroupId === action.eventGroupId)
    .forEach(key => {
      delete newState[key]
    })
  return newState
}

/**
 * Reducer for application events
 * State is kept in hashmap form
 */
const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return action.events
    case 'ADD_EVENT':
      return addEventHelper(state, action)
    case 'DELETE_EVENT':
      return deleteEventHelper(state, action)
    case 'DELETE_EVENTGROUP':
      return deleteEventGroupHelper(state, action)
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

/**
 * Initialize event hashmap
 * @param {Object} events - events in normalized hashmap form
 */
export const eventsInitialization = events => async dispatch => {
  dispatch({
    type: 'INIT_EVENTS',
    events,
  })
}

/**
 * Delete event from state and backend
 * @param{Number} eventId - id of the event to be removed
 *
 */
export const deleteEvent = eventId => dispatch => {
  eventService.deleteEvent(eventId).then(() =>
    dispatch({
      type: 'DELETE_EVENT',
      eventId,
    })
  )
}
/**
 * Delete kuksa event from plan
 * @param {Object} event - kuksa event in plan
 */
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

/**
 * Delete all events in an eventgroup
 * @param {Number} eventgroupId
 *
 */
export const deleteEventGroup = eventGroupId => dispatch => {
  eventGroupService.deleteEventGroup(eventGroupId).then(() =>
    dispatch({
      type: 'DELETE_EVENTGROUP',
      eventGroupId,
    })
  )
}
/**
 * Add event to state
 * @param {Object} event - event to add
 */
export const addEvent = event => dispatch => {
  eventService.create(event).then(created => {
    created.activities = []
    dispatch({
      type: 'ADD_EVENT',
      event: created,
    })
  })
}

/**
 * Add kuksa event to application events
 * @param {Object} event - event to add
 */
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
      eventId: `kuksa${event.kuksaEventId}`,
    })
  })
}

/*
 * Edit event in state hashmap
 * @Param {Object} event
 */
export const editEvent = event => dispatch => {
  eventService.edit(event).then(modded =>
    dispatch({
      type: 'UPDATE_EVENT',
      modded,
    })
  )
}
/**
 * Add activity to an event in the state hashmap and backend.
 * @param eventId - id of the target event
 * @param {Object} activity - activity to add
 *
 */
export const addActivityToEvent = (eventId, activity) => dispatch => {
  eventService.addActivity(eventId, activity).then(postedActivity =>
    dispatch({
      type: 'ADD_ACTIVITY_TO_EVENT',
      eventId,
      activity: postedActivity,
    })
  )
}

/**
 * Delete an activity to from event in state and Backend
 * @param eventId
 * @param activityId
 *
 *
 */
export const deleteActivityFromEvent = (activityId, eventId) => dispatch => {
  dispatch({
    type: 'DELETE_ACTIVITY_FROM_EVENT',
    activityId,
    eventId,
  })
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

export const updateActivityInEvents = activity => dispatch => {
  dispatch({ type: 'UPDATE_ACTIVITY', activity })
}

export const eventList = state => {
  if (!state) return []
  const eventKeys = Object.keys(state)
  return eventKeys.map(key => {
    const event = state[key]
    return event
  })
}

export default reducer
