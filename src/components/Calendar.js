import React, { Component } from 'react'
import { connect } from 'react-redux'
// React big calendar: https://onursimsek94.github.io/react-big-calendar/examples/index.html
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'
import 'moment/locale/fi'
import 'react-big-calendar-like-google/lib/css/react-big-calendar.css'

import CalendarToolbar from './CalendarToolbar'
import CalendarEvent from './CalendarEvent'
import { eventStyleGetter } from './CalendarEvent'
import { closePopper } from '../reducers/calendarReducer'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEventsToCalendarEvents(events, shouldShowKuksaEventsAlso) {
  events = events.filter(event => {
    if (event.kuksaEvent) {
      return shouldShowKuksaEventsAlso
    }
    return true
  })
  return events.map(event => {
    const startDate = event.startDate + ' ' + event.startTime
    const endDate = event.endDate + ' ' + event.endTime
    return {
      title: event.title,
      start: new Date(startDate.replace(/-/g, '/')),
      end: new Date(endDate.replace(/-/g, '/')),
      allDay: false,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      activities: event.activities,
      type: event.type,
      id: event.id,
      information: event.information,
      synced: event.synced,
      kuksaEvent: event.kuksaEvent,
      originalData: event, // Used when it's better to use the original event for API calls
    }
  })
}

export class Calendar extends Component {
  constructor(props) {
    super(props)
    this.props.closePopper()
  }

  render() {
    const { events } = this.props
    const eventsToShow = prepareEventsToCalendarEvents(events, this.props.shouldShowKuksaEventsAlso)

    return (
      <div className={this.props.mobile ? 'mobile-calendar' : 'calendar'}>
        <BigCalendar
          localizer={localizer}
          events={eventsToShow}
          startAccessor='start'
          endAccessor='end'
          showMultiDayTimes
          views={['month', 'week', 'day']}
          components={{
            event:  CalendarEvent,
            toolbar: CalendarToolbar,
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pofTree: state.pofTree,
    shouldShowKuksaEventsAlso: state.calendar.showKuksa,
  }
}

export default connect(mapStateToProps, {
  closePopper,
})(Calendar)
