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
import activitiesArray from '../utils/NormalizeActivitiesData';
import Activity from './Activity';
import { API_ROOT } from '../api-config';

export default class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      open: false,
      activities: props.event.activities
    };
  }

  handleExpandChange = expanded => {
    this.setState({ expanded });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
  };

  updateActivities = activity => {
    console.log('Update', activity);
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
    const data = activitiesArray(this.props.fetchedActivities);

    const { event } = this.props;

    moment.locale('fi');
    const title = this.state.expanded ? '' : event.title;
    const subtitle = this.state.expanded
      ? ''
      : moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D. MMMM YYYY') +
        ' ' +
        event.startTime;

    let actions = [];
    if (event.groupId) {
      actions = [
        <FlatButton
          label="Peruuta"
          primary={true}
          onClick={this.handleClose}
        />,

        <FlatButton
          label="Poista tämä tapahtuma"
          primary={true}
          onClick={this.deleteEvent}
        />,
        <FlatButton
          label="Poista toistuvat tapahtumat"
          primary={true}
          onClick={this.deleteEventGroup}
        />
      ];
    } else {
      actions = [
        <FlatButton
          label="Peruuta"
          primary={true}
          onClick={this.handleClose}
        />,
        <FlatButton
          label="Poista tapahtuma"
          primary={true}
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
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardTitle title={event.title} subtitle="Lokaatio?" expandable={true} />
        <CardText expandable={true}>
          <FlatButton
            label="Muokkaa"
            secondary={true}
            className="buttonRight"
          />
          <FlatButton
            label="Poista"
            secondary={true}
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
          <Activity
            eventActivities={this.state.activities}
            dataSource={data}
            updateAfterDelete={this.updateAfterDelete}
          />
          <br />
          <ActivitySearch
            dataSource={data}
            event={this.props.event}
            updateActivities={this.updateActivities}
          />
          <CardActions>
            <FlatButton
              label="Sulje"
              primary={true}
              onClick={this.handleReduce}
              fullWidth={true}
            />
          </CardActions>
        </CardText>
      </Card>
    );
  }
}
