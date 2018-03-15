import DragDropContext from 'react-dnd/lib/DragDropContext';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import React from 'react';
import matchSorter from 'match-sorter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import BufferZone from './BufferZone'
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
        const res = await activityService.addActivityToBufferZone(data)
        this.updateActivities(res)
        this.props.updateFilteredActivities()
        this.setState({ selectedActivity: null})
      } catch (exception) {
        console.error(exception)
      }
    }
  };

  updateActivities = activity => {
    this.props.bufferZoneUpdater(activity)
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
          options={this.props.activities.map(activity => {
            let obj = {};
            obj = { value: activity.guid, label: activity.title };
            return obj;
          })}
        />
        <div>
          <BufferZone
            activities={this.props.activities}
            bufferZoneActivities={this.props.bufferZoneActivities} 
            bufferZoneUpdater={this.props.bufferZoneUpdater}
            deleteFromBufferZone={this.props.deleteFromBufferZone}
          />
        </div>
      </div>
    );
  }
}

export default DragDropContext(TouchBackend)(TopSearchBar)