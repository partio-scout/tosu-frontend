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

import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent'
import {
  editEvent,
  deleteActivityFromEvent,
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
          <Activities
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
          <Activities
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
          <ActivityDragAndDropTarget bufferzone={false} parentId={this.props.event.id}>
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
                <Activities
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
              <DeleteEvent
                buttonClass="buttonRight"
                data={event}
                source={this.handleClose}
                setNotification={this.props.setNotification}
              />
            </CardActions>
          </ActivityDragAndDropTarget>

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
  deleteActivityFromEvent,
  bufferZoneInitialization,
  addActivityToEventOnlyLocally,
  deleteActivityFromEventOnlyLocally,
  postActivityToBufferOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  pofTreeUpdate
})(EventCard)
