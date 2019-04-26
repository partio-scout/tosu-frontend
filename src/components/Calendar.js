import React, { Component } from 'react'
import { connect } from 'react-redux'
// React big calendar: https://onursimsek94.github.io/react-big-calendar/examples/index.html
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'
import 'moment/locale/fi'
import CalendarToolbar from './CalendarToolbar'
import CalendarEvent from './CalendarEvent'
import { eventStyleGetter } from './CalendarEvent'
import { eventList } from '../reducers/eventReducer'
import { closePopper } from '../reducers/calendarReducer'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

const styles = {
  mobileCalendar: {
    height: '98%',
  },
  calendar: {
    height: '80%',
    paddingTop: 20,
  },
}

const localizer = BigCalendar.momentLocalizer(moment)

/**
 * Maps the events that fit a certain date range and renders them to the app
 * @param originalData Used when it's better to use the original event for API calls
 * @param events events that are added to the calendar
 * @param {boolean} shouldShowKuksaEventsAlso whether kuksa events are shown
 * @returns all events mapped to calendar or just non kuksa events
 */
function prepareEventsToCalendarEvents(events, shouldShowKuksaEventsAlso) {
  const preparedEvents = eventList(events).filter(event => {
    if (event.kuksaEvent) {
      return shouldShowKuksaEventsAlso
    }
    return true
  })
  return preparedEvents.map(event => {
    const startDate = `${event.startDate} ${event.startTime}`
    const endDate = `${event.endDate} ${event.endTime}`
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
      originalData: event,
    }
  })
}

export class Calendar extends Component {
  constructor(props) {
    super(props)
    this.props.closePopper()
  }

  render() {
    const { events, classes } = this.props
    const eventsToShow = prepareEventsToCalendarEvents(
      events,
      this.props.shouldShowKuksaEventsAlso
    )

    return (
      <div
        className={
          this.props.mobile ? classes.mobileCalendar : classes.calendar
        }
      >
        <BigCalendar
          localizer={localizer}
          events={eventsToShow}
          startAccessor="start"
          endAccessor="end"
          showMultiDayTimes
          views={['month', 'week', 'day']}
          components={{
            event: CalendarEvent,
            toolbar: CalendarToolbar,
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  shouldShowKuksaEventsAlso: state.calendar.showKuksa,
})

Calendar.propTypes = {
  closePopper: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  mobile: PropTypes.bool.isRequired,
  shouldShowKuksaEventsAlso: PropTypes.bool.isRequired,
}

Calendar.defaultProps = {}

export default connect(
  mapStateToProps,
  { closePopper }
)(withStyles(styles)(Calendar))
