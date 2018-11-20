import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import LinearProgress from '@material-ui/core/LinearProgress'
import EventCard from './EventCard'
import KuksaEventCard from './KuksaEventCard'

import eventComparer from '../utils/EventCompare'


class EventList extends React.Component {
  constructor() {
    super()
    this.state = {
      shouldShowAllKuksaEvents: false,
      loading: true,
      kuksaEventstoAdd: [],
    }
  }

  render() {
    const { events, filter } = this.props
    const shouldShowAllKuksaEvents = this.state.shouldShowAllKuksaEvents

    const eventsToShow = () => {
      const currentDate = moment().format('YYYY-MM-DD')
      // If filter is set to FUTURE, show all events with end date equal or greater than today
      // otherwise show events with end date less than today
      switch (filter) {
        case "FUTURE":
          return events.filter(event => event.endDate >= currentDate && !event.kuksaEvent).sort(eventComparer)
        case "ALL":
          return events.filter(event => !event.kuksaEvent).sort(eventComparer)
        case "KUKSA":
          if (shouldShowAllKuksaEvents) {
            return events.filter(event => event.kuksaEvent).sort(eventComparer)
          }
          return events.filter(event => event.endDate >= currentDate && event.kuksaEvent).sort(eventComparer)
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
      <Button
        onClick={this.handleAddToTosuButtonClick}
        variant='contained'
      >
        Lisää omaan suunnitelmaan
      </Button>
    )

    const eventsToList = (
      <div className='event-list-container'>
        {this.state.loading && (<div className="loading-bar"><LinearProgress /></div>)}
        {filter === "KUKSA" && kuksaEventsShowAllSwitch}
        {filter === "KUKSA" && addKuksaEventsToTosuButton}
        <ul className='event-list'>
          {eventsToShow().map(event => (
            <li className='event-list-item' key={event.id ? event.id : 0}>
              {event.kuksaEvent ? (<KuksaEventCard event={event} />) : (<EventCard event={event} />)}
            </li>
          ))}
        </ul>
      </div>
    )

    return (
      <div>
      {eventsToList}</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    filter: state.filter
  }
}

export default connect(mapStateToProps)(EventList)
