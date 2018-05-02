import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import isTouchDevice from 'is-touch-device'
import TreeSelect /*, { TreeNode, SHOW_PARENT }*/ from 'rc-tree-select'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card'
import Warning from 'material-ui/svg-icons/alert/warning'
import moment from 'moment-with-locales-es6'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
// import Badge from 'material-ui/Badge'
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
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  deleteActivityFromBufferOnlyLocally,
  bufferZoneInitialization
} from '../reducers/bufferZoneReducer'
import { green100, white } from 'material-ui/styles/colors'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'
import eventService from '../services/events'

// Warning icon
const warning = (status, event) => {
  if (status.warnings) {
    if (
      status.warnings.firstTaskTooLate &&
      moment(event.startDate).format('DD.MM.YYYY') === status.dates.firstTask
    ) {

      return (
        <Warning
          style={{
            width: 20,
            height: 20,
            padding: 0,
            marginRight: 7,
            color: 'orange'
          }}
        />
      )
    } else if (
      status.warnings.lastTaskTooSoon &&
      moment(event.startDate).format('DD.MM.YYYY') === status.dates.majakka
    ) {
      return (
        <Warning
          style={{
            width: 20,
            height: 20,
            padding: 0,
            marginRight: 7,
            color: 'orange'
          }}
        />
      )
    }
  }

  return null
}

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
  isLeaf = value => {
    if (!value) {
      return false
    }
    let queues = [...this.props.pofTree.taskgroups]
    while (queues.length) {
      // BFS
      const item = queues.shift()
      if (item.value.toString() === value.toString()) {
        if (!item.children) {
          return true
        }
        return false
      }
      if (item.children) {
        queues = queues.concat(item.children)
      }
    }
    return false
  }
  onChangeChildren = async activityGuid => {
    if (this.isLeaf(activityGuid)) {
      try {
        const res = await eventService.addActivity(this.props.event.id, {
          guid: activityGuid
        })

        this.props.addActivityToEventOnlyLocally(this.props.event.id, res)
        this.props.notify('Aktiviteetti on lisätty!', 'success')
      } catch (exception) {
        this.props.notify('Aktiviteetin lisäämisessä tapahtui virhe!')
      }
    }
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
  }

  filterTreeNode = (input, child) => {
    return child.props.title.props.name
      .toLowerCase()
      .includes(input.toLowerCase())
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

    const taskGroupTree = this.props.pofTree.taskgroups

    let selectedTaskGroupPofData = []
    if (this.props.taskgroup !== undefined && this.props.taskgroup !== null) {
      const groupfound = taskGroupTree.find(
        group => group.guid === this.props.taskgroup.value
      )
      selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
        groupfound.children
      )
    }

    const cardWarning = warning(this.props.status, this.props.event)

    return connectDropTarget(
      <div className="event-card-wrapper">
        <Card
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
          style={background}
          className={patternClass}
        >
          <CardHeader
            title={title}
            subtitle={subtitle}
            children={cardWarning}
            actAsExpander
            showExpandableButton
          />
          {isTouchDevice() && !this.state.expanded ? (
            <CardMedia>
              <div className="mobile-event-card-media">
                <div>{rows}</div>
                <div>
                  <TreeSelect
                    style={{ width: '90%' }}
                    transitionName="rc-tree-select-dropdown-slide-up"
                    choiceTransitionName="rc-tree-select-selection__choice-zoom"
                    dropdownStyle={{
                      position: 'absolute',
                      maxHeight: 400,
                      overflow: 'auto'
                    }}
                    placeholder="Valitse aktiviteetti"
                    searchPlaceholder="Hae aktiviteettia"
                    showSearch
                    allowClear
                    treeLine
                    getPopupContainer={() =>
                      ReactDOM.findDOMNode(this).parentNode
                    }
                    value={this.state.value}
                    treeData={selectedTaskGroupPofData}
                    treeNodeFilterProp="label"
                    filterTreeNode={this.filterTreeNode}
                    onChange={this.onChangeChildren}
                  />
                </div>
              </div>
            </CardMedia>
          ) : null}
          {!isTouchDevice() &&
          !this.state.expanded &&
          this.props.event.activities.length !== 0 ? (
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
    pofTree: state.pofTree,
    taskgroup: state.taskgroup,
    status: state.statusMessage.status
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
