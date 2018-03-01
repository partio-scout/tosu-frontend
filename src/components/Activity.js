import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4
  }
};

const handleRequestDelete = (activity, props) => {
  console.log("Delete activity", activity)

  fetch(
    `https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/activities/${
      activity.id
    }`,
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
  if (props.eventActivities.length !== 0) {
    const rows = props.eventActivities.map(activity => {
      const act = props.dataSource.filter(a => a.guid === activity.information);

      return (
        <Chip
          backgroundColor={blue300}
          onRequestDelete={() => handleRequestDelete(activity, props)}
          style={styles.chip}
          key={activity.information}
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