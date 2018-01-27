import React from 'react';

export default class ListEvents extends React.Component {
    
    render() {
        let listOfEvents = this.props.events.map((event, id) =>
        <li key={id}>{event.name}</li>
        )

        return (
            <ul>
                {listOfEvents}
            </ul>
        )
    }
}