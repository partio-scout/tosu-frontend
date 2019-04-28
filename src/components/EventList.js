import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventCard from './EventCard'
import KuksaEventCard from './KuksaEventCard'
import filterEvents from '../functions/filterEvents'
import { eventList } from '../reducers/eventReducer'
import { withStyles, Typography } from '@material-ui/core'

const styles = theme => ({
  eventList: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
})

class EventList extends React.Component {
  render() {
    const view = this.props.ui.view
    const { startDate, endDate, events, loading, classes } = this.props

    const eventsToShow = filterEvents(
      view,
      eventList(events),
      startDate,
      endDate
    )

    let odd = true
    const eventsList = eventsToShow.map(event => {
      odd = !odd
      return (
        <div id="event-list-element" key={event.id ? event.id : 0}>
          {event.kuksaEvent ? (
            <KuksaEventCard event={event} />
          ) : (
            <EventCard event={event} odd={odd} />
          )}
        </div>
      )
    })

    return (
      <div className={classes.eventList}>
        {eventsToShow.length ? (
          eventsList
        ) : loading ? null : (
          <Typography align="center" color="textSecondary">
            Ei tapahtumia
          </Typography>
        )}
      </div>
    )
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  events: state.events,
  filter: state.filter,
  ui: state.ui,
  loading: state.loading,
})

export default connect(mapStateToProps)(withStyles(styles)(EventList))
