import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import PropTypesSchema from '../utils/PropTypesSchema'
import { withStyles } from '@material-ui/core'

const styles = {
  connectDragSource: {
    float: 'left',
    margin: 4,
  },
  connectDragSourceMinimal: {
    float: 'left',
    margin: 1,
  },
  dialogCloseButton: {
    backgroundColor: '#ccc',
    color: '#fff',
    float: 'right',
    fontSize: '1.2rem',
    lineHeight: '1.2rem',
    borderRadius: '100%',
    boxShadow: '1px 1px 3px',
  },
  mandatory: {
    cursor: 'pointer',
    backgroundColor: '#97bcd7 !important',
  },
  nonMandatory: {
    cursor: 'pointer',
    backgroundColor: '#aed3eb !important',
  },
  avatar: {
    height: 26,
    width: 26,
    marginLeft: 3,
    color: '#1a237e',
  },
  minimalAvatar: {
    height: 20,
    width: 20,
    marginLeft: 3,
    color: '#1a237e',
  },
}

/**
 * Methods that handle the dragging of an activity
 */
const activitySource = {
  beginDrag(props, monitor) {
    return {
      activity: { ...props.activity, canDrag: false },
      parentId: props.parentId,
      bufferzone: props.bufferzone,
      startPoint: monitor.getDifferenceFromInitialOffset(),
      item: monitor.getItem(),
    }
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      // return
    }
  },
  canDrag(props, monitor) {
    if (props.activity.canDrag !== undefined) {
      if (!props.activity.canDrag) {
        return false
      }
    }
    return true
  },
}
/**
 * Collects the draggable element
 * @param connector  allows user to assign one of the predefined roles (a drag source, a drag preview, or a drop target) to the DOM nodes in the render function. Imported from react-dnd
 * @param monitor allows user to update the props of the components in response to the drag and drop state changes. Imported from react-dnd
 */
function collect(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    // connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Activity extends Component {
  state = { open: false }

  /**
   *  Opens the activity
   */
  handleClick = () => this.setState({ open: !this.state.open })

  render() {
    const {
      activity,
      pofActivity,
      connectDragSource,
      parentId,
      classes,
    } = this.props

    if (activity && pofActivity) {
      return connectDragSource(
        <div
          className={
            this.props.minimal
              ? classes.connectDragSourceMinimal
              : classes.connectDragSource
          }
        >
          <Chip
            onDelete={() => this.props.deleteActivity(activity)}
            className={
              pofActivity.mandatory ? classes.mandatory : classes.nonMandatory
            }
            key={activity.id}
            onClick={this.handleClick}
            deleteIcon={<Icon color="primary">clear</Icon>}
            style={this.props.minimal ? { height: 26 } : {}}
            avatar={
              pofActivity.mandatory ? (
                <Avatar
                  src={pofActivity.mandatoryIconUrl}
                  className={
                    this.props.minimal ? classes.minimalAvatar : classes.avatar
                  }
                />
              ) : null
            }
            label={pofActivity.title}
          />
          <Dialog open={this.state.open} onClose={this.handleClick}>
            <PlanForm
              activity={pofActivity}
              savedActivity={activity}
              parentId={parentId}
            />
          </Dialog>
        </div>
      )
    }
    return ''
  }
}

const DraggableActivity = DragSource(
  ItemTypes.ACTIVITY,
  activitySource,
  collect
)(Activity)

const mapStateToProps = state => ({
  notification: state.notification,
  buffer: state.buffer,
  events: state.events,
})

Activity.propTypes = {
  notify: PropTypes.func.isRequired,
  notification: PropTypes.string.isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.shape({}).isRequired,
  connectDragSource: PropTypes.func.isRequired,
  activity: PropTypes.shape({}).isRequired,
  pofActivity: PropTypes.shape({}).isRequired,
  parentId: PropTypes.number.isRequired,
  minimal: PropTypes.bool.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  deleteActivityFromEvent: PropTypes.func.isRequired,
  deleteActivityFromActivity: PropTypes.func.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
}

Activity.defaultProps = {}

export default connect(
  mapStateToProps,
  {
    deleteActivityFromEvent,
    deleteActivityFromBuffer,
    notify,
  }
)(withStyles(styles)(DraggableActivity))
