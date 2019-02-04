import React from 'react'
import { Provider } from 'react-redux'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { Activities } from '../Activities'
import * as activityConverter from '../../functions/activityConverter'
import store from '../../store'

jest.mock('../../functions/findActivity')
activityConverter.default = jest.fn(() => {
  return {
    id: 1,
  }
})

/* Lets start by mocking all of the prop functions */
const mockNotify = jest.fn()
const mockPofTreeUpdate = jest.fn()
const mockDeleteActivityFromBuffer = jest.fn()
const mockDeleteActivityFromEvent = jest.fn()

const testActivity = {
  activityBufferId: 1,
  createdAt: '2019-01-28T08:58:07.557Z',
  eventId: 1,
  guid: 'asdfghsfgasfsdf',
  id: 1,
  updatedAt: '2019-01-28T08:58:07.557Z',
}

describe('<Activities />', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Activities
        bufferzone={true}
        parentId={1}
        notify={mockNotify}
        pofTreeUpdate={mockPofTreeUpdate}
        deleteActivityFromBuffer={mockDeleteActivityFromBuffer}
        deleteActivityFromEvent={mockDeleteActivityFromEvent}
        className="activity-list"
        activities={[testActivity]}
      />
    )
    expect(
      wrapper.find({ className: 'activity-list' }).children().length
    ).to.equal(1)
  })
  it('delete function calls deleteactivity and pofTreeUpdate', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Activities
          bufferzone={true}
          parentId={1}
          notify={mockNotify}
          pofTreeUpdate={mockPofTreeUpdate}
          deleteActivityFromBuffer={mockDeleteActivityFromBuffer}
          deleteActivityFromEvent={mockDeleteActivityFromEvent}
          className="activity-list"
          activities={[testActivity]}
        />
      </Provider>
    )
    const activity = wrapper.find({ activity: testActivity }).children()
    activity
      .instance()
      .props.deleteActivity(testActivity)
      .then(() => {
        expect(mockDeleteActivityFromBuffer.mock.calls.length).to.equal(1)
        expect(mockPofTreeUpdate.mock.calls.length).to.equal(1)
      })
  })
})
