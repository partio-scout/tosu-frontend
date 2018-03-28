
import React from 'react';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import Chip from 'material-ui/Chip/Chip';
import { blue300, indigo900, red300, red900, green300 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import isTouchDevice from 'is-touch-device'

const styles = {
  chip: {
    margin: 4,
    backgroundColor: blue300
  },
  avatar: {
    size: 28,
    color: indigo900,
    backgroundColor: blue300,
    margin: 4
  },
  chipMandatory: {
    margin: 4,
    backgroundColor: green300,
  },
  avatarMandatory: {
    size: 28,
    color: red900,
    backgroundColor: green300,
    margin: 4
  }
};

function collect(monitor) {
  return {
    currentOffset: monitor.getClientOffset(),
    startPoint: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging()
  };
}

function getItemStyles(currentOffset, startPoint, mandatory) {
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }
  let { x, y } = currentOffset;
  if (isTouchDevice) {
    x -= startPoint.x
    y -= startPoint.y
  }
  const transform = `translate(${x}px, ${y}px)`;
  const color = mandatory ? green300 : blue300
  return {
    pointerEvents: 'none',
    transform,
    WebkitTransform: transform,
    margin: 4,
    backgroundColor: color
  };
}



class ActivityPreview extends React.Component {
  render() {
    const { isDragging, mandatory, currentOffset, startPoint, act } = this.props
    if (!isDragging) {
      return '';
    }
    let img
    if (mandatory) {
      img = "https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3538.png"
    } else {
      img = "https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3562.png"
    }
    return (
      <div>
        <Chip
          style={getItemStyles(currentOffset, startPoint, mandatory)}
          className='previewChip'
          onRequestDelete={() => console.log('')}
        >
          <Avatar style={mandatory ? styles.avatarMandatory : styles.avatar}>
            <img
              style={{ width: '100%' }}
              src={img}
              alt="Mandatory activity"
            />
          </Avatar>
          <span className="activityTitle">{act.title}</span>
        </Chip>
      </div>
    );
  }
}



export default DragLayer(collect)(ActivityPreview);