import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Drawer } from '@material-ui/core'

import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'
import ToolbarSpacer from './ToolbarSpacer'

const drawerWidth = 400

const styles = theme => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '14px 0',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: 14,
  },
})

function ActivitiesSidebar(props) {
  const { classes } = props

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <ToolbarSpacer />
      <TreeSearchBar />
      <BufferZone />
      <Divider variant="middle" className={classes.divider} />
      <StatusMessage />
    </Drawer>
  )
}

ActivitiesSidebar.defaultProps = {}

export default withStyles(styles)(ActivitiesSidebar)
