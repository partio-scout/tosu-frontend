import { connect } from 'react-redux'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  Collapse,
  IconButton,
  Button,
  Dialog,
  CardContent,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment-with-locales-es6'
import { notify } from '../reducers/notificationReducer'

import { addEvent } from '../reducers/eventReducer'

class KuksaEventCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      dialogOpen: false,
      synced: props.event.synced
    }
  }

  handleExpandChange = expanded => {
    this.setState({ expanded: !this.state.expanded })
  }

  handleButtonDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleButtonDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  addEventToTosu = async () => {
    // The event has event.kuksaEventId -> backend will know it's a synced event.
    try {
      let eventData = this.props.event
      delete eventData.id
      await this.props.addEvent(eventData)

      this.props.notify('Tapahtuma lisätty suunnitelmaan!', 'success')
      this.handleButtonDialogClose()
      this.setState({ synced: true }) // TODO
    } catch (exception) {
      console.error('Error in adding event to tosu:', exception)
      this.props.notify('Tapahtuman lisäämisessä tuli virhe. Yritä uudestaan!')
    }
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

    const addToTosuButton = (
      <div>
        <Button
          onClick={this.handleButtonDialogOpen}
          className={this.props.buttonClass}
          variant='contained'
          disabled={this.state.synced}
        >
          {this.state.synced ? (<span>Lisätty</span>) : (<span>Lisää omaan suunnitelmaan</span>)}
        </Button>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleButtonDialogClose}
        >
          <p>Lisätäänkö tapahtuma <b>{event.title}</b> omaan suunnitelmaan? Tapahtuma synkronoidaan Kuksaan.</p>
          <Button onClick={this.handleButtonDialogClose} >peruuta</Button>
          <Button onClick={this.addEventToTosu}>
            Lisää suunnitelmaan
          </Button>
        </Dialog>
      </div>
    )

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
            {addToTosuButton}
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
  addEvent,
})(KuksaEventCard)
