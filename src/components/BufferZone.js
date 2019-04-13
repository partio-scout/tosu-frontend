import { connect } from 'react-redux'
import React from 'react'
import { Typography, Button, withStyles } from '@material-ui/core'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import PropTypesSchema from '../utils/PropTypesSchema'
import PropTypes from 'prop-types'
import { deleteActivity } from '../reducers/activityReducer'

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
      let promises = this.props.buffer.activities.map(activity =>
        this.props.deleteActivityFromBuffer(activity)
      )
      promises = promises.concat(
        this.props.buffer.activities.map(activity =>
          this.props.deleteActivity(activity)
        )
      )
      try {
        await Promise.all(promises)
        this.props.pofTreeUpdate(this.props.activities)
        this.props.notify('Aktiviteetit poistettu!', 'success')
      } catch (exception) {
        console.log(exception)
        this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa!')
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
              activities={this.props.buffer.activities.map(
                id => this.props.activities[id]
              )}
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
  pofTree: state.pofTree,
  activities: state.activities,
})

const mapDispatchToProps = {
  notify,
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivity,
}

BufferZone.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  notify: PropTypes.func.isRequired,
  classes: PropTypesSchema.classesShape.isRequired,
}

BufferZone.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BufferZone))
