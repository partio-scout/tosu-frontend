import React from 'react';
import TopSearchBar from './TopSearchBar';
import filterOffExistingOnes from '../functions/searchBarFiltering';
import ActivitySearch from './SearchBar';
import BufferZone from './BufferZone'
import DragDropContext from 'react-dnd/lib/DragDropContext';
import { default as TouchBackend } from 'react-dnd-touch-backend';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

class AppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: null
    }
  }

  updateActivities = activity => {
    console.log('Update', activity);
    this.setState({
      bufferZoneActivities: this.state.bufferZoneActivities.concat(activity)
    })
  }

  // const filteredActivities = filterOffExistingOnes(activities, events);

  // console.log(this.props.bufferactivities)
  render() {
    return (
      <div className="top-search" style={{ background: '#5DBCD2', padding: 20 }}>
        <TopSearchBar
          activities={this.props.activities}
          bufferZoneActivities={this.props.bufferZoneActivities}
          updateFilteredActivities={this.props.updateFilteredActivities}
          bufferZoneUpdater={this.props.updateBufferZoneActivities}
          filteredActivities={this.props.filteredActivities}                    
        />
      </div>
    )
  }
}


export default DragDropContext(TouchBackend)(AppBar)
