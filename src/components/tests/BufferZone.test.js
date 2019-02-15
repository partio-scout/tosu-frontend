import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { Provider } from 'react-redux'
import { BufferZone } from '../BufferZone'

const testActivity = {
  activityBufferId: 1,
  createdAt: '2019-01-28T08:58:07.557Z',
  eventId: 1,
  guid: 'asdfghsfgasfsdf',
  id: 1,
  updatedAt: '2019-01-28T08:58:07.557Z',
}

const testBuffer = {
  id: 1,
  activities: [testActivity],
}

const testClasses = {
  divider: 'none',
}

const testEvents = []

const mockDeleteFromBuffer = jest.fn()
const mockPofTreeUpdate = jest.fn((a, b) => {})
const mockNotify = jest.fn()

const veryMockStore = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(() => {}),
}

const testZone = () => (
  <Provider store={veryMockStore}>
    <BufferZone
      buffer={testBuffer}
      deleteActivityFromBuffer={mockDeleteFromBuffer}
      pofTreeUpdate={mockPofTreeUpdate}
      notify={mockNotify}
      events={testEvents}
      classes={testClasses}
    />
  </Provider>
  )

const testZoneNoBufferId = () => (
  <Provider store={veryMockStore}>
    <BufferZone
      buffer={{ activities: [] }}
      deleteActivityFromBuffer={mockDeleteFromBuffer}
      pofTreeUpdate={mockPofTreeUpdate}
      notify={mockNotify}
      events={testEvents}
      classes={testClasses}
    />
  </Provider>
  )

const testZoneNoBufferActivities = () => (
  <Provider store={veryMockStore}>
    <BufferZone
      buffer={{ id: 1, activities: [] }}
      deleteActivityFromBuffer={mockDeleteFromBuffer}
      pofTreeUpdate={mockPofTreeUpdate}
      notify={mockNotify}
      events={testEvents}
      classes={testClasses}
    />
  </Provider>
  )

const tick = () => new Promise(resolve => {
    setTimeout(resolve, 0)
  })

describe('<BufferZone />', () => {
  it("renders nothing if bufferzone doesn't have an id", () => {
    const wrapper = shallow(testZoneNoBufferId()).dive()
    expect(wrapper.contains(<div />)).to.equal(true)
  })

  it("renders nothing if bufferzone doesn't have activities", () => {
    const wrapper = shallow(testZoneNoBufferActivities()).dive()
    expect(wrapper.contains(<div />)).to.equal(true)
  })

  it('renders an ActivityDragAndDropTarget if bufferzone has an id', () => {
    const wrapper = shallow(testZone()).dive()
    expect(wrapper.find({ activities: [testActivity] }))
  })

  it('removes activities when clear is clicked', async () => {
    const wrapper = shallow(testZone()).dive()
    const button = wrapper.find({ id: 'empty-button' })
    button.simulate('click', { currentTarget: wrapper })
    await tick()
    expect(mockDeleteFromBuffer.mock.calls.length).to.equal(1)
    expect(mockPofTreeUpdate.mock.calls.length).to.equal(1)
    expect(mockNotify.mock.calls.length).to.equal(1)
  })
})
