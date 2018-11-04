import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import Activity from './Activity'
import findActivity from '../functions/findActivity'
import convertToSimpleActivity from '../functions/activityConverter'
import { notify } from '../reducers/notificationReducer' 
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { postActivityToBufferOnlyLocally, deleteActivityFromBufferOnlyLocally, deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEvent,  deleteActivityFromEventOnlyLocally, addActivityToEventOnlyLocally } from '../reducers/eventReducer'




class ActivityWrapper extends React.Component { 
  static propTypes = {
    bufferzone: PropTypes.bool.isRequired,
    parentId: PropTypes.number.isRequired,
    

    notify: PropTypes.func.isRequired,
    deleteActivityFromEventOnlyLocally: PropTypes.func.isRequired,
    addActivityToEventOnlyLocally: PropTypes.func.isRequired,
    deleteActivityFromBufferOnlyLocally: PropTypes.func.isRequired,
    postActivityToBufferOnlyLocally: PropTypes.func.isRequired,
    pofTreeUpdate: PropTypes.func.isRequired,
    deleteActivityFromBuffer: PropTypes.func.isRequired,
    deleteActivityFromEvent: PropTypes.func.isRequired,
  }

  
  clear = async () => {
    if (this.props.activities){
      const promises = this.props.activities.map(activity =>
        this.props.deleteActivityFromBuffer(activity.id)
      )
      try {
        await Promise.all(promises)
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
        this.props.notify('Aktiviteetit poistettu!', 'success')
      } catch (exception) {
        this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa!')
      }
    }
  }

  deleteActivity = async activity => {
    if (this.props.bufferzone){
      try {
        await this.props.deleteActivityFromBuffer(activity.id)
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
        this.props.notify('Aktiviteetti poistettu!', 'success')
      } catch (exception) {
        this.props.notify(
          'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
        )
      }
    }else{
      try {
        await this.props.deleteActivityFromEvent(activity.id)
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
        this.props.notify('Aktiviteetti poistettu!', 'success')
      } catch (exception) {
        this.props.notify(
          'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
        )
      }
    }
  }

  render() {
    let rows=[]

    if (this.props.activities){
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
          />
        )
      })
    }
    return (<div>{rows}</div>)
  }
}

const mapStateToProps = state => {
  return {
    buffer: state.buffer,
    events: state.events,
    pofTree: state.pofTree 
  }
}


export default connect(mapStateToProps, {
  notify,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  postActivityToBufferOnlyLocally,
  pofTreeUpdate,
  deleteActivityFromBuffer,
  deleteActivityFromEvent,
})(ActivityWrapper)