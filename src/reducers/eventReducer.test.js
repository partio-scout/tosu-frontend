import reducer from './eventReducer'

const initialEvents = [
  {
    activities: [],
    eventGroupId: null,
    id: 1,
    title: 'Testi',
  },
  {
    activities: [],
    eventGroupId: null,
    id: 2,
    title: 'Testi2',
  },
]

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

    expect(newState).toEqual(initialEvents.concat([newEvent]))
    expect(newState.length).toEqual(firstState.length + 1)
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

    expect(newState).toEqual(
      initialEvents.filter(event => event.id !== eventId)
    )
    expect(newState.length).toEqual(firstState.length - 1)
  })

  it('DELETE_EVENTGROUP removes all events in the group', () => {
    const initialEventgroup = [
      {
        activities: [],
        eventGroupId: 1,
        id: 1,
        title: 'Testi',
      },
      {
        activities: [],
        eventGroupId: 1,
        id: 2,
        title: 'Testi2',
      },
      {
        activities: [],
        eventGroupId: null,
        id: 2,
        title: 'Testi3',
      },
    ]

    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEventgroup,
    })

    const eventGroupId = 1

    const expectedAction = {
      type: 'DELETE_EVENTGROUP',
      eventGroupId,
    }

    const expectedState = [
      {
        activities: [],
        eventGroupId: null,
        id: 2,
        title: 'Testi3',
      },
    ]

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

    expect(newState.filter(event => event.id === modded.id)).toEqual([modded])
    expect(newState.length).toEqual(initialEvents.length)
  })

  it('ADD_ACTIVITY_TO_EVENT adds activity to event', () => {
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: initialEvents,
    })
    const activity = { title: 'aktiviteetti' }
    const eventId = 1
    const expectedAction = {
      type: 'ADD_ACTIVITY_TO_EVENT',
      eventId,
      activity,
    }

    const newState = reducer(firstState, expectedAction)

    const selectedEvent = newState.filter(event => event.id === eventId)[0]

    expect(selectedEvent.activities).toEqual([activity])
  })

  it('DELETE_ACTIVITY_FROM_EVENT removes activity from event', () => {
    const eventWithActivity = [
      {
        activities: [{ id: 11, title: 'poistettava', eventId: 2 }],
        eventGroupId: null,
        id: 2,
        title: 'Testi2',
      },
    ]
    const firstState = reducer(null, {
      type: 'INIT_EVENTS',
      events: eventWithActivity,
    })

    const activityId = 11

    const expectedAction = {
      type: 'DELETE_ACTIVITY_FROM_EVENT',
      activityId,
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState).toEqual([
      {
        activities: [],
        eventGroupId: null,
        id: 2,
        title: 'Testi2',
      },
    ])
  })
})
