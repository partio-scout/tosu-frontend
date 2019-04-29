import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import Activity from './Activity'
import convertToSimpleActivity from '../functions/activityConverter'
import activityService from '../services/activities'
import { pofTreeUpdate, enableActivity } from '../reducers/pofTreeReducer'
import { withSnackbar } from 'notistack'
import {
  deleteActivityFromBuffer,
  postActivityToBuffer,
} from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { getTask } from '../functions/denormalizations'
import { deleteActivity, updateActivity } from '../reducers/activityReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

export class Activities extends React.Component {
  /**
   * Deletes a given activity and updates the pofTree
   * @param activity activity that is deleted
   */
  deleteActivity = async activity => {
    try {
      if (this.props.bufferzone) {
        this.props.deleteActivityFromBuffer(activity.id)
        this.props.updateActivity({ ...activity, activityBufferId: null })
        await this.props.deleteActivity(activity.id)
        this.props.enableActivity(activity.guid)
      } else {
        this.props.deleteActivityFromEvent(activity.id, activity.eventId)
        this.props.postActivityToBuffer(activity)
        const res = await activityService.moveActivityFromEventToBufferZone(
          activity.id,
          activity.eventId
        )
        this.props.updateActivity(res)
      }
      this.props.enqueueSnackbar('Aktiviteetti poistettu', { variant: 'info' })
    } catch (exception) {
      this.props.enqueueSnackbar('Aktiviteetin poistossa tapahtui virhe!', {
        variant: 'error',
      })
    }
  }

  render() {
    let rows = []
    if (this.props.activities) {
      rows = this.props.activities.map(activity => {
        const pofActivity = convertToSimpleActivity(
          getTask(activity.guid, this.props.pofTree)
        )
        return pofActivity === null ? null : (
          <Activity
            deleteActivity={this.deleteActivity}
            bufferzone={this.props.bufferzone}
            parentId={this.props.parentId}
            key={activity.id}
            pofActivity={pofActivity}
            activity={activity}
            minimal={this.props.minimal}
          />
        )
      })
    }
    return <div style={{ margin: -2 }}>{rows}</div>
  }
}

Activities.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.object.isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  stateActivities: PropTypes.object.isRequired,
  bufferzone: PropTypes.bool.isRequired,
  parentId: PropTypes.number.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  deleteActivityFromEvent: PropTypes.func.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  minimal: PropTypes.bool,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
}

Activities.defaultProps = {
  minimal: false,
}

const mapStateToProps = state => ({
  buffer: state.buffer,
  events: state.events,
  pofTree: state.pofTree,
  stateActivities: state.activities,
})

const mapDispatchToProps = {
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivityFromEvent,
  deleteActivity,
  postActivityToBuffer,
  updateActivity,
  enableActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(Activities))
