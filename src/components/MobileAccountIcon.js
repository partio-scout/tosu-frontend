import React from 'react'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { scoutLogin, scoutLogout } from '../reducers/scoutReducer'


class MobileAccountIcon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  forceMyOwnLogout = async response => {
    await this.props.scoutLogout()
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
      <div className="account-button">
        {this.props.scout.name.split(" ")[0]}
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    scout: state.scout,
    buffer: state.buffer
  }
}

export default connect(mapStateToProps, {
  scoutLogin,
  scoutLogout
})(MobileAccountIcon)