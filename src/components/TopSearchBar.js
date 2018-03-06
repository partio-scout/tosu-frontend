import React from 'react';
import matchSorter from 'match-sorter';
import RaisedButton from 'material-ui/RaisedButton';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { API_ROOT } from '../api-config';

export default class TopSearchBar extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.dataSource)
    this.state = {
      selectedActivity: null
    };
  }

  handleChange = selectedActivity => {
    this.setState({ selectedActivity });
    console.log(`Selected: ${selectedActivity.label}`);
  };

  render() {
    const { selectedActivity } = this.state;
    const value = selectedActivity && selectedActivity.value;
    console.log(this.props.dataSource)
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
          options={this.props.dataSource.map(activity => {
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
            onClick={console.log('click')}
          />
        </div>
      </div>
    );
  }
}
