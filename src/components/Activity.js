import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import Dialog from 'material-ui/Dialog'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import { blue200, blue500, indigo900 } from 'material-ui/styles/colors'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import ActivityPreview from './ActivityPreview'
import FlatButton from 'material-ui/FlatButton';

const styles = {
  chip: {
    margin: 4,
    // float: 'left',
    // display: 'inline-block',
    backgroundColor: blue200,
    cursor: 'move'
  },
  avatar: {
    size: 28,
    color: indigo900,
    backgroundColor: blue200,
    margin: 4
  },
  chipMandatory: {
    margin: 4,
    // display: 'inline-block',
    // float: 'left',
    width: '100%',
    backgroundColor: blue500,
    cursor: 'move'
  },
  avatarMandatory: {
    size: 28,
    color: indigo900,
    backgroundColor: blue500,
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
    /*const closeImg = {
      cursor: 'pointer',
      float: 'right',
      marginTop: '5px',
      width: '20px'
    }*/

    if (activity && pofActivity) {
      if (!isDragging) {
        return connectDragSource(
          <div
            style={{
              float: 'left',
              margin: 4,
              // display: 'inline-block',
              visibility: { visibility }
            }}
          >
            <Chip
              onRequestDelete={() => this.props.deleteActivity(activity)}
              style={pofActivity.mandatory ? styles.chipMandatory : styles.chip}
              key={activity.id}
              onClick={this.handleClick}
            >
              <Avatar
                style={
                  pofActivity.mandatory ? styles.avatarMandatory : styles.avatar
                }
              >
                <img
                  style={{ width: '100%' }}
                  src={pofActivity.mandatoryIconUrl}
                  alt="Mandatory Icon"
                />
              </Avatar>
              <span className="activityTitle">{pofActivity.title}</span>
              <Dialog
                title={
                  <div>
                    {pofActivity.title}
                    <FlatButton
                      style={{ float: 'right' }}
                      label="Close"
                      primary={true}
                      onClick={this.handleClick}
                    />
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
                <PlanForm activity={pofActivity} savedActivity={activity} />
              </Dialog>
            </Chip>
          </div>
        )
      }

      if (isDragging) {
        return connectDragSource(
          <div>
            <ActivityPreview pofActivity={pofActivity} mandatory={pofActivity.mandatory} />
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
