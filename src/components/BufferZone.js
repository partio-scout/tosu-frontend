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
        this.props.enqueueSnackbar('Aktiviteetit poistettu', { variant: 'info' })
      } catch (exception) {
        console.log(exception)
        this.props.enqueueSnackbar('Kaikkia aktiviteetteja ei voitu poistaa!', {
          variant: 'error',
        })
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
      <ActivityDragAndDropTarget
        bufferzone
        parentId={this.props.buffer.id}
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
            onClick={this.clear}
            style={{ float: 'right' }}
          >
            Tyhjennä
          </Button>
        </div>
        <Activities
          activities={this.props.buffer.activities.map(
            id => this.props.activities[id]
          )}
          bufferzone
          parentId={this.props.buffer.id}
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
