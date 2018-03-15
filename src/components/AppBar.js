import React from 'react';
import TopSearchBar from './TopSearchBar';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

export default class AppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  updateActivities = activity => {
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
          bufferZoneUpdater={this.props.bufferZoneUpdater}
          filteredActivities={this.props.filteredActivities}
          deleteFromBufferZone={this.props.deleteFromBufferZone}  
        />
      </div>
    )
  }
}

