import React, { Component } from 'react'
import { connect } from 'react-redux'
// React big calendar: https://onursimsek94.github.io/react-big-calendar/examples/index.html
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'
import 'moment/locale/fi'

import 'react-big-calendar-like-google/lib/css/react-big-calendar.css'

import CalendarToolbar from './CalendarToolbar'
import CalendarEvent from './CalendarEvent'

var pofTree

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEventsToCalendarEvents(events) {
  return events.map(event => {
    return {
      title: event.title,
      start: new Date(event.startDate + ' ' + event.startTime),
      end: new Date(event.endDate + ' ' + event.endTime),
      allDay: false,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      activities: event.activities,
      type: event.type,
      id: event.id,
      information: event.information
    }
  })
}

// This Event is used to pass pofTree to the actual CalendarEvent.
// (There might be a better solution somehow using props)
class Event extends Component {
  render() {
    return (
      <CalendarEvent
        event={this.props.event}
        pofTree={pofTree}
      />
    )
  }
}

class Calendar extends Component {
  render() {
    const { events } = this.props
    pofTree = this.props.pofTree

    return (
      <div className="calendar">
        <BigCalendar
          localizer={localizer}
          events={prepareEventsToCalendarEvents(events)}
          startAccessor="start"
          endAccessor="end"
          showMultiDayTimes
          views={['month', 'week', 'day']}
          components={{
            event: Event,
            toolbar: CalendarToolbar,
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pofTree: state.pofTree,
  }
}

export default connect(mapStateToProps)(Calendar)
