import React, { Component } from 'react'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import { Parser } from 'html-to-react'

import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent'
import AddToPlan from './AddToPlan'
import { openPopper, closePopper } from '../reducers/calendarReducer'
import PropTypesSchema from './PropTypesSchema'
import { withStyles } from '@material-ui/core'

const styles = {
  calendarActivityMarker: {
    height: 8,
    width: 8,
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
  },
  calendarEventPopper: {
    minWidth: 200,
    padding: 10,
    borderRadius: 4,
  },
  calendarEventButtonWrapper: {
    display: 'flex',
    width: '100%',
  },
  calendarEventActivityWrapper: {
    paddingBottom: 10,
    maxWidth: 500,
    display: 'flex',
    flexFlow: 'row wrap',
  },
  calendarEventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarPopoverLeft: {
    marginBottom: 'auto',
    display: 'inline-block',
  },
  calendarPopoverRight: {
    float: 'right',
    marginTop: 7,
  },
  emptyEventCard: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#f14150',
    borderRadius: 4,
  },
  kuksaSyncedEventCard: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#63bcd1',
    borderRadius: 4,
  },
  kuksaEventCard: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 4,
  },
}

/**
 * Function to handle the styles of the event
 * @param event event that is modified
 */
export function eventStyleGetter(event) {
  const backgroundColor = event.kuksaEvent ? 'lightgrey' : '#27AAE1'
  const color = event.kuksaEvent ? 'black' : 'white'
  return {
    style: {
      backgroundColor,
      color,
      borderRadius: 2,
    },
  }
}

class CalendarEvent extends Component {
  state = {
    anchorEl: null,
  }

  /**
   * Intializes the activitynmarkers for rendering
   * @param activities activities shown on the calendar
   * @returns markers that contain the activities
   */
  createActivityMarkers(activities) {
    const markers = [' ']
    for (let i = 0; i < activities.length; i += 1) {
      markers.push(
        <span
          className={this.props.classes.calendarActivityMarker}
          key={activities[i].id}
        />
      )
    }
    return markers
  }

  /**
   * Method that sets up the props for the component. It is possible that when event is removed (or added) on calendar view, the event
   * of a CalendarEvent component changes (Calendar probably uses he same component to draw the event with same index in the event list)
   * In that case the we need to update the state. If popup was open, close it.
   * @param nextProps same as props
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.event.id !== this.props.event.id) {
      if (this.state.anchorEl) {
        this.closePopper()
      }
      this.setState({
        event: nextProps.event,
        pofTree: nextProps.pofTree,
        anchorEl: null,
      })
    }
  }
  componentWillUnmount() {
    if (this.state.anchorEl) {
      this.closePopper()
    }
  }
  openPopper = target => {
    this.setState(state => ({ anchorEl: target }))
    this.props.openPopper(this.props.event.id)
  }
  closePopper = () => {
    this.setState(state => ({ anchorEl: null }))
    this.props.closePopper()
  }

  /**
   * Opens/closes the popper
   * @param event click event
   */

  handleClick = event => {
    const { currentTarget } = event
    if (!this.props.popperOpen) {
      this.openPopper(currentTarget)
    } else if (this.state.anchorEl) {
      this.closePopper()
    }
  }

  render() {
    const { anchorEl } = this.state
    const { classes, event } = this.props
    const open = Boolean(anchorEl)
    const id = open ? 'no-transition-popper' : null

    const startTime = event.start.toLocaleTimeString('fi-FI', {
      hour: 'numeric',
      minute: 'numeric',
    })
    const endTime = event.end.toLocaleTimeString('fi-FI', {
      hour: 'numeric',
      minute: 'numeric',
    })
    const information = new Parser().parse(event.information)

    let popoverContentClassName // Style: Normal
    if (event.activities.length === 0) {
      popoverContentClassName = classes.emptyEventCard // Style: No activities
    }
    if (event.synced) {
      popoverContentClassName = classes.kuksaSyncedEventCard // Style: Synced to Kuksa
    }
    if (event.kuksaEvent) {
      popoverContentClassName = classes.kuksaEventCard // Style: Kuksa event
    }

    const activities = (
      <div>
        <Activities
          activities={event.activities}
          bufferzone={false}
          parentId={event.id}
          className={classes.calendarEventActivityWrapper}
        />
      </div>
    )

    const editDeleteButtons = (
      <div>
        <div className={classes.calendarEventButtonWrapper}>
          <EditEvent
            buttonClass="calendar-button"
            data={event.originalData}
            setNotification={this.props.setNotification}
            minimal="true"
          />
          <DeleteEvent
            buttonClass="calendar-button"
            data={event.originalData}
            setNotification={this.props.setNotification}
            minimal="true"
          />
        </div>
      </div>
    )

    const popoverContent = (
      <div>
        <div>
          <div className={classes.calendarPopoverLeft}>
            <p className={classes.calendarEventTitle}>{event.title}</p>
          </div>
          <div className={classes.calendarPopoverRight}>
            <IconButton onClick={this.closePopper}>
              <Icon>close</Icon>
            </IconButton>
          </div>
        </div>
        {startTime} - {endTime}
        <p>{information}</p>
        {!event.kuksaEvent && activities}
        {!event.kuksaEvent && editDeleteButtons}
        {event.kuksaEvent && <AddToPlan event={event.originalData} />}
      </div>
    )

    // Don't allow dragging activities to kuksa events
    const paperContent = event.kuksaEvent ? (
      <div className={classes.calendarEventPopper}>
        {popoverContent}
        <br />
      </div>
    ) : (
      <ActivityDragAndDropTarget
        bufferzone={false}
        parentId={event.id}
        className={classes.calendarEventPopper}
      >
        {popoverContent}
      </ActivityDragAndDropTarget>
    )

    return (
      <div>
        <div aria-describedby={id} onClick={this.handleClick}>
          <span>{event.title}</span>
          <br />
          {this.createActivityMarkers(event.activities)}
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

CalendarEvent.propTypes = {
  ...PropTypesSchema,
}

CalendarEvent.defaultProps = {}

const mapStateToProps = state => ({
  pofTree: state.pofTree,
  popperOpen: state.calendar.popperOpen,
  popperEventId: state.calendar.popperEventId,
})

export default connect(
  mapStateToProps,
  {
    openPopper,
    closePopper,
  }
)(withStyles(styles)(CalendarEvent))
