import { connect } from 'react-redux'
import React from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import ItemTypes from '../ItemTypes'
import DropActivity from '../functions/DropActivity'
import { notify } from '../reducers/notificationReducer'
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
/**
 * Collects an element and allows it to be dropped to a container.
 * @param connector  allows user to assign one of the predefined roles (a drag source, a drag preview, or a drop target) to the DOM nodes in the render function. Imported from react-dnd
 * @param monitor allows user to update the props of the components in response to the drag and drop state changes. Imported from react-dnd
 * @returns state of dragging
 */
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
    odd: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    event: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    deleteActivityFromBuffer,
    deleteActivityFromEvent,
  }
)(DroppableActivityDragAndDropTarget)
