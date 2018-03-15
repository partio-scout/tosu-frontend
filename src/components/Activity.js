import { DragSource } from 'react-dnd'
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import activityService from '../services/activities';
import ItemTypes from '../ItemTypes'

const styles = {
  chip: {
    margin: 4,
    float: 'left',
    backgroundColor: blue300,
    cursor: 'move',
  },
  avatar: {
    size: 28,
    color: blue300,
    backgroundColor: indigo900,
    margin: 4
  }
};

const activitySource = {
  beginDrag() {
    return {}
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const handleRequestDelete = async (activity, props) => {
  try {
    await activityService.deleteActivity(activity.id);
    props.delete(activity)

  } catch (exception) {
    console.error('Error in deleting activity:', exception);
  }
};

class Activity extends React.Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  }
  /* constructor(props) {
    super(props);
    this.state = {
      selectedActivity: null
    };
  } */

  render() {
    const { activity, act } = this.props
    const { connectDragSource, isDragging } = this.props
    if (activity && act[0]) {
      return connectDragSource(
        <div>
          <Chip
            onRequestDelete={() => handleRequestDelete(activity, this.props)}
            style={styles.chip}
            key={activity.id}
          >
            <Avatar
              style={styles.avatar}
            >
              !
          </Avatar>
            <span className="activityTitle">{act[0].title}</span>
          </Chip>
        </div>
      );

    }
    return (
      <div />
    );
  }

}
export default DragSource(ItemTypes.ACTIVITY, activitySource, collect)(Activity)

