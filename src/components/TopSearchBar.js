import React from 'react';
import matchSorter from 'match-sorter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import BufferZone from './BufferZone'
import { default as TouchBackend } from 'react-dnd-touch-backend';
import DragDropContext from 'react-dnd/lib/DragDropContext';
import activityService from '../services/activities'


class TopSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: null
    };
  }

  handleChange = async selectedActivity => {
    await this.setState({ selectedActivity })
    if (this.state.selectedActivity) {
      const data = {
        guid: this.state.selectedActivity.value
      }
      try {
        activityService.addActivityToBufferZone(data)
      } catch (exception) {
        console.error(exception)
      }
    } 
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
          <BufferZone activities={this.props.activities} bufferactivities={this.props.bufferactivities} />
        </div>
      </div>
    );
  }
}

export default DragDropContext(TouchBackend)(TopSearchBar)