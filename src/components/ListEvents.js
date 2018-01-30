import React from 'react';

export default class ListEvents extends React.Component {
    
    render() {
        let listOfEvents = this.props.events.map((event, id) =>
        <li key={id}>{event.eventTitle}</li>
        )

        return (
            <ul>
                {listOfEvents}
            </ul>
        )
    }
}