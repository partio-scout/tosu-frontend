import React from 'react';
import matchSorter from 'match-sorter';
import RaisedButton from 'material-ui/RaisedButton';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { API_ROOT } from '../api-config';

export default class ActivitySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     dataSource: this.props.dataSource,
      selectedActivity: null
    };
  }

  updateSelectedActivity = selectedActivity => {
    console.log('Update selected activity', selectedActivity);
    this.setState({
      selectedActivity
    });
  };

  saveActivityToEvent = () => {
    if (this.state.selectedActivity) {
      const data = {
        guid: this.state.selectedActivity.value
      };

      console.log('Tallenna aktiviteetti', data);

      fetch(`${API_ROOT}/events/${this.props.event.id}/activities`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
        .then(res => res.json())
        .then(res => this.props.updateActivities(res))
        .then(
          this.setState({
            selectedActivity: null
          })
        )
        .catch(error => console.error('Error:', error));
    } else {
      console.log('Ei valittua aktiviteettia');
    }
  };

  handleChange = selectedActivity => {
    this.setState({ selectedActivity });
    console.log(`Selected: ${selectedActivity.label}`);
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
        <div>
          <p>
            {' '}
            Valittu aktiviteetti:{' '}
            {this.state.selectedActivity
              ? this.state.selectedActivity.label
              : 'Ei valittu'}
          </p>
          <RaisedButton
            label="Tallenna aktiviteetti"
            primary={true}
            onClick={this.saveActivityToEvent}
          />
        </div>
      </div>
    );
  }
}
