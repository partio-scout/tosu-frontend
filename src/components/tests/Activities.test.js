import React from 'react'
import { Provider } from 'react-redux'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { Activities } from '../Activities'
import * as activityConverter from '../../functions/activityConverter'
import store from '../../store'

jest.mock('../../functions/findActivity')
activityConverter.default = jest.fn(() => ({
  id: 1,
  name: 'pofActivity',
}))

/* Lets start by mocking all of the prop functions */
const mockNotify = jest.fn()
const mockPofTreeUpdate = jest.fn()
const mockDeleteActivityFromBuffer = jest.fn()
const mockDeleteActivityFromEvent = jest.fn()
const mockPofTree = {
    activities: { 'asdfghsfgasfsdf':{ guid: 'asdfghsfgasfsdf'}}, 
}
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
        bufferzone
        parentId={1}
        notify={mockNotify}
        pofTreeUpdate={mockPofTreeUpdate}
        deleteActivityFromBuffer={mockDeleteActivityFromBuffer}
        deleteActivityFromEvent={mockDeleteActivityFromEvent}
        className="activity-list"
        activities={[testActivity]}
        buffer={{}}
        events={[]}
        pofTree={mockPofTree}
      />
    )
    expect(
      wrapper.find({ className: 'activity-list' }).children().length
    ).to.equal(1)
  })

})
