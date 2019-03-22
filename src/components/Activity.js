import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import PropTypesSchema from './PropTypesSchema'

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
  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { activity, pofActivity, connectDragSource, parentId } = this.props
    let lastGuid = 0
    if (pofActivity) {
      const lastParentIndex = pofActivity.parents.length - 1
      lastGuid = pofActivity.parents[lastParentIndex].guid
    }
    const chipClass = `${pofActivity.mandatory ? '' : 'non-'}mandatory-chip${
      this.props.minimal ? '-minimal' : ''
    }`
    const avatarClass = `${
      pofActivity.mandatory ? '' : 'non-'
    }mandatory-chip-avatar${this.props.minimal ? '-minimal' : ''}`

    if (activity && pofActivity) {
      return connectDragSource(
        <div
          className={
            this.props.minimal
              ? 'connect-drag-source-minimal'
              : 'connect-drag-source'
          }
          style={{ visibility: 'visible' }}
        >
          <Chip
            onDelete={() => this.props.deleteActivity(activity)}
            className={chipClass}
            key={activity.id}
            onClick={this.handleClick}
            deleteIcon={<Icon color="primary">clear</Icon>}
            style={this.props.minimal ? { height: '25px' } : {}}
            avatar={
              <Avatar
                alt="Mandatory Icon"
                src={pofActivity.mandatoryIconUrl}
                className={avatarClass}
                style={this.props.minimal ? { height: '25px' } : {}}
              />
            }
            label={pofActivity.title}
          />
          <Dialog
            title={
              <div>
                {pofActivity.title}

                <button
                  className="dialog-close-button"
                  onClick={this.handleClick}
                >
                  x
                </button>

                <br />

                {pofActivity.parents.map(parent => (
                  <span style={{ fontSize: '0.9rem' }} key={parent.guid}>
                    {parent.title} {parent.guid === lastGuid ? null : ' - '}
                  </span>
                ))}
              </div>
            }
            open={this.state.open}
            onClose={this.handleClick}
          >
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

const mapDispatchToProps = {
  deleteActivityFromEvent,
  deleteActivityFromBuffer,
  notify,
  pofTreeUpdate,
}

Activity.propTypes = {
  ...PropTypesSchema,
}

Activity.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableActivity)
