import eventService from '../services/events'
import eventGroupService from '../services/eventgroups'
import activityService from '../services/activities'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return action.events
    case 'ADD_EVENT':
      return state.concat(action.event)
    case 'DELETE_EVENT':
      return state.filter(event => event.id !== action.eventId)
    case 'DELETE_EVENTGROUP':
      return state.filter(event => event.groupId === null || event.groupId !== action.eventGroupId)
    case 'UPDATE_EVENT':
      const old = state.filter(event => event.id.toString() !== action.modded.id.toString())
      return old.concat(action.modded)

    case 'ADD_ACTIVITY_TO_EVENT':

      let event = state.find(event => event.id.toString() === action.eventId.toString())
      event.activities = event.activities.concat(action.activity)

      const outdated = state.filter(event => event.id.toString() !== action.eventId.toString())
      return outdated.concat(event)

    case 'DELETE_ACTIVITY_FROM_EVENT':

      let deleteFrom = state.find(e =>
        e.activities.find(a => a.id === action.activityId) !== undefined)
      if (deleteFrom === undefined) {
        return state
      }
      deleteFrom.activities = deleteFrom.activities.filter(a => a.id.toString() !== action.activityId.toString())
      const outdatedd = state.filter(event => event.id.toString() !== deleteFrom.id.toString())
      return outdatedd.concat(deleteFrom)

    default:
      return state
  }

}

export const eventsInitialization = (userId) => {
  return async (dispatch) => {
    const events = await eventService.getAll(userId)
    dispatch({
      type: 'INIT_EVENTS',
      events
    })
  }
}


export const deleteEvent = (eventId) => {
  return async (dispatch) => {
    await eventService.deleteEvent(eventId)
    dispatch({
      type: 'DELETE_EVENT',
      eventId
    })
  }
}
export const deleteEventGroup = (eventGroupId) => {
  return async (dispatch) => {
    await eventGroupService.deleteEventgroup(eventGroupId)
    dispatch({
      type: 'DELETE_EVENTGROUP',
      eventGroupId
    })
  }
}

export const addEvent = (event) => {
  return async (dispatch) => {
    const created = await eventService.create(event)
    created.activities = []
    dispatch({
      type: 'ADD_EVENT',
      event: created
    })
  }
}

export const editEvent = (event) => {
  return async (dispatch) => {
    await eventService.edit(event)
    dispatch({
      type: 'UPDATE_EVENT',
      modded: event
    })
  }
}

export const addActivityToEvent = (eventId, activity) => {
  return async (dispatch) => {
    const postedActivity = await eventService.addActivity(eventId, activity);

    dispatch({
      type: 'ADD_ACTIVITY_TO_EVENT',
      eventId,
      activity: postedActivity
    })
  }
}

export const deleteActivityFromEvent = (activityId) => {
  return async (dispatch) => {
    await activityService.deleteActivity(activityId);

    dispatch({
      type: 'DELETE_ACTIVITY_FROM_EVENT',
      activityId
    })
  }
}

export default reducer