import React, { Component } from 'react'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'

import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent';

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

  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: state.anchorEl ? null : currentTarget,
    }))
  }

  handleClose = () => {

  }

  closePopper = () => {
    this.setState(state => ({
      anchorEl: null,
    }))
  }

  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const id = open ? 'no-transition-popper' : null

    const event = this.props.event
    const startTime = event.start.toLocaleTimeString('fi-FI', { 'hour': 'numeric', 'minute': 'numeric' })
    const endTime = event.end.toLocaleTimeString('fi-FI', { 'hour': 'numeric', 'minute': 'numeric' })

    return (
      <div>
        <div aria-describedby={id} onClick={this.handleClick}>
          <span>
            {event.title}
          </span><br />
          {createActivityMarkers(event.activities)}
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl} style={{ zIndex: 999 }}>
          <Paper>
            <ActivityDragAndDropTarget bufferzone={false} parentId={this.props.event.id} className="calendar-event-popper">
              <div>
                <div className="left">
                  <p className="calendar-event-title">{event.title}</p>
                </div>
                <div className="right">
                  <IconButton onClick={this.closePopper}>
                    <Icon>close</Icon>
                  </IconButton>
                </div>
              </div>
              {startTime} - {endTime}
              <p>
                {event.information}
              </p>
              <p>
                Aktiviteetit:
              </p>
              <Activities
                activities={this.props.event.activities}
                bufferzone={false}
                parentId={this.props.event.id} 
                className='calendar-event-activity-wrapper'
              />
              <div className="calendar-event-button-wrapper">
                <EditEvent
                  buttonClass="calendar-button"
                  data={event}
                  source={this.handleClose}
                  setNotification={this.props.setNotification}
                />
                <DeleteEvent
                  buttonClass="calendar-button"
                  data={event}
                  source={this.handleClose}
                  setNotification={this.props.setNotification}
                />
              </div>
            </ActivityDragAndDropTarget>
          </Paper>
        </Popper>
      </div>
    )
  }
}

export default CalendarEvent
