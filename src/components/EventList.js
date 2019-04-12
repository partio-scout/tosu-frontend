import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import isTouchDevice from 'is-touch-device'
import {
  Button,
  FormControlLabel,
  LinearProgress,
  Switch,
} from '@material-ui/core'
import EventCard from './EventCard'
import DeleteTosuButton from './DeleteTosuButton'
import KuksaEventCard from './KuksaEventCard'
import eventComparer from '../utils/EventCompare'
import filterEvents from '../functions/filterEvents'
import { eventList } from '../reducers/eventReducer'

class EventList extends React.Component {
  render() {
    const { startDate, endDate, events, view, initialization } = this.props
    const eventsToShow = () =>
      filterEvents(view, eventList(events), startDate, endDate)
    let odd = true
    return (
      <div className="event-list-container">
        {view === 'KUKSA'}
        <ul
          className={
            isTouchDevice() ? 'mobile-event-list event-list' : 'event-list'
          }
        >
          {filterEvents(
            view,
            eventList(this.props.events),
            startDate,
            endDate
          ).map(event => {
            odd = !odd
            return (
              <li className="event-list-item" key={event.id ? event.id : 0}>
                {event.kuksaEvent ? (
                  <KuksaEventCard event={event} />
                ) : (
                  <EventCard event={event} odd={odd} />
                )}
              </li>
            )
          })}
          <li>
            <DeleteTosuButton initialization={initialization} />
          </li>
        </ul>
      </div>
    )
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.string.isRequired,
}

EventList.defaultProps = {}

const mapStateToProps = state => ({
  events: state.events,
  filter: state.filter,
  view: state.view,
})

export default connect(mapStateToProps)(EventList)
