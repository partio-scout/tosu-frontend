import React, { Component } from 'react'
import { connect } from 'react-redux'
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'

import Popper from '@material-ui/core/Popper'
// import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';

import Activity from './Activity'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'

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
      activities: event.activities,
      eventId: event.id,
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

class CustomEvent extends Component {
  state = {
    anchorEl: null,
  }

  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: state.anchorEl ? null : currentTarget,
    }))
  }

  render() {
    const { classes } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const id = open ? 'no-transition-popper' : null
    const { title, start, end, activities, eventId } = this.props.event

    const rows = activities.map(activity => {
      const pofActivity = convertToSimpleActivity(
        findActivity(activity, pofTree)
      )
      return (
        <Activity
          bufferzone={false}
          parentId={eventId}
          parent={this}
          key={activity.id}
          pofActivity={pofActivity}
          activity={activity}
          deleteActivity={this.deleteActivity}
        />
      )
    })

    return (
      <div>
        <div aria-describedby={id} variant="contained" onClick={this.handleClick}>
          {title}
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl} style={{zIndex: 999}}>
          <Paper className="event-popper-paper">
            <h3>{title}</h3>
            {start.getHours()}:{start.getMinutes()} - {end.getHours()}:{end.getMinutes()}
            <div>
              {rows}
            </div>
            <Button>Muokkaa</Button>
            <Button>Poista</Button>
          </Paper>
        </Popper>
      </div>
    )
  }
}

class EventCalendar extends Component {

  render() {
    const { events } = this.props

    pofTree = this.props.pofTree // TODO: Use props?

    return (
      <div className="event-calendar">
        <BigCalendar
          popup
          localizer={localizer}
          events={prepareEvents(events)}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          showMultiDayTimes
          views={['month']}
          components={{
            event: CustomEvent,
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

export default connect(mapStateToProps)(EventCalendar)
