import React from 'react'
import Toggle from 'material-ui/Toggle'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import TreeSearchBar from './TreeSearchBar'
import StatusMessage from './StatusMessage'
import GoogleButtons from './GoogleButtons'
import BufferZone from './BufferZone'

const styles = {
  toggle: {
    backgroundColor: '#5DBCD2'
  },
  labelStyle: {
    color: '#FFF',
    fontSize: '0.8rem'
  }
}

export default class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
  render() {
    return (
      <div
        className="top-search"
        id="top-bar-header"
        style={{ background: '#5DBCD2', padding: 1 }}
      >
        <div className="Header_root" id="header_root">
          <Toolbar style={styles.toggle}>
            <ToolbarGroup firstChild={true}>
              <Toggle
                label={
                  this.props.headerVisible ? 'Piilota' : 'Suunnittelunäkymä'
                }
                labelPosition="right"
                style={styles.toggle}
                onClick={() => this.props.toggleTopBar()}
                labelStyle={styles.labelStyle}
              />
            </ToolbarGroup>
            <ToolbarGroup>
              <GoogleButtons />
            </ToolbarGroup>
          </Toolbar>
        </div>

        {this.props.headerVisible ? (
          <div>
            <div className="top-bar-left">
              <TreeSearchBar getHeight={this.getHeight} />
              <div style={{ clear: 'both' }} />
              <StatusMessage />
            </div>
            <div className="top-bar-right">
              <BufferZone />
            </div>
            <div style={{ clear: 'both' }} />
          </div>
        ) : null}
      </div>
    )
  }
}
