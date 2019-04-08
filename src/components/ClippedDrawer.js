import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'
import PropTypesSchema from '../utils/PropTypesSchema'

const styles = () => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
})

class ClippedDrawer extends React.Component {
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
  classes: PropTypesSchema.classesShape.isRequired,
}

ClippedDrawer.defaultProps = {}

export default withStyles(styles)(ClippedDrawer)
