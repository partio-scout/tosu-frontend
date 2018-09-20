import React from 'react'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch'
import TreeSearchBar from './TreeSearchBar'
import StatusMessage from './StatusMessage'
import GoogleButtons from './GoogleButtons'
import BufferZone from './BufferZone'

export default class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showStatusBox: true
    }
  }

  componentDidMount = () => {
    this.getHeight()
  }

  componentDidUpdate = () => {
    this.getHeight()
  }

  getHeight = () => {
    const bufferZoneHeight = document.getElementById('top-bar-header')
      .clientHeight
    this.props.setHeaderHeight(bufferZoneHeight)
  }

  handleOpen = () => {
    this.setState({ showStatusBox: true })
  }

  handleClose = () => {
    this.setState({ showStatusBox: false })
  }

  render() {
    return (
      <div className="top-search" id="top-bar-header">
        <div className="Header_root" id="header_root">
          <FormControlLabel
            control={
              <Switch
                className="toggle-elements"
                onClick={() => this.props.toggleTopBar()}
              />
            }
            label={
              this.props.headerVisible ? 'Piilota' : 'Suunnittelunäkymä'
              }
          />
          <GoogleButtons selfInfo={this.props.selfInfo} />
        </div>

        {this.props.headerVisible ? (
          <div>
            {this.state.showStatusBox ? (
              <div className="top-bar-left" style={{ width: '35%' }}>
                <StatusMessage
                  showStatusBox={this.state.showStatusBox}
                  handleClose={this.handleClose}
                  handleOpen={this.handleOpen}
                  getHeight={this.getHeight}
                />
              </div>
            ) : (
              <div className="top-bar-left" style={{ width: '5%' }}>
                <StatusMessage
                  showStatusBox={this.state.showStatusBox}
                  handleClose={this.handleClose}
                  handleOpen={this.handleOpen}
                  getHeight={this.getHeight}
                />
              </div>
            )}

            {this.state.showStatusBox ? (
              <div className="top-bar-right" style={{ width: '65%' }}>
                {' '}
                <TreeSearchBar getHeight={this.getHeight} />
                <div style={{ clear: 'both' }} />
                <BufferZone />
              </div>
            ) : (
              <div className="top-bar-right" style={{ width: '95%' }}>
                {' '}
                <TreeSearchBar getHeight={this.getHeight} />
                <div style={{ clear: 'both' }} />
                <BufferZone />
              </div>
            )}
            <div style={{ clear: 'both' }} />
          </div>
        ) : null}
      </div>
    )
  }
}
