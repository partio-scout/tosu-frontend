import React from 'react';
import ActivitySearch from './SearchBar';
import { activitiesArray } from './Activities';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const Appbar = ({ activities }) => (
  // Parametreina tulee vielä bufferzone drag and droppia varten

  <div className="top-search" style={{background: '#5DBCD2', padding: 20}}>
    <ActivitySearch dataSource={activitiesArray(activities)} />
  </div>
);

export default Appbar;
