import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import isTouchDevice from 'is-touch-device'
import TreeSelect /* ,{ TreeNode, SHOW_PARENT } */ from 'rc-tree-select'
import 'rc-tree-select/assets/index.css'
import React from 'react'
import PropTypes from 'prop-types'
import {
  CardActions,
  CardHeader,
  IconButton,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  FormControlLabel,
  Switch,
} from '@material-ui/core'

import Warning from '@material-ui/icons/Warning'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment-with-locales-es6'
import { Parser } from 'html-to-react'
import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent'

import {
  editEvent,
  deleteActivityFromEvent,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
} from '../reducers/eventReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  deleteActivityFromBufferOnlyLocally,
  postActivityToBufferOnlyLocally,
  bufferZoneInitialization,
} from '../reducers/bufferZoneReducer'
import eventService from '../services/events'
import { deletePlan } from '../reducers/planReducer'
import SuggestionCard from '../components/SuggestionCard'
import { getTask } from '../functions/denormalizations'
import { getActivityList, addActivity } from '../reducers/activityReducer'
import PropTypesSchema from '../utils/PropTypesSchema'


const warning = (
  <div className="tooltip">
    <Warning className="warning" />
    <span className="tooltiptext"> Tapahtumasta puuttuu aktiviteetti!</span>
  </div>
)

class EventCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      syncToKuksa: Boolean(props.event.synced), // Initial state of sync or no sync from backend
      syncDialogOpen: false,
      editMode: false,
      newPlans: false,
    }
    this.changeInfo = this.changeInfo.bind(this)
    this.renderEdit = this.renderEdit.bind(this)
  }
  /**
   *  Adds the activity to local storage and updates the guid. Also updates the pofTree.
   *  @param activityGuid the global identifier of the activity
   */
  onChangeChildren = async activityGuid => {
    if (this.isLeaf(activityGuid)) {
      try {
        const res = await eventService.addActivity(this.props.event.id, {
          guid: activityGuid,
        })
        this.props.addActivity(res)
        this.props.addActivityToEventOnlyLocally(this.props.event.id, res)
        this.props.notify('Aktiviteetti on lisätty!', 'success')
      } catch (exception) {
        this.props.notify('Aktiviteetin lisäämisessä tapahtui virhe!')
      }
    }
    this.props.pofTreeUpdate(this.props.activities)
  }
  /**
   *  Deletes all activities from the local buffer and updates the pofTree
   */
  emptyBuffer = async () => {
    if (isTouchDevice()) {
      const bufferActivities = this.props.buffer.activities
      const promises = bufferActivities.map(activity =>
        this.props.deleteActivityFromBuffer(activity)
      )
      try {
        await Promise.all(promises)
      } catch (exception) {
        console.log('Error in emptying buffer', exception)
      }
    }

    this.props.pofTreeUpdate(this.props.activities)
  }
  /**
   * Checks whether a given value is part of a pofTree using breath-first-search
   * @param value value that is searched
   */
  isLeaf = value => {
    if (!value) {
      return false
    } if( value.children) {
        return false
    }
    return true
  }

  filterTreeNode = (input, child) =>
    child.props.title.props.name.toLowerCase().includes(input.toLowerCase())
  handleExpandChange = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  handleSyncSwitchClick = async () => {
    this.setState({ syncDialogOpen: true })
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

  /* creates a new event with modified information and sends it to eventReducer's editEvent method */
  changeInfo = async event => {
    event.preventDefault()
    const moddedEvent = {
      id: this.props.event.id,
      title: this.props.event.title,
      startDate: this.props.event.startDate,
      endDate: this.props.event.endDate,
      startTime: this.props.event.startTime,
      endTime: this.props.event.endTime,
      type: this.props.event.type,
      information: event.target.children[2].value,
      activities: this.props.event.activities,
    }
    this.props.editEvent(moddedEvent)
    this.setState({ editMode: false })
  }

  renderEdit = () => {
    this.setState({ editMode: !this.state.editMode })
  }

  render() {
    const { event, odd } = this.props
    let editButton = <div />
    moment.locale('fi')
    const { title } = event
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D.M.YYYY')} ${event.startTime.substring(0, 5)}`
    let cardClassName = 'event-card-wrapper'
    if (this.props.event.activities.length === 0) {
      cardClassName = 'empty-event-card'
    }
    // Prioritize kuksa sync color over emptiness warning color (warning icon still visible)
    if (this.props.event.synced) {
      cardClassName = 'kuksa-synced-event-card'
    }

    const taskGroupTree = getRootGroup(this.props.pofTree)
    let selectedTaskGroupPofData = []
    if (
      this.props.taskgroup !== undefined &&
      this.props.taskgroup !== null &&
      isTouchDevice()
    ) {
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
      syncDialogTitle = 'Lopetetaanko tapahtuman synkronointi Kuksaan?'
      syncDialogDescription =
        'Tapahtuma poistetaan Kuksasta, mutta jää omaan suunnitelmaasi.'
      syncDialogConfirmText = 'Lopeta synkronointi'
      dialogConfirmHandler = this.stopSyncingWithKuksa
    } else {
      syncDialogTitle = 'Synkronoidaanko tapahtuma Kuksaan?'
      syncDialogDescription =
        'Tapahtuma lähetetään Kuksaan. Tapahtuman muokkaus lähettää muutokset Kuksaan ja Kuksassa tehdyt muutokset synkronoidaan suunnitelmaasi. Aktiviteettejä ei synkronoida.'
      syncDialogConfirmText = 'Synkronoi tapahtuma'

      dialogConfirmHandler = this.startSyncingWithKuksa
    }
    const information = new Parser().parse(event.information)
    const syncConfirmDialog = (
      <div>
        <Dialog
          open={this.state.syncDialogOpen}
          onClose={this.handleSyncDialogClose}
        >
          <DialogTitle>{syncDialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{syncDialogDescription}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSyncDialogClose} color="primary">
              Peruuta
            </Button>
            <Button onClick={dialogConfirmHandler} color="primary" autoFocus>
              {syncDialogConfirmText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )

    const touchDeviceNotExpanded = (
      <CardContent style={this.state.expanded ? {} : { padding: '3px' }}>
        <div className="mobile-event-card-media">
          <Activities
            activities={this.props.event.activities.map(
              key => this.props.activities[key]
            )}
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
                  overflow: 'auto',
                }}
                placeholder="Valitse aktiviteetti"
                searchPlaceholder="Hae aktiviteettia"
                showSearch
                allowClear
                treeLine
                getPopupContainer={() => ReactDOM.findDOMNode(this).parentNode}
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
      <CardContent style={this.state.expanded ? {} : { padding: '3px 10px' }}>
        <div className="activity-header">
          <Activities
            activities={this.props.event.activities.map(
              key => this.props.activities[key]
            )}
            bufferzone={false}
            parentId={this.props.event.id}
            minimal
          />
        </div>
      </CardContent>
    )

    /** Creates a new event with modified information and sends it to eventReducer's editEvent method
     * @param event Click event that has to be forwarded to this function so it can be prevented
     */
    const changeInfo = event => {
      event.preventDefault()
      const moddedEvent = {
        id: this.props.event.id,
        title: this.props.event.title,
        startDate: this.props.event.startDate,
        endDate: this.props.event.endDate,
        startTime: this.props.event.startTime,
        endTime: this.props.event.endTime,
        type: this.props.event.type,
        information: event.target.children[2].value,
      }
      this.props.editEvent(moddedEvent)
      this.setState({ editMode: false })
    }
    /** Enables/disables edit mode, used in editButton */
    const renderEdit = () => {
      this.setState({ editMode: !this.state.editMode })
    }

    /** Returns a component with a form to input new information if editMode is true, otherwise returns the information in text form */

    const informationContainer = () => {
      if (this.state.editMode) {
        return (
          <form onSubmit={this.changeInfo}>
            <span>
              <b>Lisätiedot </b>
              <input
                type="submit"
                value="TALLENNA"
                align="top"
                className="information"
              />
              {editButton}
            </span>
            <br />
            <textarea defaultValue={information} rows="4" cols="80" />
          </form>
        )
      }
      return <p>{information}</p>
    }
    if (!this.props.event.kuksaEventId) {
      editButton = (
        <button onClick={this.renderEdit} className="information">
          {this.state.editMode ? 'PERUUTA' : 'MUOKKAA'}
        </button>
      )
    } else {
      editButton = ''
    }
    const expanded = (
      <CardContent>
        <div className="eventTimes">
          <span>{event.type} alkaa:</span>{' '}
          {moment(event.startDate)
            .locale('fi')
            .format('ddd D.M.YYYY')}{' '}
          kello {event.startTime.substring(0, 5)}
        </div>
        <div className="eventTimes">
          <span>{event.type} päättyy:</span>{' '}
          {moment(event.endDate)
            .locale('fi')
            .format('ddd D.M.YYYY')}{' '}
          kello {event.endTime.substring(0, 5)}
        </div>
        {this.state.editMode ? null : (
          <div>
            <b>Lisätiedot </b>
            {editButton}
          </div>
        )}
        <div> {informationContainer()} </div>
        <b>
          <Activities
            activities={this.props.event.activities.map(
              key => this.props.activities[key]
            )}
            bufferzone={false}
            parentId={this.props.event.id}
          />
        </b>
        <br style={{ clear: 'both' }} />{' '}
        {event.activities.map(key => {
          const activity = this.props.activities[key]
          if (activity) {
            return activity.plans.map(plan => (
              <div key={plan.id}>
                <SuggestionCard
                  plan={plan}
                  activity={activity}
                  event={this.props.event}
                />
              </div>
            ))
          }
        })}
      </CardContent>
    )
    return (
      <div className={cardClassName}>
        <Card style={{ boxShadow: 'none' }}>
          <ActivityDragAndDropTarget
            odd={odd}
            event
            bufferzone={false}
            parentId={this.props.event.id}
          >
            <CardHeader
              style={this.state.expanded ? {} : { paddingBottom: '5px' }}
              title={
                <div>
                  {title}
                  &nbsp;
                  {this.props.event.activities.length === 0 ? warning : ''}
                </div>
              }
              subheader={subtitle}
              titleTypographyProps={{
                classes: { root: 'event-card-title-left' },
                variant: 'title',
              }}
              subheaderTypographyProps={{
                classes: {
                  root: 'event-card-title-right event-card-subheader',
                },
                variant: 'subtitle2',
              }}
              action={
                <IconButton
                  onClick={this.handleExpandChange}
                  className={this.state.expanded ? 'arrow-up' : ''}
                >
                  <ExpandMoreIcon />
                </IconButton>
              }
            />
            {isTouchDevice() && !this.state.expanded
              ? touchDeviceNotExpanded
              : null}
            {!isTouchDevice() && !this.state.expanded ? notExpanded : null}
            {this.state.expanded ? expanded : null}

            <CardActions
              style={this.state.expanded ? {} : { paddingTop: '5px' }}
            >
              <EditEvent
                buttonClass="buttonRight"
                data={this.props.event}
                setNotification={this.props.setNotification}
                minimal={!this.state.expanded}
              />
              <DeleteEvent
                buttonClass="buttonRight"
                data={this.props.event}
                setNotification={this.props.setNotification}
                minimal={!this.state.expanded}
              />
            </CardActions>
          </ActivityDragAndDropTarget>
        </Card>
      </div>
    )
  }
}

EventCard.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  taskgroup: PropTypesSchema.taskgroupShape.isRequired,
  status: PropTypes.string.isRequired,
  plans: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  notify: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
  deleteActivityFromEvent: PropTypes.func.isRequired,
  bufferZoneInitialization: PropTypes.func.isRequired,
  addActivityToEventOnlyLocally: PropTypes.func.isRequired,
  deleteActivityFromEventOnlyLocally: PropTypes.func.isRequired,
  postActivityToBufferOnlyLocally: PropTypes.func.isRequired,
  deleteActivityFromBufferOnlyLocally: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
}

EventCard.defaultProps = {}

const mapStateToProps = state => ({
  events: state.events,
  buffer: state.buffer,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  status: state.statusMessage.status,
  plans: state.plans,
  activities: state.activities,
})

const mapDispatchToProps = {
  notify,
  editEvent,
  deletePlan,
  deleteActivityFromEvent,
  bufferZoneInitialization,
  addActivityToEventOnlyLocally,
  addActivity,
  deleteActivityFromEventOnlyLocally,
  postActivityToBufferOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  pofTreeUpdate,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCard)
