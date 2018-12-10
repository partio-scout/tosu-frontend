import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider'
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    marginTop: '20px',
    marginBottom: '20px'
  }
});

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

  render(props) {
    const { classes } = this.props
    return (
      <div className='drawer-root'>
        <Drawer
          variant="permanent"
          className='drawer-paper'
        >
          <TreeSearchBar />
          <Divider variant={"middle"} className={classes.divider}/>
          <BufferZone />
          <StatusMessage
            showStatusBox={this.state.showStatusBox}
            handleClose={this.handleClose}
            handleOpen={this.handleOpen}
          />
        </Drawer>
      </div>
    )
  }
}

export default withStyles(styles)(ClippedDrawer)