import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import activityService from '../services/activities';

const styles = {
  chip: {
    margin: 4,
    float: 'left'
  }
};
const handleRequestDelete = async (activity, props) => {
  console.log('Delete activity', activity);
  try {
    await activityService.deleteActivity(activity.id);
    props.updateAfterDelete(activity);
    props.updateFilteredActivities()

  } catch (exception) {
    console.error('Error in deleting activity:', exception);
  }
};

const Activity = props => {
  if (props.eventActivities && props.dataSource !== undefined && props.eventActivities.length !== 0) {
    console.log('eventacts', props.eventActivities)
    const rows = props.eventActivities.map(activity => {
      const act = props.dataSource.filter(a => a.guid === activity.guid);

      return (
        <Chip
          backgroundColor={blue300}
          onRequestDelete={() => handleRequestDelete(activity, props)}
          style={styles.chip}
          key={activity.id}
        >
          <Avatar size={32} color={blue300} backgroundColor={indigo900}>
            P
          </Avatar>
          <span className="activityTitle">{act[0].title}</span>
        </Chip>
      );
    });

    return rows;
  }
  return <p>paskaa</p>;
};

export default Activity;
