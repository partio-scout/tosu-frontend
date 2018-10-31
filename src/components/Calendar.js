import React, { Component } from 'react'
import { connect } from 'react-redux'
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'

import CalendarToolbar from './CalendarToolbar'
import CalendarEvent from './CalendarEvent'

var pofTree

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEvents(events) {
  return events.map(event => {
    return {
      title: event.title,
      start: new Date(event.startDate + ' ' + event.startTime),
      end: new Date(event.endDate + ' ' + event.endTime),
      allDay: false,
      activities: event.activities,
      eventId: event.id,
      information: event.information,
    }
  })
}

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
    pofTree = this.props.pofTree // TODO: Use props?

    return (
      <div className="calendar">
        <BigCalendar
          popup
          localizer={localizer}
          events={prepareEvents(events)}
          startAccessor="start"
          endAccessor="end"
          showMultiDayTimes
          views={['month']}
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
