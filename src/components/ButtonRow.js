import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import { filterChange } from '../reducers/filterReducer'
import { viewChange } from '../reducers/viewReducer'

class ButtonRow extends React.Component {
  constructor(props) {
    super(props)
    const currentDate = moment()
    this.state = {
      startDate: currentDate,
      endDate: props.endDate
    }
  }

  selectView = (value) => () => {
    this.props.viewChange(value)
  }

  filterUpdate = () => {
    if (this.state.startDate && this.state.endDate) {
      this.filterSelected('RANGE')()
    }
    if (this.state.startDate && !this.state.endDate) {
      this.filterSelected('ONLY_START')()
    }
    if (!this.state.startDate && this.state.endDate) {
      this.filterSelected('ONLY_END')()
    }
  }

  filterSelected = (value) => () => {
    this.props.filterChange(value)
  }

  clearRange = () => {
    this.filterSelected('NONE')()
    this.setState({startDate: null, endDate: null})
    this.props.dateRangeUpdate({startDate: null, endDate: null})
  }

  dateRangeUpdate = ({startDate, endDate}) => {
    this.setState({startDate, endDate})
    this.props.dateRangeUpdate({startDate, endDate})
  }

  render() {
    return (
      <div>
        <div className="button-row" >
          <Button
            className={this.props.view === 'OWN' ? 'active' : ''}
            onClick={this.selectView('OWN')}
            variant="contained"
          >
            Omat
          </Button>
          &nbsp;
          <Button
            className={this.props.view === 'KUKSA' ? 'active' : ''}
            onClick={this.selectView('KUKSA')}
            variant="contained"
          >
            Kuksa
          </Button>
          &nbsp;
          <Button
            className={this.props.view === 'CALENDAR' ? 'active' : ''}
            onClick={this.selectView('CALENDAR')}
            variant="contained"
          >
            Kalenteri
          </Button>
          &nbsp;
          <Button onClick={this.props.newEvent} variant="contained">
            Uusi tapahtuma
          </Button>
          &nbsp;
        </div>
        <div className="date-range-container" style={this.props.view === 'CALENDAR' ? { display: 'none' } : {}}>
          Rajaa tapahtumia:
          <DateRangePicker
            startDateId="startDate"
            endDateId="endDate"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onDatesChange={this.dateRangeUpdate}
            focusedInput={this.state.focusedInput}
            onFocusChange={(focusedInput) => { this.setState({ focusedInput }) }}
            startDatePlaceholderText="alku pvm"
            endDatePlaceholderText="loppu pvm"
            isOutsideRange={() => false}
          />
          <Button
            className={this.props.filter !== 'NONE' ? '' : 'hidden'}
            onClick={this.clearRange}
            variant="contained"
          >
            Poista rajaus
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    view: state.view,
    filter: state.filter,
    startDate: state.startDate,
    endDate: state.endDate
  }
}

export default connect(mapStateToProps, {
  filterChange,
  viewChange
})(ButtonRow)