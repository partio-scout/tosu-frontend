import React from 'react'
import DragLayer from 'react-dnd/lib/DragLayer'
import Chip from '@material-ui/core/Chip/Chip'
import Avatar from '@material-ui/core/Avatar'

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

function collect(monitor) {
  return {
    currentOffset: monitor.getClientOffset(),
    startPoint: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

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

class ActivityPreview extends React.Component {
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

export default DragLayer(collect)(ActivityPreview)
