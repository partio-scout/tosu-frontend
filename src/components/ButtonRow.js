import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import PropTypes from 'prop-types'
import {
  Button,
  Icon,
  IconButton,
  withStyles,
  Typography,
} from '@material-ui/core'
import { viewChange } from '../reducers/uiReducer'
import { setLoading } from '../reducers/loadingReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

const styles = {
  button: {
    margin: 4,
    color: 'white',
  },
  dateRangeContainer: {
    marginTop: 5,
  },
  hidden: {
    display: 'none',
  },
}

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
    if (Object.entries(tosu) === 0) {
      return false
    } else if (!tosu.selected) {
      return false
    }
    return true
  }

  render() {
    const { startDate, endDate } = this.state
    const { ui, classes, tosuMap } = this.props

    return (
      <div>
        <div>
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
            id="kuksa"
            onClick={() => this.selectView('KUKSA')}
            variant="contained"
            color={ui.view === 'KUKSA' ? 'primary' : 'secondary'}
          >
            Kuksa
          </Button>
          <Button
            id="kalenteri"
            className={classes.button}
            onClick={() => this.selectView('CALENDAR')}
            variant="contained"
            color={ui.view === 'CALENDAR' ? 'primary' : 'secondary'}
          >
            Kalenteri
          </Button>
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
        </div>
        <div
          className={classes.dateRangeContainer}
          style={ui.view === 'CALENDAR' ? { display: 'none' } : {}}
        >
          <Typography inline style={{ margin: '0 10px 0 4px' }}>
            Rajaa tapahtumia
          </Typography>
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
          />
          <IconButton
            className={this.props.filter !== 'NONE' ? '' : classes.hidden}
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
  viewChange: PropTypes.func.isRequired,
  dateRangeUpdate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  newEvent: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  tosuMap: PropTypes.string.isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  scout: PropTypesSchema.scoutShape.isRequired,
  setLoading: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  ui: state.ui,
  filter: state.filter,
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
  setLoading,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ButtonRow))
