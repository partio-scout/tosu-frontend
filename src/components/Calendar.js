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

var pofTree
var onSwitchChange
var switchState

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
      start: new Date(startDate.replace(/-/g, "/")),
      end: new Date(endDate.replace(/-/g, "/")),
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

// ^ Same for handling switch click
class Toolbar extends Component {
  render() {
    return (
      <CalendarToolbar
        view={this.props.view}
        views={this.props.views}
        label={this.props.label}
        messages={this.props.messages}
        onNavigate={this.props.onNavigate}
        onViewChange={this.props.onViewChange}
        onSwitchChange={onSwitchChange}
        switchState={switchState}
      />
    )
  }
}

class Calendar extends Component {
  constructor(props) {
    super(props)
    onSwitchChange = this.handleSwitchChange
    switchState = false
    this.state = {
      shouldShowKuksaEventsAlso: switchState
    }
  }

  handleSwitchChange = () => {
    this.setState({ shouldShowKuksaEventsAlso: !this.state.shouldShowKuksaEventsAlso })
    switchState = !switchState
  }

  render() {
    const { events } = this.props
    pofTree = this.props.pofTree
    const eventsToShow = prepareEventsToCalendarEvents(events, this.state.shouldShowKuksaEventsAlso)

    return (
      <div className="calendar">
        <BigCalendar
          localizer={localizer}
          events={eventsToShow}
          startAccessor="start"
          endAccessor="end"
          showMultiDayTimes
          views={['month', 'week', 'day']}
          components={{
            event: Event,
            toolbar: Toolbar,
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
  }
}

export default connect(mapStateToProps)(Calendar)
