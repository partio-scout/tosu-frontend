import React from 'react';
import EventCard from './EventCard';

export default class ListEvents extends React.Component {
    
    render() {
        let listOfEvents = this.props.events.map((event, id) => 
        <EventCard event={event} />
        )

        return (
            <div>
            <br />
                {listOfEvents}
            </div>
        )
    }
}