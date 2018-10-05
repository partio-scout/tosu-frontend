import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'


const drawerWidth = 500;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  }
});

function ClippedDrawer(props) {
  const { classes } = props;
  let showStatusBox = true;

  const handleOpen = () => {
    showStatusBox = true
  }

  const handleClose = () => {
    showStatusBox = false
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <StatusMessage
          showStatusBox={showStatusBox}
          handleClose={handleClose}
          handleOpen={handleOpen}
        />
        <TreeSearchBar />
        <BufferZone />
      </Drawer>
    </div>
  )
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClippedDrawer);