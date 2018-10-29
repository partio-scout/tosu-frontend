import React, { Component } from 'react'
import { connect } from 'react-redux'
import BigCalendar from 'react-big-calendar-like-google'
import moment from 'moment'

import Modal from '@material-ui/core/Modal'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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

  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null
    }
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
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
        <div
          aria-owns={open ? 'simple-popper' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleClick}
        >
          {title}
        </div>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <h3>{title}</h3>
          {start.getHours()}:{start.getMinutes()} - {end.getHours()}:{end.getMinutes()}
          <div>
            {rows}
          </div>
        </Popover>
      </div>
    );
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
