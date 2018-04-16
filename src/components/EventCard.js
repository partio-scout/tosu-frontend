import { connect } from 'react-redux'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import React from 'react'
import { DropTarget } from 'react-dnd'
import { notify } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card'
import moment from 'moment-with-locales-es6'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Badge from 'material-ui/Badge'
import Activity from './Activity'
import EditEvent from './EditEvent'
import ItemTypes from '../ItemTypes'
import activityService from '../services/activities'
import {
  editEvent,
  deleteActivityFromEvent,
  deleteEvent,
  deleteEventGroup,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally
} from '../reducers/eventReducer'
import {
  deleteActivityFromBufferOnlyLocally,
  bufferZoneInitialization
} from '../reducers/bufferZoneReducer'
import { green100, white } from 'material-ui/styles/colors'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'

const moveActivityFromBuffer = async (
  props,
  activityId,
  parentId,
  targetId
) => {
  try {
    const res = await activityService.moveActivityFromBufferZoneToEvent(
      activityId,
      parentId,
      targetId
    )
    await props.addActivityToEventOnlyLocally(targetId, res)
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
  props.pofTreeUpdate(props.buffer, props.events)
}

const moveActivityFromEvent = async (props, activityId, parentId, targetId) => {
  try {
    const res = await activityService.moveActivityFromEventToEvent(
      activityId,
      parentId,
      targetId
    )
    props.addActivityToEventOnlyLocally(targetId, res)
    props.deleteActivityFromEventOnlyLocally(activityId)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
  props.pofTreeUpdate(props.buffer, props.events)
}

const EventCardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const targetId = props.event.id
    const { parentId } = item
    const activityId = item.id
    if (item.bufferzone === 'true') {
      moveActivityFromBuffer(props, activityId, parentId, targetId)
    } else if (targetId !== parentId) {
      moveActivityFromEvent(props, activityId, parentId, targetId)
    }
  }
}

function collect(connector, monitor) {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    target: monitor.getItem()
  }
}

class EventCard extends React.Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      open: false
    }
  }

  handleExpandChange = expanded => {
    this.setState({ expanded })
  }

  handleReduce = () => {
    this.setState({ expanded: false })
  }

  deleteActivity = async activity => {
    try {
      await this.props.deleteActivityFromEvent(activity.id)
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
      this.props.notify('Aktiviteetti poistettu!', 'success')
    } catch (exception) {
      console.log(exception)
      this.props.notify(
        'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
      )
    }
  }

  deleteEvent = async () => {
    try {
      await this.props.deleteEvent(this.props.event.id)
      await this.props.bufferZoneInitialization()
      this.props.notify('Tapahtuma poistettu!', 'success')
      this.handleClose()
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify('Tapahtuman poistamisessa tuli virhe. Yritä uudestaan!')
    }
  }

  deleteEventGroup = async () => {
    try {
      await this.props.deleteEventGroup(this.props.event.groupId)
      this.props.notify('Toistuva tapahtuma poistettu!', 'success')
      await this.props.bufferZoneInitialization()
      this.handleClose()
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify(
        'Toistuvan tapahtuman poistamisessa tuli virhe. Yritä uudestaan!'
      )
    }
  }

  handleDelete = () => {
    this.handleOpen()
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    let rows
    if (this.props.event.activities) {
      rows = this.props.event.activities.map(activity => {
        const pofActivity = convertToSimpleActivity(
          findActivity(activity, this.props.pofTree)
        )

        return (
          <Activity
            bufferzone={false}
            parentId={this.props.event.id}
            parent={this}
            key={activity.id}
            pofActivity={pofActivity}
            activity={activity}
            deleteActivity={this.deleteActivity}
          />
        )
      })
    }

    const { event } = this.props

    moment.locale('fi')
    const title = this.state.expanded ? '' : event.title
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D. MMMM YYYY')} ${event.startTime}`

    let actions = []
    if (event.groupId) {
      actions = [
        <FlatButton label="Peruuta" primary onClick={this.handleClose} />,

        <FlatButton
          label="Poista tämä tapahtuma"
          primary
          onClick={this.deleteEvent}
        />,
        <FlatButton
          label="Poista toistuvat tapahtumat"
          primary
          onClick={this.deleteEventGroup}
        />
      ]
    } else {
      actions = [
        <FlatButton label="Peruuta" primary onClick={this.handleClose} />,
        <FlatButton
          label="Poista tapahtuma"
          primary
          onClick={this.deleteEvent}
        />
      ]
    }
    let patternClass
    const { connectDropTarget, canDrop, isOver } = this.props
    let background = { backgroundColor: white }
    if (canDrop) {
      background = { backgroundColor: green100 }
    }
    if (isOver) {
      patternClass = 'pattern'
    }

    return connectDropTarget(
      <div>
        <Card
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
          style={background}
          className={patternClass}
        >
          <CardHeader
            title={title}
            subtitle={subtitle}
            actAsExpander
            showExpandableButton
          />
          {!this.state.expanded && this.props.event.activities.length !== 0 ? (
            <CardMedia>
              <div className="activity-header">{rows}</div>
            </CardMedia>
          ) : null}

          <CardTitle title={event.title} subtitle="Lokaatio?" expandable />
          <CardText expandable>
            <EditEvent
              buttonClass="buttonRight"
              data={event}
              source={this.handleClose}
              setNotification={this.props.setNotification}
            />
            <FlatButton
              label="Poista"
              secondary
              className="buttonRight"
              onClick={this.handleDelete}
            />

            <Dialog
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              Poistetaanko tapahtuma {event.title}?
            </Dialog>

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
            {rows}
            <br style={{ clear: 'both' }} />
            <CardActions>
              <FlatButton
                label="Sulje"
                primary
                onClick={this.handleReduce}
                fullWidth
              />
            </CardActions>
          </CardText>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    buffer: state.buffer,
    pofTree: state.pofTree
  }
}

const DroppableEventCard = DropTarget(
  ItemTypes.ACTIVITY,
  EventCardTarget,
  collect
)(EventCard)

export default connect(mapStateToProps, {
  notify,
  editEvent,
  deleteEvent,
  deleteActivityFromEvent,
  bufferZoneInitialization,
  deleteEventGroup,
  addActivityToEventOnlyLocally,
  deleteActivityFromEventOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  pofTreeUpdate
})(DroppableEventCard)
