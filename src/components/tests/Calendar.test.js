import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { Calendar } from '../Calendar'

const testPofTree = {}
const testEvent = {
  title: 'tapahtuma',
  startDate: '',
  startTime: '',
  endTime: '',
  endDate: '',
  activities: [],
  type: '',
  id: 1,
  information: 'info',
  synced: true,
  kuksaEvent: false,
}

const testKuksaEvent = {
  title: 'Kuksa tapahtuma',
  startDate: '',
  startTime: '',
  endTime: '',
  endDate: '',
  activities: [],
  type: '',
  id: 200,
  information: 'info',
  synced: true,
  kuksaEvent: true,
}

const testEvents = [testEvent, testKuksaEvent]

const mockClosePopper = jest.fn()
const mobile = false

const testCalendarNoKuksa = () => {
  return (
    <Calendar
      pofTree={testPofTree}
      events={testEvents}
      shouldShowKuksaEventsAlso={false}
      closePopper={mockClosePopper}
      mobile={false}
    />
  )
}

describe('<Calendar />', () => {
  it('Kuksa events wont show if showKuksa is false', () => {
    const wrapper = shallow(testCalendarNoKuksa())
    const events = wrapper
      .children()
      .dive()
      .instance().props.events
    expect(
      events.find(event => {
        return event.id === testEvent.id
      })
    ).to.not.equal(undefined)
    expect(
      events.find(event => {
        return event.id === testKuksaEvent.id
      })
    ).to.equal(undefined)
  })
})
