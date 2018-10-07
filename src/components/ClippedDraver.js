import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'



class ClippedDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showStatusBox: true }
  }

  handleOpen = () => {
    this.setState({ showStatusBox: true })
  }

  handleClose = () => {
    this.setState({ showStatusBox: false })
  }

  render() {
    return (
      <div className='drawer-root'>
        <Drawer
          variant="permanent"
          className='drawer-paper'
        >
          <StatusMessage
            showStatusBox={this.state.showStatusBox}
            handleClose={this.handleClose}
            handleOpen={this.handleOpen}
          />
          <TreeSearchBar />
          <BufferZone />
        </Drawer>
      </div>
    )
  }
}

export default ClippedDrawer;