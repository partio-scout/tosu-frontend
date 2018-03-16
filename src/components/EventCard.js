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
import eventService from '../services/events';
import eventgroupService from '../services/eventgroups';
import EditEvent from './EditEvent';
import ItemTypes from '../ItemTypes'
import activityService from '../services/activities'

const moveActivity = async (activityId, parentId, targetId) => {
  console.log('parent: ', parentId)
  console.log('target: ', targetId)
  console.log('id: ', activityId)
  const res = await activityService.moveActivityFromBufferZoneToActivity(activityId, parentId, targetId)
  console.log(res)
}

const EventCardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const targetId = props.event.id
    const { parentId } = item
    const activityId = item.id
    console.log('parent: ', parentId)
    console.log('target: ', targetId)
    console.log('id: ', activityId)
    moveActivity(activityId, parentId, targetId)
    /* console.log('item: ', item)
    console.log('props: ', props) */
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
      open: false,
      activities: props.event.activities
    }
  }

  

  handleExpandChange = expanded => {
    this.setState({ expanded });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
  };

  updateActivities = activity => {
    this.setState({
      activities: this.state.activities.concat(activity)
    });
  };

  updateAfterDelete = activity => {
    const index = this.state.activities.indexOf(activity);
    const activitiesAfterDelete = this.state.activities;
    activitiesAfterDelete.splice(index, 1);

    this.setState({
      activities: activitiesAfterDelete
    });
  };

  deleteEvent = async () => {
    try {
      await eventService.deleteEvent(this.props.event.id);
      this.handleClose();
    } catch (exception) {
      console.error('Error in deleting event:', exception);
    }
  };

  deleteEventGroup = async () => {
    try {
      await eventgroupService.deleteEventgroup(this.props.event.groupId);
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
    this.props.fetchEvents();
  };

  render() {
    let rows
    if (this.state.activities) {
      rows = this.state.activities.map(activity => {
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
            <br style={{clear: 'both'}} />
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
    pofActivities: state.pofActivities
  }
}

const DroppableEventCard = DropTarget(ItemTypes.ACTIVITY, EventCardTarget, collect)(EventCard)

export default connect(
  mapStateToProps,
  {}

)(DroppableEventCard)
