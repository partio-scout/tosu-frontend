import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'

import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'
import PropTypesSchema from './PropTypesSchema'

const styles = () => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
})

class ClippedDrawer extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  }

  state = { showStatusBox: true }
  /**
   * Renders statusbox visible
   */
  handleOpen = () => {
    this.setState({ showStatusBox: true })
  }
  /**
   * Hides statusbox
   */
  handleClose = () => {
    this.setState({ showStatusBox: false })
  }

  render() {
    const { classes } = this.props
    return (
      <div className="drawer-root">
        <Drawer variant="permanent" className="drawer-paper">
          <TreeSearchBar />
          <Divider variant="middle" className={classes.divider} />
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

ClippedDrawer.propTypes = {
  ...PropTypesSchema,
}

ClippedDrawer.defaultProps = {}

export default withStyles(styles)(ClippedDrawer)
