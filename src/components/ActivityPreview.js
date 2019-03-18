import React from 'react'
import DragLayer from 'react-dnd/lib/DragLayer'
import Chip from '@material-ui/core/Chip/Chip'
import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'

const styles = {
  chip: {
    margin: 4,
    backgroundColor: '#90CAF9',
  },
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

export class ActivityPreview extends React.Component {
  render() {
    const { isDragging, currentOffset, startPoint, pofActivity } = this.props
    if (!isDragging) {
      return ''
    }
    const img = pofActivity.mandatoryIconUrl
    /* if (pofActivity.mandatory) {
      img = 'https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3538.png'
    } else {
      img = 'https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3562.png'
    } */
    return (
      <Chip
        style={getItemStyles(currentOffset, startPoint, pofActivity.mandatory)}
        className="previewChip"
        label={<span className="activityTitle">{pofActivity.title}</span>}
        avatar={
          <Avatar
            style={
              pofActivity.mandatory ? styles.avatarMandatory : styles.avatar
            }
          >
            src={img}
          </Avatar>
        }
      />
    )
  }
}

ActivityPreview.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  currentOffset: PropTypes.number.isRequired,
  startPoint: PropTypes.number.isRequired,
  pofActivity: PropTypes.shape({}).isRequired,
}

export default DragLayer(collect)(ActivityPreview)
