import React from 'react'
import DragLayer from 'react-dnd/lib/DragLayer'
import { withStyles } from '@material-ui/core'
import { Avatar, Chip } from '@material-ui/core'
import PropTypes from 'prop-types'

const styles = {
  avatar: {
    size: 28,
    color: '#1A237E',
    backgroundColor: '#90CAF9',
    margin: 4,
  },
  chipMandatory: {
    margin: 4,
    backgroundColor: '#2196F3',
  },
  avatarMandatory: {
    size: 28,
    color: '#1A237E',
    backgroundColor: '#2196F3',
    margin: 4,
  },
  activityTitle: {
    display: 'block',
    maxWidth: 175,
    wordWrap: 'break-all',
    whiteSpace: 'normal',
    fontWeight: 'bold',
    lineHeight: '26px',
    padding: 3,
  },
  previewChip: {
    zIndex: 999,
    opacity: 0.99,
  },
}

/**
 * Collects the draggable element
 * @param monitor allows user to update the props of the components in response to the drag and drop state changes. Imported from react-dnd
 * @returns current configuration
 */
function collect(monitor) {
  return {
    currentOffset: monitor.getClientOffset(),
    startPoint: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging(),
  }
}
/**
 * Determines styles used to render the object
 * @param {number} currentOffset determines where the element is rendered together with startPoint
 * @param {number} startPoint determines where the element is rendered together with currentOffset
 * @param {boolean} mandatory changes the color of the element whether it is marked as mandatory or not.
 * @returns current style
 */
function getItemStyles(currentOffset, startPoint, mandatory) {
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  x -= startPoint.x
  y -= startPoint.y
  const transform = `translate(${x}px, ${y}px)`
  const color = mandatory ? '#90CAF9' : '#2196F3'
  return {
    pointerEvents: 'none',
    transform,
    WebkitTransform: transform,
    margin: 4,
    backgroundColor: color,
  }
}

function ActivityPreview(props) {
  const { isDragging, currentOffset, startPoint, pofActivity, classes } = props
  if (!isDragging) {
    return ''
  }
  const img = pofActivity.mandatoryIconUrl
  return (
    <Chip
      style={getItemStyles(currentOffset, startPoint, pofActivity.mandatory)}
      className={classes.previewChip}
      label={<span className={classes.activityTitle}>{pofActivity.title}</span>}
      avatar={
        <Avatar
          style={
            pofActivity.mandatory ? classes.avatarMandatory : classes.avatar
          }
        >
          src={img}
        </Avatar>
      }
    />
  )
}

ActivityPreview.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  currentOffset: PropTypes.number.isRequired,
  startPoint: PropTypes.number.isRequired,
  pofActivity: PropTypes.shape({}).isRequired,
}

ActivityPreview.defaultProps = {}

export default DragLayer(collect)(withStyles(styles)(ActivityPreview))
