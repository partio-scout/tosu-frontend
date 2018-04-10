
import React from 'react';
//import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import Chip from 'material-ui/Chip/Chip';
import { blue200, indigo900, blue500 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import isTouchDevice from 'is-touch-device'

const styles = {
  chip: {
    margin: 4,
    backgroundColor: blue200
  },
  avatar: {
    size: 28,
    color: indigo900,
    backgroundColor: blue200,
    margin: 4
  },
  chipMandatory: {
    margin: 4,
    backgroundColor: blue500,
  },
  avatarMandatory: {
    size: 28,
    color: indigo900,
    backgroundColor: blue500,
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
  x -= startPoint.x
  y -= startPoint.y
  const transform = `translate(${x}px, ${y}px)`;
  const color = mandatory ? blue500 : blue200
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
    const { isDragging, mandatory, currentOffset, startPoint, pofActivity } = this.props
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
          <span className="activityTitle">{pofActivity.title}</span>
        </Chip>
      </div>
    );
  }
}



export default DragLayer(collect)(ActivityPreview);