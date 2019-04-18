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
    marginBlockEnd: 0,
    marginBlockStart: 0,
    overflowX: 'hidden',
    paddingLeft: 0,
  },
})

class EventList extends React.Component {
  render() {
    const view = this.props.ui.view
    console.log(view)
    const { startDate, endDate, events, initialization, classes } = this.props

    const eventsToShow = () =>
      filterEvents(view, eventList(events), startDate, endDate)

    let odd = true
    return (
      <React.Fragment>
        <ul className={classes.eventList}>
          {eventsToShow().map(event => {
            odd = !odd
            return (
              <li key={event.id ? event.id : 0}>
                {event.kuksaEvent ? (
                  <KuksaEventCard event={event} />
                ) : (
                  <EventCard event={event} odd={odd} />
                )}
              </li>
            )
          })}
        </ul>
        <DeleteTosuButton initialization={initialization} />
      </React.Fragment>
    )
  }
}

EventList.propTypes = {
  events: PropTypes.object.isRequired,
}

EventList.defaultProps = {}

const mapStateToProps = state => ({
  events: state.events,
  ui: state.ui,
})

export default connect(mapStateToProps)(withStyles(styles)(EventList))
