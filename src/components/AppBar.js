import React from 'react'
import { connect } from 'react-redux'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch'
import AccountIcon from './AccountIcon'

class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarVisible: true
    }
  }

  toggleSideBar = () => {
    this.setState({sidebarVisible: !this.state.sidebarVisible})
    this.props.toggleSideBar()
  }

  render() {
    return (
      <div className="top-search" id="top-bar-header">
        <div className="account-name-and-button">
          {this.props.scout ? this.props.scout.name : "<no name>"}
          <AccountIcon />
        </div>
        <div className="Header_root" id="header_root">
          <FormControlLabel
            control={
              <Switch
                className="toggle-sidebar"
                checked={this.state.sidebarVisible}
                onClick={this.toggleSideBar}
                color="primary"
              />
            }
            label={
              this.state.sidebarVisible ? 'Piilota suunnittelunäkymä' : 'Näytä suunnittelunäkymä'
            }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    scout: state.scout,
  }
}

export default connect(mapStateToProps, {})(AppBar)
