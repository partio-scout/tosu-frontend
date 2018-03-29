import reducer from './bufferZoneReducer'

describe('notification reducer', () => {
  it('retuns null as inital state', () => {
    expect(reducer(null, { type: 'UNKNOWN' })).toEqual(null)
  })

  it('INIT_BUFFER returns buffer', () => {
    const buffer = { id: 1, activities: [] }

    const expectedAction = {
      type: 'INIT_BUFFER',
      buffer
    }

    expect(reducer(null, expectedAction)).toEqual(buffer)
  })

  it('ADD_TO_BUFFER adds activity to buffer', () => {
    const buffer = { id: 1, activities: [] }

    const firstState = reducer(null, { type: 'INIT_BUFFER', buffer })

    const activity = { id: 1, title: 'testi', guid: 'abc' }

    const expectedAction = {
      type: 'ADD_TO_BUFFER',
      activity
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState.activities[0]).toEqual(activity)
    expect(newState.activities.length).toEqual(firstState.activities.length + 1)
  })

  it('DELETE_FROM_BUFFER removes activity to buffer', () => {
    const buffer = {
      id: 1,
      activities: [{ id: 1, title: 'testi', guid: 'abc' }]
    }

    const firstState = reducer(null, { type: 'INIT_BUFFER', buffer })

    const activityId = 1

    const expectedAction = {
      type: 'DELETE_FROM_BUFFER',
      activityId
    }

    const newState = reducer(firstState, expectedAction)

    expect(newState.activities).toEqual([])
    expect(newState.activities.length).toEqual(firstState.activities.length - 1)
  })
})
