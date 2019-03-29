import { connect } from 'react-redux'
import React from 'react'
import Activity from './Activity'
import findActivity from '../functions/findActivity'
import convertToSimpleActivity from '../functions/activityConverter'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  deleteActivityFromBuffer,
  deleteActivityFromBufferOnlyLocally,
} from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import PropTypesSchema from './PropTypesSchema'
import { Typography, Button } from '@material-ui/core'

export class Activities extends React.Component {
  /**
   * Deletes a given activity and updates the pofTree
   * @param activity activity that is deleted
   */
  deleteActivity = async activity => {
    try {
      const deleteActivity = this.props.bufferzone
        ? this.props.deleteActivityFromBuffer
        : this.props.deleteActivityFromEvent
      await deleteActivity(activity.id)
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
      this.props.notify('Aktiviteetti poistettu!', 'success')
    } catch (error) {
      console.log(error)
      this.props.notify(
        'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
      )
    }
  }

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
        {rows.length > 0 && !this.props.minimal && (
          <React.Fragment>
            <Typography variant="h6" inline gutterBottom>
              Aktiviteetit:
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
          </React.Fragment>
        )}
        <div>{rows}</div>
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
    deleteActivityFromBufferOnlyLocally,
  }
)(Activities)
