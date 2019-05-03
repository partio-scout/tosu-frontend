import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { setSideBar } from '../reducers/uiReducer'
import AccountIcon from './AccountIcon'
import PropTypes from 'prop-types'
import PropTypesSchema from '../utils/PropTypesSchema'
/** @module */
const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
    marginRight: theme.spacing.unit * 2,
  },
  menuButton: {
    marginLeft: theme.spacing.unit * -1,
    marginRight: theme.spacing.unit * 2,
  },
})
/**
 * Component for top level navigation
 * @param {Object} props
 * @param {Object} props.scout - user
 * @param {Object} props.tosu - action plan
 * @param {Boolean} props.loading - is the application loading
 * @param {Object} props.classes 
 */
function TopBar(props) {
  const { tosu, scout, loading, classes } = props
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          id="tosu_selection"
          className={classes.menuButton}
          onClick={() => props.setSideBar(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.grow}
          noWrap
        >
          {loading
            ? null
            : Object.entries(tosu).length === 0
            ? null
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
  scout: PropTypesSchema.scoutShape,
  loading: PropTypes.bool.isRequired,
  classes: PropTypesSchema.classesShape,
}

const mapStateToProps = state => ({
  tosu: state.tosu,
  scout: state.scout,
  loading: state.loading,
})

const mapDispatchToProps = {
  setSideBar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TopBar))
