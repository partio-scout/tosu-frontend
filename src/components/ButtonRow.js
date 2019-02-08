import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { DateRangePicker } from 'react-dates'
import Add from '@material-ui/icons/Add'
import CalendarToday from '@material-ui/icons/CalendarToday'
import moment from 'moment'
import { filterChange } from '../reducers/filterReducer'
import { viewChange } from '../reducers/viewReducer'
import IconButton from '@material-ui/core/IconButton/IconButton'
import Icon from '@material-ui/core/Icon/Icon'
import PropTypes from 'prop-types'

class ButtonRow extends React.Component {
  static propTypes = {
    viewChange: PropTypes.func.isRequired,
    filterChange: PropTypes.func.isRequired,
    dateRangeUpdate: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    newEvent: PropTypes.func.isRequired,
    mobile: PropTypes.bool.isRequired,
  }
  state = {
    startDate: moment(),
    endDate: null,
  }

  selectView = value => () => {
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

  filterSelected = value => () => {
    this.props.filterChange(value)
  }

  clearRange = () => {
    this.filterSelected('NONE')()
    this.setState({ startDate: null, endDate: null })
    this.props.dateRangeUpdate({ startDate: null, endDate: null })
  }

  dateRangeUpdate = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate })
    this.props.dateRangeUpdate({ startDate, endDate })
  }

  render() {
    const calendarIcon = (
      <IconButton
        className={
          this.props.view === 'CALENDAR'
            ? 'active-mobile-button button'
            : 'mobile-button button'
        }
        onClick={this.selectView('CALENDAR')}
      >
        <CalendarToday />
      </IconButton>
    )
    const newEventIcon = (
      <IconButton
        className="mobile-button button"
        onClick={this.props.newEvent}
      >
        <Add />
      </IconButton>
    )
    return (
      <div>
        <div className="button-row">
          <Button
            className={this.props.view === 'OWN' ? 'active button' : 'button'}
            onClick={this.selectView('OWN')}
            variant="contained"
            color="secondary"
          >
            Omat
          </Button>
          <Button
            className={this.props.view === 'KUKSA' ? 'active button' : 'button'}
            onClick={this.selectView('KUKSA')}
            variant="contained"
            color="secondary"
          >
            Kuksa
          </Button>
          {this.props.mobile ? (
            calendarIcon
          ) : (
            <Button
              className={
                this.props.view === 'CALENDAR' ? 'active button' : 'button'
              }
              onClick={this.selectView('CALENDAR')}
              variant="contained"
              color="secondary"
            >
              Kalenteri
            </Button>
          )}
          {this.props.mobile ? (
            newEventIcon
          ) : (
            <Button
              onClick={this.props.newEvent}
              variant="contained"
              color="secondary"
            >
              Uusi tapahtuma
            </Button>
          )}
        </div>
        <div
          className="date-range-container"
          style={this.props.view === 'CALENDAR' ? { display: 'none' } : {}}
        >
          Rajaa tapahtumia:
          <DateRangePicker
            startDateId="startDate"
            endDateId="endDate"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onDatesChange={this.dateRangeUpdate}
            readOnly={true}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => {
              this.setState({ focusedInput })
            }}
            startDatePlaceholderText="alku pvm"
            endDatePlaceholderText="loppu pvm"
            isOutsideRange={() => false}
          />
          <IconButton
            className={this.props.filter !== 'NONE' ? '' : 'hidden'}
            color="primary"
            onClick={this.clearRange}
            style={{ marginLeft: 5 }}
          >
            <Icon color="primary">clear</Icon>
          </IconButton>
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
    endDate: state.endDate,
  }
}

export default connect(
  mapStateToProps,
  {
    filterChange,
    viewChange,
  }
)(ButtonRow)
