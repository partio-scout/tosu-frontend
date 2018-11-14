import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import isTouchDevice from 'is-touch-device'
import TreeSelect /* ,{ TreeNode, SHOW_PARENT } */ from 'rc-tree-select'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import {
  CardActions,
  CardHeader,
  IconButton,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
} from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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
      syncToKuksa: Boolean(props.event.synced), // Initial state of sync or no sync from backend
      syncDialogOpen: false
    }
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

  handleSyncSwitchClick = async () => {
    this.setState({ syncDialogOpen: true })
    console.log("click")
  }

  handleSyncDialogClose = async () => {
    this.setState({ syncDialogOpen: false })
  }

  startSyncingWithKuksa = async () => {
    // TODO
  }

  stopSyncingWithKuksa = async () => {
    // TODO
  }

  render() {
    const { event } = this.props

    moment.locale('fi')
    const { title } = event
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
        .locale('fi')
        .format('ddd D. MMMM YYYY')} ${event.startTime}`

    let cardClassName = "event-card-wrapper" // Style: Normal
    if (this.props.event.activities.length === 0) {
      cardClassName = "empty-event-card" // Style: No activities
    }
    // Prioritize kuksa sync color over emptiness warning color (warning icon still visible)
    if (this.props.event.synced) {
      cardClassName = "kuksa-synced-event-card" // Style: Synced to Kuksa
    }

    const taskGroupTree = this.props.pofTree.taskgroups

    let selectedTaskGroupPofData = []
    if (this.props.taskgroup !== undefined && this.props.taskgroup !== null && isTouchDevice()) {
      console.log('Counting selectedTaskGroupPofData')
      const groupfound = taskGroupTree.find(
        group => group.guid === this.props.taskgroup.value
      )
      selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
        groupfound.children
      )
    }

    let syncDialogTitle
    let syncDialogDescription
    let syncDialogConfirmText
    let dialogConfirmHandler
    if (this.state.syncToKuksa) {
      syncDialogTitle = "Lopetetaanko tapahtuman synkronointi Kuksaan?"
      syncDialogDescription = "Tapahtuma poistetaan Kuksasta, mutta jää omaan suunnitelmaasi."
      syncDialogConfirmText = "Lopeta synkronointi"
      dialogConfirmHandler = this.stopSyncingWithKuksa
    } else {
      syncDialogTitle = "Synkronoidaanko tapahtuma Kuksaan?"
      syncDialogDescription = "Tapahtuma lähetetään Kuksaan. Tapahtuman muokkaus lähettää muutokset Kuksaan ja Kuksassa tehdyt muutokset synkronoidaan suunnitelmaasi. Aktiviteettejä ei synkronoida."
      syncDialogConfirmText = "Synkronoi tapahtuma"
      dialogConfirmHandler = this.startSyncingWithKuksa
    }
    const syncConfirmDialog = (
      <div>
        <Dialog
          open={this.state.syncDialogOpen}
          onClose={this.handleSyncDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{syncDialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{syncDialogDescription}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSyncDialogClose} color="primary">Peruuta</Button>
            <Button onClick={dialogConfirmHandler} color="primary" autoFocus>{syncDialogConfirmText}</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
    const syncToKuksaSwitch = (
      <FormControlLabel
        control={
          <Switch
            checked={this.state.syncToKuksa}
            onClick={this.handleSyncSwitchClick}
            color="primary"
          />
        }
        label="Synkronoi Kuksaan"
      />
    )

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
    const notExpanded = (
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
    const expanded = (
      <CardContent>
        {syncConfirmDialog}
        <p className="eventTimes">
          <span>{event.type} alkaa:</span>{' '}
          {moment(event.startDate).locale('fi').format('ddd D.M.YYYY')} kello{' '}
          {event.startTime}
        </p>
        <p className="eventTimes">
          <span>{event.type} päättyy:</span>{' '}
          {moment(event.endDate).locale('fi').format('ddd D.M.YYYY')} kello {event.endTime}
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
    )


    return (
      <div className={cardClassName}>
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
            { isTouchDevice() && !this.state.expanded ? touchDeviceNotExpanded : null }
            { !isTouchDevice() && !this.state.expanded ? notExpanded  : null }
            { this.state.expanded ? expanded : null }

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
