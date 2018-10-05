import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch'
import GoogleButtons from './GoogleButtons'

export default class AppBar extends React.Component {
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
        <GoogleButtons selfInfo={this.props.selfInfo} />
        <div className="Header_root" id="header_root">
          <FormControlLabel
            control={
              <Switch
                className="toggle-elements"
                onClick={this.toggleSideBar}
              />
            }
            label={
              this.state.sidebarVisible ? 'Piilota' : 'Suunnittelunäkymä'
            }
          />
        </div>
      </div>
    )
  }
}
