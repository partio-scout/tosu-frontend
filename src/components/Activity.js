import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip'
import { blue300, indigo900 } from 'material-ui/styles/colors'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { connect } from 'react-redux'

const styles = {
  chip: {
    margin: 4,
    float: 'left',
    backgroundColor: blue300
  },
  avatar: {
    size: 28,
    color: blue300,
    backgroundColor: indigo900,
    margin: 4
  }
};
const handleRequestDelete = async (activity, props) => {
  try {
    if (props.buffer.activities.find(a => a.id.toString() === activity.id.toString()) !== undefined) {
      props.deleteActivityFromBuffer(activity.id)
      
    } else {
      props.deleteActivityFromEvent(activity.id)
    }

  } catch (exception) {
    console.error('Error in deleting activity:', exception);
  }
};

const Activity = props => {
  const { activity, act } = props
  if (activity && act[0]) {
    return (
      <Chip
        onRequestDelete={() => handleRequestDelete(activity, props)}
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
    );

  }
  return (
    <div />
  );





};

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer
  }
}
export default connect(
  mapStateToProps,
  { deleteActivityFromEvent, deleteActivityFromBuffer }

)(Activity)