import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import activityService from '../services/activities';

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
  console.log('Delete activity', activity);
  try {
    await activityService.deleteActivity(activity.id);
    props.delete(activity)

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
        <div></div>
      );
    

    
  
  
};

export default Activity;
