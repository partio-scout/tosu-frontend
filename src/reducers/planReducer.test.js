import reducer from './planReducer'
import { stat } from 'fs'

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
    const plans = { id: 1, plans: [{ id: 'abc', content: 'testi' }] }

    const expectedAction = {
      type: 'INIT_PLANS',
      plans
    }

    const stateFirst = reducer([], expectedAction)

    const id = 1
    const suggestion = { content: 'Testi2' }
    const suggestionId = 'def'

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
          { content: 'Testi2', id: 'def' }
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
