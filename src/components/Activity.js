import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import activityService from '../services/activities';

const styles = {
  chip: {
    margin: 4
  }
};
const handleRequestDelete = async (activity, props) => {
  console.log('Delete activity', activity);
  try {
    await activityService.deleteActivity(activity.id);
    props.updateAfterDelete(activity);
  } catch (exception) {
    console.error('Error in deleting activity:', exception);
  }
};

const Activity = props => {
  if (props.dataSource !== undefined && props.eventActivities.length !== 0) {
    const rows = props.eventActivities.map(activity => {
      // VÄLIAIKAINEN KORJAUS, KUNNES BACKEND EI PALAUTA VIRHEELLISTÄ JSONIA
      let act;
      if (activity.guid) {
        act = props.dataSource.filter(a => a.guid === activity.guid);
      } else {
        act = props.dataSource.filter(a => a.guid === activity.information);
      }
      // VÄLIAIKAINEN KORJAUS ^^^^

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
  return <p>Ei aktiviteetteja valittuna</p>;
};

export default Activity;
