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
    }
  })
}

function Event({ event }) {
  return (
    <div>
      <span>
        {event.title}
      </span><br/>
      {createActivityMarkers(event.activities)}
    </div>
  )
}

function createActivityMarkers(activities) {
  let markers = [' ']

  for (var i = 0; i < activities.length; i++) {
    markers.push(<span className="activity-marker" key={activities[i].id}></span>)
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
