import React from 'react';
import EventCard from './EventCard';

const ListEvents = props => {
  console.log("Event", props.events)
  const listOfEvents = props.events.map(event => (
    <EventCard
      key={event.id ? event.id : 0}
      event={event}
      fetchedActivities={props.fetchedActivities}
      fetchEvents={props.fetchEvents}
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
