
import React from 'react';
import matchSorter from 'match-sorter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import filterOffExistingOnes from '../functions/searchBarFiltering';

class TopSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: null
    };
  }

  componentDidUpdate = () => {
    this.props.getHeight()
  }

  handleChange = async selectedActivity => {
    await this.setState({ selectedActivity })
    if (this.state.selectedActivity) {
      const data = {
        guid: this.state.selectedActivity.value
      }
      try {
        await this.props.postActivityToBuffer(data)
        this.setState({ selectedActivity: null })
        this.props.notify('Aktiviteetti lisätty!', 'success')
      } catch (Exception) {
        this.props.notify('Aktiviteettialue on täynnä!')
      }
    }
  };

  render() {
    const { selectedActivity } = this.state;
    const value = selectedActivity && selectedActivity.value;
    const filteredPofActivities = filterOffExistingOnes(
      this.props.pofActivities,
      this.props.events,
      this.props.buffer
    )
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
          options={filteredPofActivities.map(activity => {
            let obj = {};
            obj = { value: activity.guid, label: activity.title };
            return obj;
          })}
        />
        
        <div>
          <BufferZone />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    pofActivities: state.pofActivities,
    events: state.events,
    buffer: state.buffer
  }
}

export default connect(
  mapStateToProps,
  { notify, postActivityToBuffer }

)(TopSearchBar)

