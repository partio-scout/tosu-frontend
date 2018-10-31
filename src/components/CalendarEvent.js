import React, { Component } from 'react'
import { connect } from 'react-redux'

import Popper from '@material-ui/core/Popper'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';

import Activity from './Activity'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'

function createActivityMarkers(activities) {
  let markers = [' ']
  for (var i = 0; i < activities.length; i++) {
    markers.push(<span className="calendar-activity-marker" key={activities[i].id}></span>)
  }
  return markers
}

class CalendarEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      event: props.event,
      pofTree: props.pofTree,
      anchorEl: null,
    }
  }

  // state = {
  //   anchorEl: null,
  // }

  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: state.anchorEl ? null : currentTarget,
    }))
  }

  deleteActivity = activity => {
    // TODO
    console.log("delete activity", activity)
  }

  render() {
    const { classes } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const id = open ? 'no-transition-popper' : null

    const event = this.props.event
    const startTime = event.start.toLocaleTimeString('fi-FI', { 'hour':'numeric', 'minute':'numeric' })
    const endTime = event.end.toLocaleTimeString('fi-FI', { 'hour':'numeric', 'minute':'numeric' })

    const rows = event.activities.map(activity => { // TODO: duplicate code
      const pofActivity = convertToSimpleActivity(
        findActivity(activity, this.state.pofTree)
      )
      return (
        <Activity
          bufferzone={false}
          parentId={event.eventId}
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
          <span>
            {event.title}
          </span><br/>
          {createActivityMarkers(event.activities)}
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl} style={{zIndex: 999}}>
          <Paper className="calendar-event-popper-paper">
            <h3>{event.title}</h3>
            {startTime} - {endTime}
            <p>
              {event.information}
            </p>
            <p>
              Aktiviteetit:
            </p>
            <div className="calendar-event-activity-wrapper">
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

const mapStateToProps = state => {
  return {
    pofTree: state.pofTree,
  }
}

export default connect(mapStateToProps)(CalendarEvent)
