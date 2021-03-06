import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardActions,
  CardHeader,
  Collapse,
  IconButton,
  CardContent,
  withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment'
import { Parser } from 'html-to-react'

import AddToPlan from './AddToPlan'

/** @module */

const styles = {
  arrowUp: {
    transform: 'rotate(180deg)',
  },

  boldedAttribute: {
    fontWeight: 'bold',
  },
  eventCard: {
    marginBottom: 14,
    borderRadius: 4,
    backgroundColor: '#D6E8F6',
  },
}

/**
 * Component for displaying events form kuksa.
 * @param {Object} props
 * @param {Object} props.event - event from kuksa
 * @param {Number} props.event.id - id for event
 * @param {String} props.event.title - title for event 
 *
 */
class KuksaEventCard extends React.Component {
  state = { expanded: false }

  /**
   *  Toggles between expanded and not expanded
   *  @method
   */
  handleExpandChange = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { event, classes } = this.props

    const title = this.state.expanded ? '' : event.title
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD').format('ddd D. MMMM YYYY')} ${
          event.startTime
        }`

    const information = new Parser().parse(event.information)

    return (
      <Card className={classes.eventCard}>
        <CardHeader
          title={title}
          subheader={subtitle}
          action={
            <IconButton
              onClick={this.handleExpandChange}
              className={this.state.expanded ? classes.arrowUp : ''}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        />

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <h2>{event.title}</h2>
            <div>
              <span className={classes.boldedAttribute}>
                {event.type} alkaa:
              </span>{' '}
              {moment(event.startDate).format('D.M.YYYY')} kello{' '}
              {event.startTime}
            </div>
            <div>
              <span className={classes.boldedAttribute}>
                {event.type} päättyy:
              </span>{' '}
              {moment(event.endDate).format('D.M.YYYY')} kello {event.endTime}
            </div>
            {information}
            <br style={{ clear: 'both' }} />
          </CardContent>
        </Collapse>
        <CardActions>
          <AddToPlan event={event} />
        </CardActions>
      </Card>
    )
  }
}

KuksaEventCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(KuksaEventCard)
