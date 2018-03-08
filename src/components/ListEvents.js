import React from 'react';
import EventCard from './EventCard';

const ListEvents = props => {
  const listOfEvents = props.events.map(event => (
    <EventCard
      key={event.id ? event.id : 0}
      event={event}
      fetchedActivities={props.fetchedActivities}
      fetchEvents={props.fetchEvents}
      updateFilteredActivities={props.updateFilteredActivities}
      setNotification={props.setNotification}
    />
  ));

  return (
    <div>
      <br />
      {listOfEvents}
    </div>
  );
};

export default ListEvents;
