
import React from 'react';
import matchSorter from 'match-sorter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import BufferZone from './BufferZone'
import activityService from '../services/activities'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { pofInitialization } from '../reducers/pofActivityReducer'
import filterOffExistingOnes from '../functions/searchBarFiltering';

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
    //    this.updateActivities(res)    reduuuux
     //   this.props.updateFilteredActivities()
        this.setState({ selectedActivity: null})
      } catch (exception) {
        console.error(exception)
      }
    }
  };

  updateActivities = activity => {
  //  this.props.bufferZoneUpdater(activity)
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
          options={filterOffExistingOnes(this.props.pofActivities, this.props.events, this.props.bufferZoneActivities).map(activity => {
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


const mapStateToProps = (state) => {
  return {
    pofActivities: state.pofActivities
  }
}

export default connect(
  mapStateToProps,
  { notify, pofInitialization }

)(TopSearchBar)

