import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  FormControlLabel,
  LinearProgress,
  Switch,
} from '@material-ui/core'
import EventCard from './EventCard'
import KuksaEventCard from './KuksaEventCard'
import eventComparer from '../utils/EventCompare'
import PropTypesSchema from './PropTypesSchema'

class EventList extends React.Component {
  state = {
    shouldShowAllKuksaEvents: false,
    loading: true,
  }

  render() {
    const { events, filter } = this.props
    console.log(filter)
    const shouldShowAllKuksaEvents = this.state.shouldShowAllKuksaEvents
    /**
     * Determines which events are shown. If filter is set to FUTURE, show all events with end date equal
     * or greater than today otherwise show events with end date less than today
     * @returns events that are filtered with given filters
     */
    const eventsToShow = () => {
      const currentDate = moment().format('YYYY-MM-DD')
      switch (filter) {
        case 'FUTURE':
          return events
            .filter(event => event.endDate >= currentDate && !event.kuksaEvent)
            .sort(eventComparer)
        case 'ALL':
          return events.filter(event => !event.kuksaEvent).sort(eventComparer)
        case 'KUKSA':
          if (shouldShowAllKuksaEvents) {
            return events.filter(event => event.kuksaEvent).sort(eventComparer)
          }
          return events
            .filter(event => event.endDate >= currentDate && event.kuksaEvent)
            .sort(eventComparer)
        default:
          return events.sort(eventComparer)
      }
    }

    const kuksaEventsShowAllSwitch = (
      <FormControlLabel
        control={
          <Switch
            checked={shouldShowAllKuksaEvents}
            onClick={this.handleKuksaEventSwitchChange}
            color="primary"
          />
        }
        label="Näytä myös menneet tapahtumat"
      />
    )

    const addKuksaEventsToTosuButton = (
      <Button onClick={this.handleAddToTosuButtonClick} variant="contained">
        Lisää omaan suunnitelmaan
      </Button>
    )

    const eventsToList = (
      <div className="event-list-container">
        {this.state.loading && (
          <div className="loading-bar">
            <LinearProgress />
          </div>
        )}
        {filter === 'KUKSA' && kuksaEventsShowAllSwitch}
        {filter === 'KUKSA' && addKuksaEventsToTosuButton}
        <ul className="event-list">
          {eventsToShow().map(event => (
            <li className="event-list-item" key={event.id ? event.id : 0}>
              {event.kuksaEvent ? (
                <KuksaEventCard event={event} />
              ) : (
                <EventCard event={event} />
              )}
            </li>
          ))}
        </ul>
      </div>
    )

    return <div>{eventsToList}</div>
  }
}

EventList.propTypes = {
  ...PropTypesSchema,
}

EventList.defaultProps = {}

const mapStateToProps = state => ({
  events: state.events,
  filter: state.filter,
})

export default connect(mapStateToProps)(EventList)
