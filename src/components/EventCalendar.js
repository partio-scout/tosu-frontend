import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEvents(events) {
  return events.map(event => {
    return {
      title: event.title,
      start: new Date(event.startDate + ' ' + event.startTime),
      end: new Date(event.endDate + ' ' + event.endTime),
      activities: event.activities,
      allDay: false,
      resource: null,
    }
  })
}

function Event({ event }) {
  return (
    <div>
      <span>
        {event.title}
      </span><br/>
      <span>
        {createActivityMarkers(event.activities.length)}
      </span>
    </div>
  )
}

function createActivityMarkers(count) {
  let markers = [' ']

  for (var i = 0; i < count; i++) {
    markers.push(<span className="activity-marker"></span>)
  }

  return markers
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
          showMultiDayTimes
          components={{
            event: Event,
          }}
        />
      </div>
    )
  }
}
