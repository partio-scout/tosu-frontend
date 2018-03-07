import React from 'react';
import matchSorter from 'match-sorter';
import RaisedButton from 'material-ui/RaisedButton';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import BufferZone from './BufferZone'
import { default as TouchBackend } from 'react-dnd-touch-backend';
import DragDropContext from 'react-dnd/lib/DragDropContext';


class TopSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: null
    };
  }

  handleChange = selectedActivity => {
    this.setState({ selectedActivity });
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
          options={this.props.dataSource.map(activity => {
            let obj = {};
            obj = { value: activity.guid, label: activity.title };
            return obj;
          })}
        />
        <div>
          {/* <p>
            {' '}
            Valittu aktiviteetti:{' '}
            {this.state.selectedActivity
              ? this.state.selectedActivity.label
              : 'Ei valittu'}
          </p> */}
          <RaisedButton
            label="Tallenna aktiviteetti"
            primary
            onClick={() => console.log('click')}
          />
          <BufferZone />
        </div>
      </div>
    );
  }
}

export default DragDropContext(TouchBackend)(TopSearchBar)