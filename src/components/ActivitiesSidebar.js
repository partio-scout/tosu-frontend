import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Drawer } from '@material-ui/core'

import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'

import PropTypesSchema from './PropTypesSchema'

const drawerWidth = 380

const styles = theme => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
      <div className={classes.toolbar} />
      <TreeSearchBar />
      <BufferZone />
      <Divider variant="middle" className={classes.divider} />
      <StatusMessage />
    </Drawer>
  )
}

ActivitiesSidebar.propTypes = {
  ...PropTypesSchema,
}

ActivitiesSidebar.defaultProps = {}

export default withStyles(styles)(ActivitiesSidebar)
