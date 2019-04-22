import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import { setSideBar } from '../reducers/uiReducer'
import AccountIcon from './AccountIcon'
import PropTypes from 'prop-types'
import PropTypesSchema from '../utils/PropTypesSchema'

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
})

function TopBar(props) {
  const { tosu, scout, classes } = props
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Menu"
          className={classes.menuButton}
          onClick={() => props.setSideBar(!props.ui.sideBarVisible)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          {/* Placeholder untill Tosus are loaded or if there is none */
          Object.entries(tosu).length === 0
            ? 'Toiminnansuunnittelusovellus'
            : tosu[tosu.selected].name}
        </Typography>
        <div id="scout-name">
          <AccountIcon scout={scout} />
        </div>
      </Toolbar>
    </AppBar>
  )
}

AppBar.propTypes = {
  toggleSideBar: PropTypes.func.isRequired,
  scout: PropTypesSchema.scoutShape,
  classes: PropTypesSchema.classesShape,
}

AppBar.defaultProps = {}

const mapStateToProps = state => ({
  tosu: state.tosu,
  scout: state.scout,
  ui: state.ui,
})

const mapDispatchToProps = {
  setSideBar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopBar))
