import reducer from './notificationReducer'

describe('notification reducer', () => {
  it('retuns null as inital state', () => {
    expect(reducer(null, { type: 'UNKNOWN' })).toEqual(null)
  })

  it('NOTIFY return note', () => {
    const note = { text: 'Notification', textType: 'succes' }

    const expectedAction = {
      type: 'NOTIFY',
      note,
    }

    expect(reducer([], expectedAction)).toEqual(note)
  })

  it('CLEAR_NOTIFICATION return null', () => {
    const note = { text: 'Notification', textType: 'succes' }

    const expectedAction = {
      type: 'CLEAR_NOTIFICATION',
      note,
    }

    expect(reducer([note], expectedAction)).toEqual(null)
  })
})
