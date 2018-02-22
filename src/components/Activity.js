import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 4
  }
};

const handleRequestDelete = () => {
  alert('Yritit poistaa aktiviteetin. Toimintoa ei vielä tueta.');
};

const Activity = props => {
  console.log(props);
  if (props.eventActivities.length !== 0) {
    const rows = props.eventActivities.map(activity => {

    const act = props.dataSource.filter(a => a.guid === activity.information)
    console.log("Act", act)
    return(  <Chip
        backgroundColor={blue300}
        onRequestDelete={handleRequestDelete}
        style={styles.chip}
        key={activity.information}
      >
        <Avatar size={32} color={blue300} backgroundColor={indigo900}>
          P
        </Avatar>
        {act[0].title}
      </Chip>
    )
    });

    return rows;
  } else {
    return <p>Ei aktiviteetteja valittuna</p>;
  }
};

export default Activity;
