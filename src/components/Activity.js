import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'

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

function collect(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    // connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Activity extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
  }

  state = { open: false }

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
    const chipClass =
      `${pofActivity.mandatory ? '' : 'non-' 
      }mandatory-chip${ 
      this.props.minimal ? '-minimal' : ''}`
    const avatarClass =
      `${pofActivity.mandatory ? '' : 'non-' 
      }mandatory-chip-avatar${ 
      this.props.minimal ? '-minimal' : ''}`

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
            <PlanForm activity={pofActivity} savedActivity={activity} parentId={parentId} />
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

export default connect(
  mapStateToProps,
  {
    deleteActivityFromEvent,
    deleteActivityFromBuffer,
    notify,
    pofTreeUpdate,
  }
)(DraggableActivity)
