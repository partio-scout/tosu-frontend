import { connect } from 'react-redux'
import React from 'react'
import Divider from '@material-ui/core/Divider/Divider'
import { withStyles } from '@material-ui/core/styles'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import PropTypesSchema from './PropTypesSchema'

/**
 * Determines the style used in the element
 * @param theme props that contains the styles
 */
const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 14,
  },
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
  bufferzone: {
    marginLeft: 14,
    marginRight: 14,
    minHeight: 60,
    minWidth: 200,
    borderRadius: 8,
    display: 'flex',
    flexFlow: 'row wrap',
  },
})

export class BufferZone extends React.Component {
  render() {
    const { classes } = this.props
    if (!this.props.buffer.id) {
      return <div />
    }
    if (this.props.buffer.activities.length === 0) {
      return <div />
    }
    return (
      <div>
        <ActivityDragAndDropTarget bufferzone parentId={this.props.buffer.id}>
          <div className={classes.bufferzone}>
            <Activities
              activities={this.props.buffer.activities}
              bufferzone
              parentId={this.props.buffer.id}
            />
          </div>
        </ActivityDragAndDropTarget>
        <Divider variant="middle" className={classes.divider} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  buffer: state.buffer,
})

BufferZone.propTypes = {
  ...PropTypesSchema,
}

BufferZone.defaultProps = {}

export default connect(mapStateToProps)(withStyles(styles)(BufferZone))
