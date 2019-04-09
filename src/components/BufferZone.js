import { connect } from 'react-redux'
import React from 'react'
import { Typography, Button, withStyles } from '@material-ui/core'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import PropTypesSchema from './PropTypesSchema'

const styles = {
  bufferzone: {
    marginLeft: 14,
    marginRight: 14,
    display: 'flex',
    flexFlow: 'row wrap',
  },
}

export class BufferZone extends React.Component {
  /**
   * Clears the activities from the buffer
   */
  clear = async () => {
    if (this.props.buffer.activities) {
      const promises = this.props.buffer.activities.map(activity =>
        this.props.deleteActivityFromBuffer(activity.id)
      )
      try {
        await Promise.all(promises)
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
        this.props.notify('Aktiviteetit poistettu.', 'success')
      } catch (exception) {
        this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa.')
      }
    }
  }

  render() {
    const { classes } = this.props
    if (!this.props.buffer.id) {
      return <div />
    }
    if (this.props.buffer.activities.length === 0) {
      return <div />
    }
    return (
      <div className={classes.bufferzone}>
        <div style={{ width: '100%', padding: '0 4px 0', marginBottom: 10 }}>
          <Typography variant="h6" inline gutterBottom>
            Aktiviteetit
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={this.clear}
            style={{ float: 'right' }}
          >
            Tyhjennä
          </Button>
        </div>
        <ActivityDragAndDropTarget bufferzone parentId={this.props.buffer.id}>
          <div>
            <Activities
              activities={this.props.buffer.activities}
              bufferzone
              parentId={this.props.buffer.id}
            />
          </div>
        </ActivityDragAndDropTarget>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  buffer: state.buffer,
  events: state.events,
})

const mapDispatchToProps = {
  notify,
  pofTreeUpdate,
  deleteActivityFromBuffer,
}

BufferZone.propTypes = {
  ...PropTypesSchema,
}

BufferZone.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BufferZone))
