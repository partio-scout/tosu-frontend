import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventCard from './EventCard'
import KuksaEventCard from './KuksaEventCard'
import filterEvents from '../functions/filterEvents'
import { eventList } from '../reducers/eventReducer'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  eventList: {
    paddingTop: 10,
    paddingBottom: 10,
  },
})

class EventList extends React.Component {
  render() {
    const view = this.props.ui.view
    const { startDate, endDate, events, classes } = this.props

    const eventsToShow = () =>
      filterEvents(view, eventList(events), startDate, endDate)

    let odd = true
    return (
      <div className={classes.eventList}>
        {eventsToShow().map(event => {
          odd = !odd
          return (
            <div key={event.id ? event.id : 0}>
              {event.kuksaEvent ? (
                <KuksaEventCard event={event} />
              ) : (
                <EventCard event={event} odd={odd} />
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  events: state.events,
  filter: state.filter,
  ui: state.ui,
})

export default connect(mapStateToProps)(withStyles(styles)(EventList))
