import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Dialog from '@material-ui/core/Dialog'
import Chip from '@material-ui/core/Chip'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import ActivityPreview from './ActivityPreview'

const activitySource = {
  beginDrag(props, monitor) {
    return {
      id: props.activity.id,
      parentId: props.parentId,
      bufferzone: props.bufferzone,
      startPoint: monitor.getDifferenceFromInitialOffset(),
      item: monitor.getItem()
    }
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      // return
    }
  }
}

function collect(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class Activity extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }
  componentDidMount() {
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), {
        captureDraggingState: true
      })
    }
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { activity, pofActivity, connectDragSource, isDragging } = this.props
    const visibility = isDragging ? 'hidden' : 'visible'

    let lastGuid = 0
    if (pofActivity) {
      const lastParentIndex = pofActivity.parents.length - 1
      lastGuid = pofActivity.parents[lastParentIndex].guid
    }

    if (activity && pofActivity) {
      if (!isDragging) {
        return connectDragSource(
          <div
            className='connect-drag-source'
            style={{
              visibility: { visibility }
            }}
          >

            <Chip
              onDelete={() => this.props.deleteActivity(activity)}
              className={
                pofActivity.mandatory ? 'mandatory-chip' : 'non-mandatory-chip'
              }
              key={activity.id}
              onClick={this.handleClick}
              avatar={
                <Avatar
                  alt='Mandatory Icon'
                  src={pofActivity.mandatoryIconUrl}
                  className={
                    pofActivity.mandatory
                      ? 'mandatory-chip-avatar'
                      : 'non-mandatory-chip-avatar'
                  }
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
              <PlanForm activity={pofActivity} savedActivity={activity} />
            </Dialog>
          </div>
        )
      }

      if (isDragging) {
        return connectDragSource(
          <div>
            <ActivityPreview
              pofActivity={pofActivity}
              mandatory={pofActivity.mandatory}
            />
          </div>
        )
      }
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
  events: state.events
})

export default connect(mapStateToProps, {
  deleteActivityFromEvent,
  deleteActivityFromBuffer,
  notify,
  pofTreeUpdate
})(DraggableActivity)
