import reducer from './pofActivityReducer'

describe('pofActivity reducer', () => {
  it('retuns empty list as inital state', () => {
    expect(reducer([], { type: 'UNKNOWN' })).toEqual([])
  })

  it('INIT_POF returns given data', () => {
    const pofActivities = { content: 'Pofdata' }

    const expectedAction = {
      type: 'INIT_POF',
      pofActivities
    }

    expect(reducer(null, expectedAction)).toEqual(pofActivities)
  })
})
