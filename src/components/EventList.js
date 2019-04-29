import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventCard from './EventCard'
import KuksaEventCard from './KuksaEventCard'
import filterEvents from '../functions/filterEvents'
import { eventList } from '../reducers/eventReducer'
import { setSideBar } from '../reducers/uiReducer'
import { withStyles, Typography, IconButton } from '@material-ui/core'
import MenuButton from '@material-ui/icons/Menu'

const styles = theme => ({
  eventList: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
})

class EventList extends React.Component {
  render() {
    const view = this.props.ui.view
    const { startDate, endDate, events, loading, tosus, classes } = this.props

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
        ) : loading ? null : Object.entries(tosus).length === 0 ? (
          <Typography align="center" color="textSecondary">
            {'Luo ensin toimintasuunnitelma'}
            <IconButton
              style={{ marginLeft: 4 }}
              onClick={() => this.props.setSideBar(true)}
            >
              <MenuButton />
            </IconButton>
          </Typography>
        ) : (
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
  tosus: PropTypes.isRequired,
}

const mapStateToProps = state => ({
  events: state.events,
  filter: state.filter,
  ui: state.ui,
  loading: state.loading,
  tosus: state.tosu,
})

const mapDispatchToProps = {
  setSideBar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EventList))
