import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AccountIcon from './AccountIcon'
import PropTypesSchema from './PropTypesSchema'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

function TopBar(props) {
  const { scout, classes } = props
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Tosun nimi
          </Typography>
          <AccountIcon scout={scout} />
        </Toolbar>
      </AppBar>
    </div>
  )
}

AppBar.propTypes = {
  ...PropTypesSchema,
}

AppBar.defaultProps = {}

const mapStateToProps = state => ({
  scout: state.scout,
})

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(TopBar))
