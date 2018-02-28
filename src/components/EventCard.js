import React from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText
} from 'material-ui/Card';
import moment from 'moment-with-locales-es6';
import FlatButton from 'material-ui/FlatButton';
import ActivitySearch from './SearchBar';
import { activitiesArray } from './Activities';
import Activity from './Activity';

// import FontIcon from 'material-ui/FontIcon';
// import SvgIconFace from 'material-ui/svg-icons/action/face';

const styles = {
  chip: {
    margin: 4
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
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

  deleteEvent = () => {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events/${
        this.props.event.id
      }`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(res => res.json())
      .then(res => {
        this.props.fetchEvents();
      })
      .catch(error => console.error('Error in deleting single event:', error));
  };

  render() {
    const data = activitiesArray(this.props.fetchedActivities);

    const { event } = this.props;

    moment.locale('fr');
    const title = this.state.expanded ? '' : event.title;
    const subtitle = this.state.expanded
      ? ''
      : moment(event.startDate, 'YYYY-MM-DD')
          .locale('fi')
          .format('ddd D. MMMM YYYY') +
        ' ' +
        event.startTime;
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
            onClick={this.deleteEvent}
          />
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
          <p>Täällä haetaan aktiviteetteja ja lisätään niitä tapahtumaan</p>
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
