import React from 'react';
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
import { connect } from 'react-redux'
import { editEvent, deleteEvent, deleteEventGroup } from '../reducers/eventReducer'

class EventCard extends React.Component {
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
        return <Activity key={activity.id} act={act} activity={activity} />
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
    return (
      <Card
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
      >
        <CardHeader
          title={title}
          subtitle={subtitle}
          // subtitle="päivämäärät, alku ja loppu"
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
          <br />
          <ActivitySearch
            dataSource={this.props.pofActivities}
            event={this.props.event}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pofActivities: state.pofActivities,
    events: state.events
  }
}

export default connect(
  mapStateToProps,
  { editEvent, deleteEvent, deleteEventGroup }

)(EventCard)

