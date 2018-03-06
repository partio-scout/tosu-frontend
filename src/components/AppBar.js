import React from 'react';
import TopSearchBar from './TopSearchBar';
import filterOffExistingOnes from '../functions/searchBarFiltering';
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const Appbar = ({ activities, events }) => {
  // Parametreina tulee vielä bufferzone drag and droppia varten

  const filteredActivities = filterOffExistingOnes(activities, events);
  return (
    <div className="top-search" style={{ background: '#5DBCD2', padding: 20 }}>
      <TopSearchBar dataSource={filteredActivities} />
    </div>
  );
};

export default Appbar;
