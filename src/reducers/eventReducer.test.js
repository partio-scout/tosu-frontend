import reducer from './eventReducer'

const initialEvents = {
  1: {
    activities: [],
    eventGroupId: null,
    id: 1,
    title: 'Testi',
  },
  2: {
    activities: [],
    eventGroupId: null,
    id: 2,
    title: 'Testi2',
  },
}

describe('event reducer', () => {
  it('retuns null as inital state', () => {
    expect(reducer(null, { type: 'UNKNOWN' })).toEqual(null)
  })

  it('INIT_EVENTS returns given events', () => {
    const expectedAction = {
      type: 'INIT_EVENTS',
      events: initialEvents,
    }

    expect(reducer(null, expectedAction)).toEqual(initialEvents)
  })

  it('ADD_EVENT adds new event', () => {
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEvents,
    })

    const newEvent = {
      activities: [],
      eventGroupId: null,
      id: 3,
      title: 'Testi3',
    }

    const expectedAction = {
      type: 'ADD_EVENT',
      event: newEvent,
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState[newEvent.id]).toEqual(newEvent)
    expect(Object.keys(newState).length).toEqual(
      Object.keys(firstState).length + 1
    )
  })

  it('DELETE_EVENT removes selected event', () => {
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEvents,
    })

    const eventId = 2

    const expectedAction = {
      type: 'DELETE_EVENT',
      eventId,
    }
    const newState = reducer(firstState, expectedAction)

    expect(newState[eventId]).toEqual(undefined)
    expect(Object.keys(newState).length).toEqual(
      Object.keys(firstState).length - 1
    )
  })

  it('DELETE_EVENTGROUP removes all events in the group', () => {
    const initialEventgroup = {
      1: {
        activities: [],
        eventGroupId: 1,
        id: 1,
        title: 'Testi',
      },
      2: {
        activities: [],
        eventGroupId: 1,
        id: 2,
        title: 'Testi2',
      },
      3: {
        activities: [],
        eventGroupId: null,
        id: 3,
        title: 'Testi3',
      },
    }

    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEventgroup,
    })

    const eventGroupId = 1

    const expectedAction = {
      type: 'DELETE_EVENTGROUP',
      eventGroupId,
    }

    const expectedState = {
      3: {
        activities: [],
        eventGroupId: null,
        id: 3,
        title: 'Testi3',
      },
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState).toEqual(expectedState)
  })

  it('UPDATE_EVENT updates event', () => {
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEvents,
    })

    const modded = {
      activities: [],
      eventGroupId: null,
      id: 1,
      title: 'Muokattu',
    }
    const expectedAction = {
      type: 'UPDATE_EVENT',
      modded,
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState[modded.id]).toEqual(modded)
    expect(Object.keys(newState).length).toEqual(
      Object.keys(initialEvents).length
    )
  })

  it('ADD_ACTIVITY_TO_EVENT adds activity to event', () => {
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEvents,
    })
    const activity = { id: 5, title: 'aktiviteetti' }
    const eventId = 1
    const expectedAction = {
      type: 'ADD_ACTIVITY_TO_EVENT',
      eventId,
      activity,
    }

    const newState = reducer(firstState, expectedAction)

    const selectedEvent = newState[eventId]

    expect(selectedEvent.activities).toEqual([activity.id])
  })

  it('DELETE_ACTIVITY_FROM_EVENT removes activity from event', () => {
    const eventWithActivity = {
      2: {
        activities: [11],
        eventGroupId: null,
        id: 2,
        title: 'Testi2',
      },
    }
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: eventWithActivity,
    })

    const activityId = 11
    const eventId = 2
    const expectedAction = {
      type: 'DELETE_ACTIVITY_FROM_EVENT',
      activityId,
      eventId,
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState).toEqual({
      2: {
        activities: [],
        eventGroupId: null,
        id: 2,
        title: 'Testi2',
      },
    })
  })
})
