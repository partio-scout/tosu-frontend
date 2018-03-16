import React from 'react'
import EventCard from './EventCard'
import { connect } from 'react-redux'

const compare = (a, b) => {
  if(a.startDate < b.startDate) {
    return -1
  } else if (b.startDate < a.startDate) {
    return 1
  }
  return 0
}

const ListEvents = props => {
  const sortedEvents = props.events.sort(compare)
  const listOfEvents = sortedEvents.map(event => (
    <EventCard
      key={event.id ? event.id : 0}
      event={event}
    />
  ));

  return (
    <div>
      <br />
      {listOfEvents}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    events: state.events
  }
}

export default connect(
  mapStateToProps,
  {  }

)(ListEvents)