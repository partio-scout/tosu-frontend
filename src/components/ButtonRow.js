import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import PropTypes from 'prop-types'
import { Button, Icon, IconButton, withStyles } from '@material-ui/core'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import AddIcon from '@material-ui/icons/Add'
import { viewChange } from '../reducers/uiReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

/** @module */

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    color: 'white',
  },
  iconButton: {
    backgroundColor: theme.palette.secondary.main,
  },
  iconButtonSelected: {
    backgroundColor: theme.palette.primary.main + ' !important',
  },
  dateRangeContainer: {
    marginTop: theme.spacing.unit,
  },
  hidden: {
    display: 'none',
  },
})

/**
 * Component for navigation in the app
 * @param {Object} props - check proptypes for further information
 */
class ButtonRow extends React.Component {
  state = {
    startDate: moment(),
    endDate: null,
  }

  /**
   * Changes the view to tab Omat/Kuksa/Kalenteri/Uusi tapahtuma
   * @param value new value
   */
  selectView = value => this.props.viewChange(value)

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

  canCreateEvent = tosu => {
    if (!tosu) return false
    if (Object.entries(tosu).length === 0) {
      return false
    } else if (!tosu.selected) {
      return false
    }
    return true
  }

  render() {
    const { startDate, endDate } = this.state
    const { ui, classes, tosuMap, mobile } = this.props

    return (
      <React.Fragment>
        <Button
          id="omat"
          className={classes.button}
          onClick={() => this.selectView('OWN')}
          variant="contained"
          color={ui.view === 'OWN' ? 'primary' : 'secondary'}
        >
          Omat
        </Button>
        <Button
          id="kuksa"
          className={classes.button}
          onClick={() => this.selectView('KUKSA')}
          variant="contained"
          color={ui.view === 'KUKSA' ? 'primary' : 'secondary'}
        >
          Kuksa
        </Button>

        {mobile ? (
          <IconButton
            className={
              classes.button +
              ' ' +
              (ui.view === 'CALENDAR'
                ? classes.iconButtonSelected
                : classes.iconButton)
            }
            onClick={() => this.selectView('CALENDAR')}
          >
            <CalendarIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            id="kalenteri"
            className={classes.button}
            onClick={() => this.selectView('CALENDAR')}
            variant="contained"
            color={ui.view === 'CALENDAR' ? 'primary' : 'secondary'}
          >
            Kalenteri
          </Button>
        )}

        {mobile ? (
          <IconButton
            className={classes.button + ' ' + classes.iconButton}
            onClick={this.props.newEvent}
            disabled={!this.canCreateEvent(tosuMap)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            id="uusi-event"
            className={classes.button}
            onClick={this.props.newEvent}
            variant="contained"
            color="secondary"
            disabled={!this.canCreateEvent(tosuMap)}
          >
            Uusi tapahtuma
          </Button>
        )}
        {ui.view === 'CALENDAR' ? null : (
          <DateRangePicker
            startDateId="startDate"
            endDateId="endDate"
            startDate={startDate}
            endDate={endDate}
            onDatesChange={this.dateRangeUpdate}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            startDatePlaceholderText="alku pvm"
            endDatePlaceholderText="loppu pvm"
            isOutsideRange={() => false}
            numberOfMonths={mobile ? 1 : 2}
            hideKeyboardShortcutsPanel
            showClearDates
            customCloseIcon={
              <IconButton color="primary" onClick={this.clearRange}>
                <Icon color="primary" fontSize="small">
                  clear
                </Icon>
              </IconButton>
            }
          />
        )}
      </React.Fragment>
    )
  }
}

ButtonRow.propTypes = {
  viewChange: PropTypes.func.isRequired,
  dateRangeUpdate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  newEvent: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  tosuMap: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  scout: PropTypesSchema.scoutShape.isRequired,
}

const mapStateToProps = state => ({
  ui: state.ui,
  startDate: state.startDate,
  endDate: state.endDate,
  tosuMap: state.tosu,
  activities: state.activities,
  buffer: state.buffer,
  scout: state.scout,
  loading: state.loading,
})

const mapDispatchToProps = {
  viewChange,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ButtonRow))
