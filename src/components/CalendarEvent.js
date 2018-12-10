import React, { Component } from 'react'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import { Parser } from 'html-to-react'

import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent'
import AddToPlan from './AddToPlan'
import { openPopper, closePopper } from '../reducers/calendarReducer'

function createActivityMarkers(activities) {
  let markers = [' ']
  for (var i = 0; i < activities.length; i++) {
    markers.push(<span className='calendar-activity-marker' key={activities[i].id} />)
  }
  return markers
}

export function eventStyleGetter(event, start, end, isSelected) {
  const backgroundColor = event.kuksaEvent ? 'lightgrey' : '#27AAE1'
  const color = event.kuksaEvent ? 'black' : 'white'
  return {
    style: {
      backgroundColor: backgroundColor,
      color: color,
      borderRadius: 2

    }
  }
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

  closePopper = () => {
    this.setState(state => ({ anchorEl: null }))
    this.props.closePopper()
  }

  openPopper = (target) => {
    this.setState(state => ({ anchorEl: target }))
    this.props.openPopper(this.props.event.id)
  }
  handleClick = event => {
    const { currentTarget } = event
    if (!this.props.popperOpen){
      this.openPopper(currentTarget)
    } else if (this.state.anchorEl){
      this.closePopper()
    }
  }

  componentWillUnmount(){
    if (this.state.anchorEl){
      this.closePopper()
    }
  }

  // It is possible that when event is removed (or added) on calendar view, the event
  // of a CalendarEvent component changes (Calendar probably uses 
  // the same component to draw the event with same index in the event list)
  // In that case the we need to update the state
  // If popup was open, close it...
  componentWillReceiveProps(nextProps) {
    if (nextProps.event.id !== this.props.event.id){
      if (this.state.anchorEl){
        this.closePopper()
      }
      this.setState({
        event: nextProps.event,
        pofTree: nextProps.pofTree,
        anchorEl: null,
      })
    }
  } 
  
  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const id = open ? 'no-transition-popper' : null

    const event = this.props.event
    const startTime = event.start.toLocaleTimeString('fi-FI', { 'hour': 'numeric', 'minute': 'numeric' })
    const endTime = event.end.toLocaleTimeString('fi-FI', { 'hour': 'numeric', 'minute': 'numeric' })
    const information = new Parser().parse(event.information)

    let popoverContentClassName // Style: Normal
    if (event.activities.length === 0) {
      popoverContentClassName = 'empty-event-card' // Style: No activities
    }
    if (event.synced) {
      popoverContentClassName = 'kuksa-synced-event-card' // Style: Synced to Kuksa
    }
    if (event.kuksaEvent) {
      popoverContentClassName = 'kuksa-event-card' // Style: Kuksa event
    }

    const activities = (
      <div>
        <Activities
          activities={this.props.event.activities}
          bufferzone={false}
          parentId={this.props.event.id}
          className='calendar-event-activity-wrapper'
        />
      </div>
    )

    const editDeleteButtons = (
      <div>
        <div className='calendar-event-button-wrapper'>
          <EditEvent
            buttonClass='calendar-button'
            data={event.originalData}
            setNotification={this.props.setNotification}
            minimal='true'
          />
          <DeleteEvent
            buttonClass='calendar-button'
            data={event.originalData}
            setNotification={this.props.setNotification}
            minimal='true'
          />
        </div>
      </div>
    )

    const popoverContent = (
      <div>
        <div>
          <div className='calendar-popover-left'>
            <p className='calendar-event-title'>{event.title}</p>
          </div>
          <div className='calendar-popover-right'>
            <IconButton onClick={this.closePopper}>
              <Icon>close</Icon>
            </IconButton>
          </div>
        </div>
        {startTime} - {endTime}
        <p>
          {information}
        </p>
        {!event.kuksaEvent && activities}
        {!event.kuksaEvent && editDeleteButtons}
        {event.kuksaEvent && (<AddToPlan event={event.originalData} />)}
      </div>
    )

    // Don't allow dragging activities to kuksa events
    const paperContent = event.kuksaEvent ? (
      <div className='calendar-event-popper'>
        {popoverContent}
        <br />
      </div>
    ) : (
      <ActivityDragAndDropTarget bufferzone={false} parentId={this.props.event.id} className='calendar-event-popper'>
        {popoverContent}
      </ActivityDragAndDropTarget>
    )

    return (
      <div>
        <div aria-describedby={id} onClick={this.handleClick}>
          <span>
            {event.title}
          </span>
          <br />
          {createActivityMarkers(event.activities)}
        </div>
        <Popper id={id} open={open} anchorEl={anchorEl} style={{ zIndex: 999 }}>
          <div className={popoverContentClassName}>
            <Paper>{paperContent}</Paper>
          </div>
        </Popper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    pofTree: state.pofTree,
    popperOpen: state.calendar.popperOpen,
    popperEventId: state.calendar.popperEventId,
  }
}

export default connect(mapStateToProps, {
  openPopper,
  closePopper,
})(CalendarEvent)