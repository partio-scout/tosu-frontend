import { connect } from 'react-redux'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CardContent } from '@material-ui/core'
import moment from 'moment-with-locales-es6'
import { notify } from '../reducers/notificationReducer'

class EventCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  handleExpandChange = expanded => {
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

    return (
      <div className="event-card-wrapper">
        <Card>
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
                className={this.state.expanded ? "arrow-up" : ""}
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
              <p>{event.information}</p>
              <p>Aktiviteetit:</p>
              <br style={{ clear: 'both' }} />
            </CardContent>
          </Collapse>
          <CardActions>
            <Button className="rightButton" variant="contained">Lisää omaan suunnitelmaan</Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

export default connect(mapStateToProps, {
  notify,
})(EventCard)
