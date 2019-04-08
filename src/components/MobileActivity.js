import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import { DragSource } from 'react-dnd'
import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { notify } from '../reducers/notificationReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import PlanForm from './PlanForm'
import ActivityPreview from './ActivityPreview'
import PropTypesSchema from './PropTypesSchema'
import { withStyles } from '@material-ui/core'
import { blue, indigo } from '@material-ui/core/colors'

const styles = {
  chip: {
    margin: 4,
    backgroundColor: blue[200],
    cursor: 'move',
  },
  avatar: {
    size: 28,
    color: indigo[900],
    backgroundColor: blue[200],
    margin: 4,
  },
  chipMandatory: {
    margin: 4,
    width: '100%',
    backgroundColor: blue[500],
    cursor: 'move',
  },
  avatarMandatory: {
    size: 28,
    color: indigo[900],
    backgroundColor: blue[500],
    margin: 4,
  },
  activityTitle: {
    display: 'block',
    maxWidth: 175,
    wordWrap: 'break-all',
    whiteSpace: 'normal',
    fontWeight: 'bold',
    lineHeight: 26,
    padding: 3,
  },
  connectDragSource: {
    float: 'left',
    margin: 4,
  },
}

const activitySource = {
  /**
   * Begins dragging of element
   * @param connector  allows user to assign one of the predefined roles (a drag source, a drag preview, or a drop target) to the DOM nodes in the render function. Imported from react-dnd
   * @param monitor allows user to update the props of the components in response to the drag and drop state changes. Imported from react-dnd
   */
  beginDrag(props, monitor) {
    return {
      id: props.activity.id,
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
}
/** Collects the element to be dragged
 * @param connector  allows user to assign one of the predefined roles (a drag source, a drag preview, or a drop target) to the DOM nodes in the render function. Imported from react-dnd
 * @param monitor allows user to update the props of the components in response to the drag and drop state changes. Imported from react-dnd
 */
function collect(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Activity extends React.Component {
  state = { open: false }

  componentDidMount() {
    if (this.props.connectDragPreview) {
      this.props.connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      })
    }
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const {
      activity,
      pofActivity,
      connectDragSource,
      isDragging,
      classes,
    } = this.props
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
            style={{
              visibility: { visibility },
            }}
            className={classes.connectDragSource}
          >
            <Chip
              onRequestDelete={() => this.props.deleteActivity(activity)}
              style={
                pofActivity.mandatory ? classes.chipMandatory : classes.chip
              }
              key={activity.id}
              onClick={this.handleClick}
            >
              <Avatar
                style={
                  pofActivity.mandatory
                    ? classes.avatarMandatory
                    : classes.avatar
                }
              >
                <img
                  style={{ width: '100%' }}
                  src={pofActivity.mandatoryIconUrl}
                  alt="Mandatory Icon"
                />
              </Avatar>
              <span className={classes.activityTitle}>{pofActivity.title}</span>
              <Dialog
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

Activity.propTypes = {
  ...PropTypesSchema,
}

Activity.defaultProps = {}

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
  }
)(withStyles(styles)(DraggableActivity))
