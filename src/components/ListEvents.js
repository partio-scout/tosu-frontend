import React from 'react'
import EventCard from './EventCard'
import { connect } from 'react-redux'

const ListEvents = props => {
  const listOfEvents = props.events.map(event => (
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