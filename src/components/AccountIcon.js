import React from 'react'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import PropTypes from 'prop-types'
import { scoutLogout } from '../reducers/scoutReducer'
import { API_ROOT } from '../api-config'

class AccountIcon extends React.Component {
  state = { anchorEl: null }

  forceMyOwnLogout = async () => {
    await this.props.scoutLogout()
    window.location = `${API_ROOT}/scouts/logout`
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

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
          <AccountCircle />
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
          <MenuItem onClick={this.forceMyOwnLogout}>Kirjaudu ulos</MenuItem>
        </Menu>
      </span>
    )
  }
}

AccountIcon.propTypes = {
  scoutLogout: PropTypes.func.isRequired,
}

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
