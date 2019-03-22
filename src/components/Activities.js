import { connect } from 'react-redux'
import React from 'react'
import Activity from './Activity'
import findActivity from '../functions/findActivity'
import convertToSimpleActivity from '../functions/activityConverter'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import PropTypesSchema from './PropTypesSchema'

export class Activities extends React.Component {
<<<<<<< proptypes
  /** Deletes a given activity and updates the pofTree */
=======
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
  /**
   * Deletes a given activity and updates the pofTree
   * @param activity activity that is deleted
   */
>>>>>>> master
  deleteActivity = async activity => {
    try {
      const deleteActivity = this.props.bufferzone
        ? this.props.deleteActivityFromBuffer
        : this.props.deleteActivityFromEvent
      await deleteActivity(activity.id)
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
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
          findActivity(activity, this.props.pofTree)
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
})

export default connect(
  mapStateToProps,
  {
    notify,
    pofTreeUpdate,
    deleteActivityFromBuffer,
    deleteActivityFromEvent,
  }
)(Activities)
