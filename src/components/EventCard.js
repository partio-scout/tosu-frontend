import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import isTouchDevice from 'is-touch-device'
import TreeSelect /* ,{ TreeNode, SHOW_PARENT } */ from 'rc-tree-select'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CardContent } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
import moment from 'moment-with-locales-es6'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

import ActivityWrapper from './ActivityWrapper'
import ActivityDragAndDropArea from './ActivityDragAndDropArea'
import EditEvent from './EditEvent'
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
  postActivityToBufferOnlyLocally,
  bufferZoneInitialization
} from '../reducers/bufferZoneReducer'
import eventService from '../services/events'


// Actual Warning icon
// Warning icon
const warning = (
  <div className="tooltip">
    <Warning
      className='warning'
    />
    <span className="tooltiptext">
      Tapahtumasta puuttuu aktiviteetti!
    </span>
  </div>
)

class EventCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      open: false
    }
  }

  // Mobiilissa..?
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


  emptyBuffer = async () => {
    if (isTouchDevice()) {
      const bufferActivities = this.props.buffer.activities
      const promises = bufferActivities.map(activity =>
        this.props.deleteActivityFromBuffer(activity.id)
      )
      try {
        await Promise.all(promises)
      } catch (exception) {
        console.log('Error in emptying buffer', exception)
      }
    }

    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
  }

  deleteEvent = async () => {
    try {
      await this.props.deleteEvent(this.props.event.id)
      await this.props.bufferZoneInitialization()
      await this.emptyBuffer()
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
      await this.emptyBuffer()
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

    const actions = (
      <div>
        <p>Poistetaanko tapahtuma {event.title}?</p>
        <Button onClick={this.handleClose}>peruuta</Button>
        <Button onClick={this.deleteEvent}>Poista {event.groupId?"tämä":null}tapahtuma</Button>
        {event.groupId ? 
          <Button onClick={this.deleteEventGroup}>Poista toistuvat tapahtumat</Button>
        : null}
      </div>
    )


    const taskGroupTree = this.props.pofTree.taskgroups

    let selectedTaskGroupPofData = []
    if (this.props.taskgroup !== undefined && this.props.taskgroup !== null) {
      console.log('Counting selectedTaskGroupPofData')
      const groupfound = taskGroupTree.find(
        group => group.guid === this.props.taskgroup.value
      )
      selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
        groupfound.children
      )
    }

    
    const touchDeviceNotExpanded = (
      <CardContent>
        <div className="mobile-event-card-media">
          <ActivityWrapper
            activities={this.props.event.activities}
            bufferzone={false}
            parentId={this.props.event.id}
          />
          {this.props.taskgroup ? (
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
          ) : (
            <div style={{ clear: 'both' }}>&nbsp;</div>
          )}
        </div>
      </CardContent>
    )
    const notTouchDeviceNotExpanded = (
      <CardContent>
        <div className="activity-header">
          <ActivityWrapper
            activities={this.props.event.activities}
            bufferzone={false}
            parentId={this.props.event.id}
          />
        </div>
      </CardContent>
    )
    

    return (
      <div className={this.props.event.activities.length === 0 ? "empty-event-card" : "event-card-wrapper"}>
        <Card>
          <ActivityDragAndDropArea bufferzone={false} parentId={this.props.event.id}>
            <CardHeader
              title={
                <div>
                  {title}
                  &nbsp;
                  {this.props.event.activities.length === 0 ? warning : ''}
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
            
            {isTouchDevice() && !this.state.expanded ? touchDeviceNotExpanded : null }
            {!isTouchDevice() && !this.state.expanded && this.props.event.activities.length !== 0 ? notTouchDeviceNotExpanded  : null}

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
                <ActivityWrapper 
                  activities={this.props.event.activities}
                  bufferzone={false}
                  parentId={this.props.event.id}
                />
                <br style={{ clear: 'both' }} />
              </CardContent>
            </Collapse>
            <CardActions>
              <EditEvent
                buttonClass="buttonRight"
                data={event}
                source={this.handleClose}
                setNotification={this.props.setNotification}
              />
              <Button
                className="buttonRight"
                onClick={this.handleDelete}
                variant='contained'
              >
                poista
              </Button>

              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
              >
                <div>
                  {actions}
                </div>
              </Dialog>
            </CardActions>
          </ActivityDragAndDropArea>
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


export default connect(mapStateToProps, {
  notify,
  editEvent,
  deleteEvent,
  deleteActivityFromEvent,
  bufferZoneInitialization,
  deleteEventGroup,
  addActivityToEventOnlyLocally,
  deleteActivityFromEventOnlyLocally,
  postActivityToBufferOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  pofTreeUpdate
})(EventCard)
