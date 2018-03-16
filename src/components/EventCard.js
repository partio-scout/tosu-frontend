import { connect } from 'react-redux'
import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText
} from 'material-ui/Card';
import moment from 'moment-with-locales-es6';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ActivitySearch from './SearchBar';
import Activity from './Activity';
import EditEvent from './EditEvent';
import ItemTypes from '../ItemTypes'
import activityService from '../services/activities'
import { editEvent, deleteEvent, deleteEventGroup, deleteActivityFromEventOnlyLocally, addActivityToEventOnlyLocally } from '../reducers/eventReducer'
import { deleteActivityFromBufferOnlyLocally } from '../reducers/bufferZoneReducer'

const moveActivityFromBuffer = async (props, activityId, parentId, targetId) => {
  try {
    const res = await activityService.moveActivityFromBufferZoneToEvent(activityId, parentId, targetId)
    await props.addActivityToEventOnlyLocally(targetId, res)
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    return res
  } catch (exception) {
    return exception
  }
}

const moveActivityFromEvent = async (props, activityId, parentId, targetId) => {
  try {
    const res = await activityService.moveActivityFromEventToEvent(activityId, parentId, targetId)
    props.addActivityToEventOnlyLocally(targetId, res)
    props.deleteActivityFromEventOnlyLocally(activityId)
    return res
  } catch (exception) {
    return exception
  }
}

const EventCardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const targetId = props.event.id
    const { parentId } = item
    const activityId = item.id
    console.log(item)
    console.log(item.bufferzone)
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
    canDrop: monitor.canDrop()
  }
}

class EventCard extends React.Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      open: false
    };
  }



  handleExpandChange = expanded => {
    this.setState({ expanded });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
  };

  deleteEvent = async () => {
    try {
      this.props.deleteEvent(this.props.event.id)
      this.handleClose();
    } catch (exception) {
      console.error('Error in deleting event:', exception);
    }
  };

  deleteEventGroup = async () => {
    try {
      this.props.deleteEventGroup(this.props.event.groupId);
      this.handleClose();
    } catch (exception) {
      console.error('Error in deleting event:', exception);
    }
  };

  handleDelete = () => {
    this.handleOpen();
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    let rows
    if (this.props.event.activities) {
      rows = this.props.event.activities.map(activity => {
        const act = this.props.pofActivities.filter(a => a.guid === activity.guid);
        return <Activity parentId={this.props.event.id} parent={this} key={activity.id} act={act} activity={activity} delete={this.updateAfterDelete} />
      })
    }
    const { event } = this.props;

    moment.locale('fi');
    const title = this.state.expanded ? '' : event.title;
    const subtitle = this.state.expanded
      ? ''
      : `${moment(event.startDate, 'YYYY-MM-DD')
        .locale('fi')
        .format('ddd D. MMMM YYYY')} ${event.startTime}`;

    let actions = [];
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
      ];
    } else {
      actions = [
        <FlatButton label="Peruuta" primary onClick={this.handleClose} />,
        <FlatButton
          label="Poista tapahtuma"
          primary
          onClick={this.deleteEvent}
        />
      ];
    }
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div>
        <Card
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
        >
          <CardHeader
            title={title}
            subtitle={subtitle}
            actAsExpander
            showExpandableButton
          />
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
              {moment(event.startDate).format('D.M.YYYY')} kello {event.startTime}
            </p>
            <p className="eventTimes">
              <span>{event.type} päättyy:</span>{' '}
              {moment(event.endDate).format('D.M.YYYY')} kello {event.endTime}
            </p>
            <p>{event.information}</p>
            <p>Aktiviteetit:</p>
            {rows}
            <br style={{ clear: 'both' }} />
            <ActivitySearch
              dataSource={this.props.pofActivities}
              event={this.props.event}
              updateActivities={this.updateActivities}
              updateFilteredActivities={this.props.updateFilteredActivities}
            />
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pofActivities: state.pofActivities,
    events: state.events
  }
}

const DroppableEventCard = DropTarget(ItemTypes.ACTIVITY, EventCardTarget, collect)(EventCard)

export default connect(
  mapStateToProps,
  {
    editEvent,
    deleteEvent,
    deleteEventGroup,
    addActivityToEventOnlyLocally,
    deleteActivityFromEventOnlyLocally,
    deleteActivityFromBufferOnlyLocally
  }

)(DroppableEventCard)
