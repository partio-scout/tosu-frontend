import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { Calendar } from '../Calendar'

const testPofTree = {}
const testShowKuksa = true
const testEvent = {
  title: 'tapahtuma',
  start: '',
  end: '',
}
const testEvents = []

const mockClosePopper = jest.fn()
const mobile = false

const testCalendar = () => {
  return (
    <Calendar
      pofTree={testPofTree}
      events={testEvents}
      shouldShowKuksaEventsAlso={testShowKuksa}
      closePopper={mockClosePopper}
    />
  )
}

describe('<Calendar />', () => {
  it('renders', () => {
    const wrapper = shallow(testCalendar())
    console.log(wrapper.debug())
  })
})
