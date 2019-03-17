import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import Activity from './Activity'
import findActivity from '../functions/findActivity'
import convertToSimpleActivity from '../functions/activityConverter'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import {getTask} from '../functions/denormalizations'
import { deleteActivity } from '../reducers/activityReducer'

export class Activities extends React.Component {
  static propTypes = {
    buffer: PropTypes.shape({}).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    bufferzone: PropTypes.bool.isRequired,
    parentId: PropTypes.number.isRequired,
    notify: PropTypes.func.isRequired,
    pofTreeUpdate: PropTypes.func.isRequired,
    deleteActivityFromBuffer: PropTypes.func.isRequired,
    deleteActivityFromEvent: PropTypes.func.isRequired,
    minimal: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    pofTree: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }

  deleteActivity = async activity => {
    try {
      const deleteActivityFromParent = this.props.bufferzone
        ? this.props.deleteActivityFromBuffer
        : this.props.deleteActivityFromEvent
      deleteActivityFromParent(activity.id, activity.eventId)
      this.props.deleteActivity(activity)
      this.props.pofTreeUpdate(this.props.stateActivities)
      this.props.notify('Aktiviteetti poistettu!', 'success')
    } catch (exception) {
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
