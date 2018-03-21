
import React from 'react';
import PropTypes from 'prop-types';
import DragLayer from 'react-dnd/lib/DragLayer';
import Chip from 'material-ui/Chip/Chip';
import { blue300, indigo900, red300, red900 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';

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
    backgroundColor: red300,
  },
  avatarMandatory: {
    size: 28,
    color: red900,
    backgroundColor: red300,
    margin: 4
  }
};

function collect(monitor) {
  const item = monitor.getItem();
  return {
    id: item && item.id,
    name: item && item.name,
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

function getItemStyles(currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    pointerEvents: 'none',
    transform,
    WebkitTransform: transform,
    margin: 4,
    backgroundColor: blue300,
  };
}



function ItemPreview({
  id,
  isDragging,
  currentOffset
}) {
  if (!isDragging) {
    return 'mitä vittua';
  }

  return (
    <div
      className="item preview"
    >
      <Chip
        style={getItemStyles(currentOffset)}
      >
        <Avatar style={styles.avatarMandatory}>
          <img
            style={{ width: '100%' }}
            src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3538.png"
            alt="Mandatory activity"
          />
        </Avatar>
        <span className="activityTitle">heees</span>
      </Chip>
    </div>
  );
}

ItemPreview.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  isDragging: PropTypes.bool.isRequired
};

export default DragLayer(collect)(ItemPreview);