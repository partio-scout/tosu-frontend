import reducer from './planReducer'

describe('plan reducer', () => {
  it('INIT_PLANS should return given plans', () => {
    const plans = { content: 'testi' }

    const expectedAction = {
      type: 'INIT_PLANS',
      plans
    }

    expect(reducer([], expectedAction)).toEqual([plans])
  })

  it('SAVE_PLANS should add plan to list', () => {
    const plans = {
      id: 1,
      plans: [{ id: 'abc', content: 'testi' }, { id: 'def', content: 'testi2' }]
    }

    const expectedAction = {
      type: 'INIT_PLANS',
      plans
    }

    const stateFirst = reducer([], expectedAction)

    const id = 1
    const suggestion = { content: 'testi3' }
    const suggestionId = 'ghi'

    const expectedAction2 = {
      type: 'SAVE_PLAN',
      id,
      suggestion,
      suggestionId
    }

    expect(reducer(stateFirst, expectedAction2)).toEqual([
      {
        id: 1,
        plans: [
          { content: 'testi', id: 'abc' },
          { content: 'testi2', id: 'def' },
          { content: 'testi3', id: 'ghi' }
        ]
      }
    ])
  })

  it('DELETE_PLAN should delete given plan', () => {
    const plans = [
      {
        id: 1,
        plans: [
          { content: 'testi', id: 'abc' },
          { content: 'Testi2', id: 'def' }
        ]
      }
    ]
    const expectedAction = {
      type: 'INIT_PLANS',
      plans
    }

    const stateFirst = reducer([], expectedAction)

    const id = 'abc'
    const activityId = 1

    const expectedAction2 = {
      type: 'DELETE_PLAN',
      id,
      activityId
    }

    expect(reducer(stateFirst, expectedAction2)).toEqual([
      {
        id: 1,
        plans: [{ content: 'Testi2', id: 'def' }]
      }
    ])
  })
})
