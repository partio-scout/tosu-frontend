import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventCard from './EventCard'
import DeleteTosuButton from './DeleteTosuButton'
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

function EventList(props) {
  const view = props.ui.view
  const { startDate, endDate, events, initialization, classes } = props

  const eventsToShow = () =>
    filterEvents(view, eventList(events), startDate, endDate)

  let odd = true
  return (
    <React.Fragment>
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
      <DeleteTosuButton initialization={initialization} />
    </React.Fragment>
  )
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
