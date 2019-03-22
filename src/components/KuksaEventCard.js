import { connect } from 'react-redux'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  Collapse,
  IconButton,
  CardContent,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment-with-locales-es6'
import { Parser } from 'html-to-react'

import AddToPlan from './AddToPlan'
import { notify } from '../reducers/notificationReducer'
import PropTypesSchema from './PropTypesSchema'

class KuksaEventCard extends React.Component {
  state = { expanded: false }

  /**
   *  Toggles between expanded and not expanded
   */
  handleExpandChange = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { event } = this.props

    moment.locale('fi')
    const title = this.state.expanded ? '' : event.title
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D. MMMM YYYY')} ${event.startTime}`

    const information = new Parser().parse(event.information)

    return (
      <div className="event-card-wrapper">
        <Card
          style={{
            backgroundColor: '#D6E8F6',
            boxShadow: 'none',
            borderRadius: '4px',
          }}
        >
          <CardHeader
            title={
              <div>
                {title}
                &nbsp;
              </div>
            }
            subheader={subtitle}
            action={
              <IconButton
                onClick={this.handleExpandChange}
                className={this.state.expanded ? 'arrow-up' : ''}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
          />

          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <h2>{event.title}</h2>
              <p className="eventTimes">
                <span>{event.type} alkaa:</span>{' '}
                {moment(event.startDate).format('D.M.YYYY')} kello{' '}
                {event.startTime}
              </p>
              <p className="eventTimes">
                <span>{event.type} päättyy:</span>{' '}
                {moment(event.endDate).format('D.M.YYYY')} kello {event.endTime}
              </p>
              <p>{information}</p>
              <br style={{ clear: 'both' }} />
            </CardContent>
          </Collapse>
          <CardActions>
            <AddToPlan event={event} />
          </CardActions>
        </Card>
      </div>
    )
  }
}

KuksaEventCard.propTypes = {
  ...PropTypesSchema,
}

KuksaEventCard.defaultProps = {}

export default connect(
  null,
  {
    notify,
  }
)(KuksaEventCard)
