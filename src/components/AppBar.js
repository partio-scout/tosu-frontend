import React from 'react'
import { connect } from 'react-redux'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import AccountIcon from './AccountIcon'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
const styles = theme => ({
  label: {
    color: 'white',
  },
})

class AppBar extends React.Component {
  static propTypes = {
    toggleSideBar: PropTypes.func.isRequired,
    scout: PropTypes.object.isRequired,
  }
  state = { sidebarVisible: true }

  toggleSideBar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
    this.props.toggleSideBar()
  }

  render(props) {
    const { classes } = this.props
    return (
      <div className="top-search" id="top-bar-header">
        <div className="account-name-and-button">
          {this.props.scout ? this.props.scout.name : '<no name>'}
          <AccountIcon />
        </div>
        <div className="Header_root" id="header_root">
          <FormControlLabel
            classes={{
              label: classes.label,
            }}
            control={
              <Switch
                className="toggle-sidebar"
                checked={this.state.sidebarVisible}
                onClick={this.toggleSideBar}
                color="secondary"
              />
            }
            label={
              this.state.sidebarVisible
                ? 'Piilota suunnittelunäkymä'
                : 'Näytä suunnittelunäkymä'
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

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(AppBar))
