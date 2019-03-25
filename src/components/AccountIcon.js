import React from 'react'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import { scoutLogout } from '../reducers/scoutReducer'
import { API_ROOT } from '../api-config'
import PropTypesSchema from './PropTypesSchema'

class AccountIcon extends React.Component {
  state = {
    anchorEl: null,
    accountIcon: this.props.accountIcon,
    mobileFeedback: this.props.mobileFeedback,
  }
  /**
   * Logs out the current user and redirects to the login page
   */
  forceMyOwnLogout = () => {
    this.props.scoutLogout()
    window.location = `${API_ROOT}/scouts/logout`
  }
  /**
   * Opens the user menu
   * @param event event that contains the user
   */
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }
  /**
   * Closes the user menu
   */
  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const open = Boolean(this.state.anchorEl)
    return (
      <span>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          {this.state.accountIcon}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          {this.state.mobileFeedback}
          <MenuItem onClick={this.forceMyOwnLogout}>Kirjaudu ulos</MenuItem>
        </Menu>
      </span>
    )
  }
}

AccountIcon.propTypes = {
  ...PropTypesSchema,
}

AccountIcon.defaultProps = {}

const mapStateToProps = state => ({
  scout: state.scout,
  buffer: state.buffer,
})

export default connect(
  mapStateToProps,
  {
    scoutLogout,
  }
)(AccountIcon)
