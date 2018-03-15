import React from 'react';
import EventCard from './EventCard';

const ListEvents = props => {
  const listOfEvents = props.events.map(event => (
    <EventCard
      key={event.id ? event.id : 0}
      event={event}
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
