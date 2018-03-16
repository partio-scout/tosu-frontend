import React from 'react'
import matchSorter from 'match-sorter'
import Select from 'react-select'
import { connect } from 'react-redux'
import 'react-select/dist/react-select.css'
import { notify } from '../reducers/notificationReducer'
import { addActivityToEvent } from '../reducers/eventReducer'
import filterOffExistingOnes from '../functions/searchBarFiltering'

class ActivitySearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedActivity: null
    }
  }

  updateSelectedActivity = selectedActivity => {
    this.setState({
      selectedActivity
    })
  }

  saveActivityToEvent = async () => {
    const activity = {
      guid: this.state.selectedActivity.value
    }
    console.log('Update', activity);
    try {
      this.props.addActivityToEvent(this.props.event.id, activity)
      this.setState({ selectedActivity: null })
    } catch (exception) {
      this.props.notify(
        `Aktiviteetin lisäys epäonnistui. Saattaa olla jo lisätty tapahtumaan`,
        5000
      )
      console.error('Error in adding activity:', exception)
    }
  }

  handleChange = async selectedActivity => {
    await this.setState({ selectedActivity })
    this.saveActivityToEvent()
  }

  render() {
    const { selectedActivity } = this.state
    const value = selectedActivity && selectedActivity.value
    const filteredPofActivities = filterOffExistingOnes(
      this.props.pofActivities,
      this.props.events,
      this.props.buffer
    )
    return (
      <div>
        <Select
          name="form-field-name"
          value={value}
          onChange={this.handleChange}
          filterOptions={(options, filter) => {
            const sorterOptions = { keys: ['label'] }
            return matchSorter(options, filter, sorterOptions)
          }}
          options={filteredPofActivities.map(activity => {
            let obj = {}
            obj = { value: activity.guid, label: activity.title }
            return obj
          })}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    events: state.events,
    buffer: state.buffer,
    pofActivities: state.pofActivities
  }
}

export default connect(
  mapStateToProps,
  { notify, addActivityToEvent }
)(ActivitySearch)
