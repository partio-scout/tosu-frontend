import React from 'react';
import matchSorter from 'match-sorter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import eventService from '../services/events';

export default class ActivitySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      selectedActivity: null
    };
  }

  updateSelectedActivity = selectedActivity => {
    this.setState({
      selectedActivity
    });
  };

  saveActivityToEvent = async () => {
    const data = {
      guid: this.state.selectedActivity.value
    };

    try {
      const res = await eventService.addActivity(this.props.event.id, data);
      this.props.updateActivities(res);
      this.props.updateFilteredActivities();
      this.setState({ selectedActivity: null })
    } catch (exception) {
      this.props.setNotification('Aktiviteetin lisäys epäonnistui. Saattaa olla jo lisätty tapahtumaan')
      console.error('Error in adding activity:', exception);
    }
  }

  handleChange = async selectedActivity => {
    await this.setState({ selectedActivity });
    this.saveActivityToEvent()
  };

  render() {
    const { selectedActivity } = this.state;
    const value = selectedActivity && selectedActivity.value;
    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          onChange={this.handleChange}
          filterOptions={(options, filter) => {
            const sorterOptions = { keys: ['label'] };
            return matchSorter(options, filter, sorterOptions);
          }}
          options={this.state.dataSource.map(activity => {
            let obj = {};
            obj = { value: activity.guid, label: activity.title };
            return obj;
          })}
        />
      </div>
    );
  }
}
