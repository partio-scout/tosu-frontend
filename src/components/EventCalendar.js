import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEvents(events) {
  console.log("received:",events)
  return events.map(event => {
    console.log("event",event)
    return {
      title: event.type,
      start: new Date(event.startDate),
      end: new Date(event.startDate),
      allDay: false,
      resource: null,
    }
  })
}

export default class EventCalendar extends Component {

  render() {
    const { events } = this.props
    console.log("props events",events.events)

    return (
      <div>
        <BigCalendar
          localizer={localizer}
          events={prepareEvents(events.events)}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    )
  }
}
