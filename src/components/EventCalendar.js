import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEvents(events) {
  return events.map(event => {
    console.log("event",event)
    return {
      title: event.title,
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

    return (
      <div className="event-calendar">
        <BigCalendar
          localizer={localizer}
          events={prepareEvents(events)}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    )
  }
}
