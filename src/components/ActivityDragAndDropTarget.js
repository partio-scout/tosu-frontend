import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from '../ItemTypes'
import DropActivity from '../functions/DropActivity'
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
import { updateActivity } from '../reducers/activityReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import PropTypesSchema from '../utils/PropTypesSchema'
import { withStyles } from '@material-ui/core'

const styles = {
  pattern: {
    background:
      'radial-gradient(#6eff3f 15%, transparent 16%) 0 0, radial-gradient(#6eff3f 15%, transparent 16%) 8px 8px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px',
    backgroundColor: 'white',
    backgroundSize: '16px 16px',
  },
}

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

function ActivityDragAndDropTarget(props) {
  const { isOver, canDrop, connectDropTarget, odd, event, classes } = props
  const baseColor = event ? (odd ? '#EFEEEE' : '#D6E8F7') : '#FFF'
  const background = { backgroundColor: canDrop ? '#C8E6C9' : baseColor }
  const className =
    (props.className || '') + ' ' + (isOver ? classes.pattern : '')

  return connectDropTarget(
    <div style={background} className={className}>
      {props.children}
    </div>
  )
}

const DroppableActivityDragAndDropTarget = DropTarget(
  ItemTypes.ACTIVITY,
  DropActivity,
  collect
)(ActivityDragAndDropTarget)

const mapStateToProps = state => ({
  buffer: state.buffer,
  events: state.events,
  activities: state.activities,
})

const mapDispatchToProps = {
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  postActivityToBufferOnlyLocally,
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivityFromEvent,
  updateActivity,
}

ActivityDragAndDropTarget.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.shape({}).isRequired,
  deleteActivityFromEventOnlyLocally: PropTypes.func.isRequired,
  addActivityToEventOnlyLocally: PropTypes.func.isRequired,
  deleteActivityFromBufferOnlyLocally: PropTypes.func.isRequired,
  postActivityToBufferOnlyLocally: PropTypes.func.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  deleteActivityFromEvent: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  odd: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  event: PropTypesSchema.eventShape.isRequired,
  className: PropTypes.string.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
}

ActivityDragAndDropTarget.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DroppableActivityDragAndDropTarget))
