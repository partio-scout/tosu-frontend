import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import { API_ROOT } from '../api-config';

const styles = {
  chip: {
    margin: 4
  }
};
const handleRequestDelete = (activity, props) => {
  console.log('Delete activity', activity);

  fetch(`${API_ROOT}/activities/${activity.id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
  )
    .then(res => res.json())
    .then(props.updateAfterDelete(activity))
    .catch(error => console.error('Error:', error));
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
          {act[0].title}
        </Chip>
      );
    });

    return rows;
  }
  return <p>Ei aktiviteetteja valittuna</p>;
};

export default Activity;
