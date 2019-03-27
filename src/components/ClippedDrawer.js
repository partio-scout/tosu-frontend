import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Drawer, Divider } from '@material-ui/core'

import { setSideBar } from '../reducers/uiReducer'
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'

import PropTypesSchema from './PropTypesSchema'

const drawerWidth = 400

const styles = theme => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
})

function ClippedDrawer(props) {
  const { classes } = props

  return (
    <Drawer
      open={props.ui.sideBarVisible}
      variant="persistent"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.toolbar} />
      <TreeSearchBar />
      <Divider variant="middle" className={classes.divider} />
      <BufferZone />
      <StatusMessage />
    </Drawer>
  )
}

ClippedDrawer.propTypes = {
  ...PropTypesSchema,
}

ClippedDrawer.defaultProps = {}

const mapStateToProps = state => ({
  ui: state.ui,
})

const mapDispatchToProps = {
  setSideBar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ClippedDrawer))
