import React from 'react';
import AppBar from 'material-ui/AppBar';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const Appbar = () => (
  <AppBar
    style={{position: "fixed"}}
    title="Partio"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
);

export default Appbar;