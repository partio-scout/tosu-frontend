import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import isTouchDevice from 'is-touch-device'
import TreeSelect /* ,{ TreeNode, SHOW_PARENT } */ from 'rc-tree-select'
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
  withStyles,
  Tooltip,
  TextField,
} from '@material-ui/core'

import Warning from '@material-ui/icons/Warning'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment-with-locales-es6'
import { Parser } from 'html-to-react'
import Activities from './Activities'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import DeleteEvent from './DeleteEvent'
import EditEvent from './EditEvent'
import { getRootGroup } from '../functions/denormalizations'

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
import { addActivity } from '../reducers/activityReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

const styles = {
  activityHeader: {
    margin: 0,
    minHeight: 0,
    borderRadius: 8,
    display: 'flex',
    flexFlow: 'row wrap',
  },
  warning: {
    width: 15,
    height: 15,
    padding: 0,
    marginRight: 7,
    color: '#f14150',
  },
  arrowUp: {
    transform: 'rotate(180deg)',
  },
  boldedAttribute: {
    fontWeight: 'bold',
  },
  eventCardTitleLeft: {
    marginBottom: 'auto',
    float: 'left',
  },
  eventCardTitleRight: {
    marginTop: 3,
    float: 'right',
  },
  emptyEventCard: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#f14150',
    borderRadius: 4,
  },
  kuksaSyncedEventCard: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#63bcd1',
    borderRadius: 4,
  },
}

class EventCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      syncToKuksa: Boolean(props.event.synced), // Initial state of sync or no sync from backend
      syncDialogOpen: false,
      newPlans: false,
      information: props.event.information,
    }
    this.changeInfo = this.changeInfo.bind(this)
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if (oldProps.event.information !== newProps.event.information) {
      this.setState({ information: newProps.event.information })
    }
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
    }
    if (value.children) {
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

  /**
   * Creates a new event with modified information and sends it to
   * eventReducer's editEvent method.
   */
  changeInfo = async () => {
    const moddedEvent = {
      id: this.props.event.id,
      title: this.props.event.title,
      startDate: this.props.event.startDate,
      endDate: this.props.event.endDate,
      startTime: this.props.event.startTime,
      endTime: this.props.event.endTime,
      type: this.props.event.type,
      information: this.state.information,
      activities: this.props.event.activities,
    }
    this.props.editEvent(moddedEvent)
  }

  render() {
    const { event, odd, classes } = this.props

    const warning = (
      <Tooltip
        title="Tapahtumasta puuttuu aktiviteetti!"
        placement="right"
        disableFocusListener
      >
        <Warning className={classes.warning} />
      </Tooltip>
    )

    moment.locale('fi')
    const { title } = event
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D.M.YYYY')} ${event.startTime.substring(0, 5)}`
    let cardClassName = 'event-card-wrapper'
    if (event.activities.length === 0) {
      cardClassName = classes.emptyEventCard
    }
    // Prioritize kuksa sync color over emptiness warning color (warning icon still visible)
    if (event.synced) {
      cardClassName = classes.kuksaSyncedEventCard
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
        <Activities
          activities={event.activities.map(key => this.props.activities[key])}
          bufferzone={false}
          parentId={event.id}
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
      </CardContent>
    )
    const notExpanded = (
      <CardContent style={this.state.expanded ? {} : { padding: '3px 10px' }}>
        <div className={classes.activityHeader}>
          <Activities
            activities={event.activities.map(key => this.props.activities[key])}
            bufferzone={false}
            parentId={event.id}
            minimal
          />
        </div>
      </CardContent>
    )

    /**
     * Returns a component depending on if this is a Kuksa event
     * or a user created event.
     */
    const informationContainer = event.kuksaEventId ? (
      new Parser().parse(event.information)
    ) : (
      <form autoComplete="off">
        <TextField
          id="info-edit-area"
          label="Lisätiedot"
          fullWidth
          multiline
          margin="normal"
          variant="outlined"
          value={this.state.information}
          onChange={e =>
            this.setState({
              information: e.target.value,
            })
          }
        />
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={this.changeInfo}
        >
          PÄIVITÄ
        </Button>
      </form>
    )

    /**
     * Helper function to capitalize first letter of a string.
     * @param string - A string to capitalize
     */
    const capitalize = string =>
      string.charAt(0).toUpperCase() + string.slice(1)

    /**
     * Expanded information of an event.
     */
    const expanded = (
      <CardContent>
        <div>
          <span className={classes.boldedAttribute}>
            {capitalize(event.type)} alkaa:
          </span>{' '}
          {moment(event.startDate)
            .locale('fi')
            .format('ddd D.M.YYYY')}{' '}
          kello {event.startTime.substring(0, 5)}
        </div>
        <div>
          <span className={classes.boldedAttribute}>
            {capitalize(event.type)} päättyy:
          </span>{' '}
          {moment(event.endDate)
            .locale('fi')
            .format('ddd D.M.YYYY')}{' '}
          kello {event.endTime.substring(0, 5)}
        </div>
        {informationContainer}
        <br style={{ clear: 'both' }} />
        <Activities
          activities={event.activities.map(key => this.props.activities[key])}
          bufferzone={false}
          parentId={event.id}
        />
        <br style={{ clear: 'both' }} />
        {event.activities.map(key => {
          const activity = this.props.activities[key]
          if (activity) {
            return activity.plans.map(plan => (
              <div key={plan.id}>
                <SuggestionCard plan={plan} activity={activity} event={event} />
              </div>
            ))
          }
          return null
        })}
      </CardContent>
    )

    return (
      <div className={cardClassName}>
        <Card>
          <ActivityDragAndDropTarget
            odd={odd}
            event
            bufferzone={false}
            parentId={event.id}
          >
            <CardHeader
              title={
                <React.Fragment>
                  {title}
                  &nbsp;
                  {event.activities.length === 0 ? warning : null}
                </React.Fragment>
              }
              subheader={subtitle}
              titleTypographyProps={{
                classes: { root: classes.eventCardTitleLeft },
                variant: 'title',
              }}
              subheaderTypographyProps={{
                classes: { root: classes.eventCardTitleRight },
                variant: 'subtitle2',
              }}
              action={
                <IconButton
                  onClick={this.handleExpandChange}
                  className={this.state.expanded ? classes.arrowUp : ''}
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

            <CardActions>
              <EditEvent
                data={event}
                setNotification={this.props.setNotification}
                minimal={!this.state.expanded}
              />
              <DeleteEvent
                data={event}
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
)(withStyles(styles)(EventCard))
