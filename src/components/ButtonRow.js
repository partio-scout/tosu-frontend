import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton/IconButton'
import Icon from '@material-ui/core/Icon/Icon'
import { DateRangePicker } from 'react-dates'
import Add from '@material-ui/icons/Add'
import CalendarToday from '@material-ui/icons/CalendarToday'
import PropTypes from 'prop-types'
import moment from 'moment'
import { viewChange } from '../reducers/viewReducer'
import PropTypesSchema from './PropTypesSchema'

class ButtonRow extends React.Component {
  static propTypes = {
    viewChange: PropTypes.func.isRequired,
    dateRangeUpdate: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    newEvent: PropTypes.func.isRequired,
    mobile: PropTypes.bool.isRequired,
    filter: PropTypes.bool.isRequired,
  }

  state = {
    startDate: moment(),
    endDate: null,
  }
  /**
   * Changes the view to tab Omat/Kuksa/Kalenteri/Uusi tapahtuma
   * @param value new value
   */
  selectView = value => () => {
    this.props.viewChange(value)
  }
  /**
   * Clears the calendar daterange so that it shows all events
   */
  clearRange = () => {
    this.setState({ startDate: null, endDate: null })
    this.props.dateRangeUpdate({ startDate: null, endDate: null })
  }
  /**
   * Sets the calendar daterange with a new start and end value
   * @param startDate where to start
   * @param endDate where to end
   */
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

ButtonRow.propTypes = {
  ...PropTypesSchema,
}

ButtonRow.defaultProps = {}

const mapStateToProps = state => ({
  view: state.view,
  filter: state.filter,
  startDate: state.startDate,
  endDate: state.endDate,
})

const mapDispatchToProps = {
  viewChange,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonRow)
