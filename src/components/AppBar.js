import React from 'react';
import AppBar from 'material-ui/AppBar';
import ActivitySearch from './SearchBar';
import { activitiesArray } from './Activities';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const Appbar = ({activities}) => (
  // Parametreina tulee vielä bufferzone drag and droppia varten

  <AppBar
    style={{position: "fixed", height: '70px'}}
    //title={<img id="title_image" src="partio_logo_cmyk_valkoinen.png" alt="partion logo" />}
    title={<ActivitySearch
    dataSource={activitiesArray(activities)} />}
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
);

export default Appbar;