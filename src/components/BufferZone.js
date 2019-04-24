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
    padding: '0 4px',
    marginBottom: 10,
  },
}

function BufferZone(props) {
  const { buffer, activities, classes } = props

  /**
   * Clears the activities from the buffer
   */
  const clear = async () => {
    if (buffer.activities) {
      let promises = buffer.activities.map(activity =>
        props.deleteActivityFromBuffer(activity)
      )
      promises = promises.concat(
        buffer.activities.map(activity => props.deleteActivity(activity))
      )
      try {
        await Promise.all(promises)
        props.pofTreeUpdate(activities)
        props.enqueueSnackbar('Aktiviteetit poistettu', { variant: 'info' })
      } catch (exception) {
        console.log(exception)
        props.enqueueSnackbar('Kaikkia aktiviteetteja ei voitu poistaa!', {
          variant: 'error',
        })
      }
    }
  }

  if (!buffer.id || buffer.activities.length === 0) {
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
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={clear}
          style={{ float: 'right' }}
        >
          Tyhjennä
        </Button>
      </div>
      <Activities
        activities={buffer.activities.map(id => activities[id])}
        bufferzone
        parentId={buffer.id}
      />
    </ActivityDragAndDropTarget>
  )
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
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
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
