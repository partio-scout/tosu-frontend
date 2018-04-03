import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import {
  blue300,
  green300,
  indigo900,
  green900
} from 'material-ui/styles/colors'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import ActivityPreview from './ActivityPreview'

const styles = {
  chip: {
    margin: 4,
    // float: 'left',
    // display: 'inline-block',
    backgroundColor: blue300,
    cursor: 'move',
  },
  avatar: {
    size: 28,
    color: indigo900,
    backgroundColor: blue300,
    margin: 4,
  },
  chipMandatory: {
    margin: 4,
    // display: 'inline-block',
    // float: 'left',
    backgroundColor: green300,
    cursor: 'move',
  },
  avatarMandatory: {
    size: 28,
    color: green900,
    backgroundColor: green300,
    margin: 4
  }
}

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

const handleRequestDelete = async (activity, props) => {
  try {
    if (
      props.buffer.activities.find(
        a => a.id.toString() === activity.id.toString()
      ) !== undefined
    ) {
      props.deleteActivityFromBuffer(activity.id)
      props.notify('Aktiviteetti poistettu!', 'success')
    } else {
      props.deleteActivityFromEvent(activity.id)
      props.notify('Aktiviteetti poistettu!', 'success')
    }
  } catch (exception) {
    props.notify('Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!')
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
    const { activity, act, connectDragSource, isDragging } = this.props
    const visibility = isDragging ? 'hidden' : 'visible'
    const closeImg = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '5px',
      width: '20px'
    }

    if (activity && act[0]) {
      if (act[0].mandatory && !isDragging) {
        return connectDragSource(
          <div
            style={{
              float: 'left',
              // display: 'inline-block',
              visibility: { visibility }
            }}
          >
            <Chip
              onRequestDelete={() => handleRequestDelete(activity, this.props)}
              style={styles.chipMandatory}
              key={activity.id}
              onClick={this.handleClick}
            >
              <Avatar style={styles.avatarMandatory}>
                <img
                  style={{ width: '100%' }}
                  src={act[0].mandatoryIconUrl}
                  alt="Mandatory activity"
                />
              </Avatar>
              <span className="activityTitle">{act[0].title}</span>
              <Dialog
                title={
                  <div>
                    {act[0].title}
                    <button
                      style={closeImg}
                      className="dialog-close-button"
                      onClick={this.handleClick}
                    >
                      x
                    </button>
                  </div>
                }
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClick}
                autoScrollBodyContent
                bodyClassName="global--modal-body"
                contentClassName="global--modal-content"
                paperClassName="global--modal-paper"
              >
                <PlanForm activity={act[0]} savedActivity={activity} />
              </Dialog>
            </Chip>
          </div>
        )
      } else if (!isDragging) {
        return connectDragSource(
          <div
            style={{
              float: 'left',
              // display: 'inline-block',
              visibility: { visibility }
            }}
          >
            <Chip
              onRequestDelete={() => handleRequestDelete(activity, this.props)}
              style={styles.chip}
              key={activity.id}
              onClick={this.handleClick}
            >
              <Avatar style={styles.avatar}>
                <img
                  style={{ width: '100%' }}
                  src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3562.png"
                  alt="Not-mandatory activity"
                />
              </Avatar>
              <span className="activityTitle">{act[0].title}</span>
              <Dialog
                title={
                  <div>
                    {act[0].title}
                    <button
                      style={closeImg}
                      className="dialog-close-button"
                      onClick={this.handleClick}
                    >
                      x
                    </button>
                  </div>
                }
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClick}
                autoScrollBodyContent
                bodyClassName="global--modal-body"
                contentClassName="global--modal-content"
                paperClassName="global--modal-paper"
              >
                <PlanForm activity={act[0]} savedActivity={activity} />
              </Dialog>
            </Chip>
          </div>
        )
      }
      if (act[0].mandatory && isDragging) {
        return connectDragSource(
          <div>
            <ActivityPreview act={act[0]} mandatory />
          </div>
        )
      } else if (isDragging) {
        return connectDragSource(
          <div>
            <ActivityPreview act={act[0]} mandatory={false} />
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

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer
  }
}
export default connect(mapStateToProps, {
  deleteActivityFromEvent,
  deleteActivityFromBuffer,
  notify
})(DraggableActivity)
