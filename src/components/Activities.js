import { connect } from 'react-redux'
import React from 'react'
import Activity from './Activity'
import findActivity from '../functions/findActivity'
import convertToSimpleActivity from '../functions/activityConverter'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { getTask } from '../functions/denormalizations'
import { deleteActivity } from '../reducers/activityReducer'
import PropTypesSchema from './PropTypesSchema'

export class Activities extends React.Component {
  /**
   * Deletes a given activity and updates the pofTree
   * @param activity activity that is deleted
   */
  deleteActivity = async activity => {
    try {
      const deleteActivityFromParent = this.props.bufferzone
        ? this.props.deleteActivityFromBuffer
        : this.props.deleteActivityFromEvent
      await deleteActivityFromParent(activity.id, activity.eventId)
      this.props.deleteActivity(activity.id)
      this.props.pofTreeUpdate(this.props.stateActivities)
      this.props.notify('Aktiviteetti poistettu!', 'success')
    } catch (exception) {
      console.log(exception)
      this.props.notify(
        'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
      )
    }
  }

  render() {
    let rows = []
    if (this.props.activities) {
      rows = this.props.activities.map(activity => {
        const pofActivity = convertToSimpleActivity(
          getTask(activity.guid, this.props.pofTree)
        )
        return pofActivity === null ? (
          undefined
        ) : (
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
    return (
      <div>
        {rows.length > 0 && !this.props.minimal && <p>Aktiviteetit:</p>}
        <div className={this.props.className}>{rows}</div>
      </div>
    )
  }
}

Activities.propTypes = {
  ...PropTypesSchema,
}

Activities.defaultProps = {}

const mapStateToProps = state => ({
  buffer: state.buffer,
  events: state.events,
  pofTree: state.pofTree,
  stateActivities: state.activities,
})

const mapDispatchToProps = {
  notify,
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivityFromEvent,
  deleteActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activities)
