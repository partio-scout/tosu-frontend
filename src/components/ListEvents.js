import React from 'react';
import EventCard from './EventCard';

export default class ListEvents extends React.Component {
    
    render() {
        let listOfEvents = this.props.events.map((event, id) => 
        <li key={id}><EventCard event={event} /></li>
        )

        return (
            <ul className="events">
                {listOfEvents}
            </ul>
        )
    }
}