import React from 'react';
import TopSearchBar from './TopSearchBar';
import filterOffExistingOnes from '../functions/searchBarFiltering';
import activityService from '../services/activities'
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

 
const Appbar = ({ activities, events, bufferactivities }) => {
  // Parametreina tulee vielä bufferzone drag and droppia varten
  console.log('acts appbar ', activities)
  const filteredActivities = filterOffExistingOnes(activities, events);

  // console.log(this.props.bufferactivities)
  return (
    <div className="top-search" style={{background: '#5DBCD2',    padding: 20}}>
      <TopSearchBar 
        dataSource={filteredActivities}
        bufferactivities={bufferactivities} 
        activities={activities} 
      />
    </div>
  );
};

export default Appbar;
