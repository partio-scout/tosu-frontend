import { connect } from 'react-redux'
import React from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import ItemTypes from '../ItemTypes'
import DropActivity from '../functions/DropActivity'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  postActivityToBufferOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  deleteActivityFromBuffer,
} from '../reducers/bufferZoneReducer'
import {
  deleteActivityFromEvent,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
} from '../reducers/eventReducer'

function collect(connector, monitor) {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    target: monitor.getItem(),
  }
}

class ActivityDragAndDropTarget extends React.Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,

    // these props are used in DropActivity.js
    // (yes, very confusing)
    // TODO: find a better solution
    bufferzone: PropTypes.bool.isRequired,
    parentId: PropTypes.number.isRequired,

    notify: PropTypes.func.isRequired,
    deleteActivityFromEventOnlyLocally: PropTypes.func.isRequired,
    addActivityToEventOnlyLocally: PropTypes.func.isRequired,
    deleteActivityFromBufferOnlyLocally: PropTypes.func.isRequired,
    postActivityToBufferOnlyLocally: PropTypes.func.isRequired,
    pofTreeUpdate: PropTypes.func.isRequired,
    deleteActivityFromBuffer: PropTypes.func.isRequired,
    deleteActivityFromEvent: PropTypes.func.isRequired,
  }

  render() {
    const { isOver, canDrop, connectDropTarget, odd, event } = this.props
    const baseColor = event ? (odd ? '#EFEEEE' : '#D6E8F7') : '#FFF'
    const background = { backgroundColor: canDrop ? '#C8E6C9' : baseColor }
    const className = (this.props.className || '') + (isOver ? ' pattern' : '')

    return connectDropTarget(
      <div style={background} className={className}>
        {this.props.children}
      </div>
    )
  }
}

const DroppableActivityDragAndDropTarget = DropTarget(
  ItemTypes.ACTIVITY,
  DropActivity,
  collect
)(ActivityDragAndDropTarget)

const mapStateToProps = state => ({
    buffer: state.buffer,
    events: state.events,
  })

export default connect(
  mapStateToProps,
  {
    notify,
    deleteActivityFromEventOnlyLocally,
    addActivityToEventOnlyLocally,
    deleteActivityFromBufferOnlyLocally,
    postActivityToBufferOnlyLocally,
    pofTreeUpdate,
    deleteActivityFromBuffer,
    deleteActivityFromEvent,
  }
)(DroppableActivityDragAndDropTarget)
