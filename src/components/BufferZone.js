import { connect } from 'react-redux'
import React from 'react'
import { Typography, Button, withStyles } from '@material-ui/core'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { withSnackbar } from 'notistack'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import PropTypesSchema from '../utils/PropTypesSchema'
import PropTypes from 'prop-types'
import { deleteActivity } from '../reducers/activityReducer'

const styles = {
  bufferZone: {
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 10,
    display: 'flex',
    flexFlow: 'row wrap',
  },
  bufferTitle: {
    width: '100%',
    marginBottom: 10,
  },
}
/**
 * Component for storing activities in buffer
 * @param {Object} props
 * @param {Object} props.buffer - buffer data structure from reducer
 * @param {Number[]} props.buffer.activities - list of the id's for the activities in the buffer
 * @param {Number} props.buffer.id - id for the buffer
 * @param {Object} props.activities - activity state information from reducer
 */
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
        this.props.enqueueSnackbar('Aktiviteetit poistettu', {
          variant: 'info',
        })
      } catch (exception) {
        console.log(exception)
        this.props.enqueueSnackbar('Kaikkia aktiviteetteja ei voitu poistaa!', {
          variant: 'error',
        })
      }
    }
  }

  render() {
    const { classes, buffer, activities } = this.props
    if (!buffer.id) {
      return <div />
    }

    return (
      <ActivityDragAndDropTarget
        bufferzone
        parentId={buffer.id}
        className={classes.bufferZone}
      >
        <div className={classes.bufferTitle}>
          <Typography variant="h6" inline gutterBottom>
            Aktiviteetit
          </Typography>
          {buffer.activities.length === 0 ? null : (
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={this.clear}
              style={{ float: 'right' }}
            >
              Tyhjennä
            </Button>
          )}
        </div>
        <Activities
          activities={buffer.activities.map(id => activities[id])}
          bufferzone
          parentId={buffer.id}
        />
      </ActivityDragAndDropTarget>
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
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivity,
}

BufferZone.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  classes: PropTypesSchema.classesShape.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(BufferZone)))
