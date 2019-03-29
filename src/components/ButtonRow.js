import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import {
  Button,
  Icon,
  IconButton,
  withStyles,
  Typography,
} from '@material-ui/core'
import { viewChange } from '../reducers/uiReducer'
import PropTypesSchema from './PropTypesSchema'

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
    anchorEl: null,
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

  render() {
    const { startDate, endDate } = this.state
    const { ui, classes } = this.props

    return (
      <div>
        <div>
          <Button
            className={classes.button}
            onClick={() => this.selectView('OWN')}
            variant="contained"
            color={ui.view === 'OWN' ? 'primary' : 'secondary'}
          >
            Omat
          </Button>
          <Button
            className={classes.button}
            onClick={() => this.selectView('KUKSA')}
            variant="contained"
            color={ui.view === 'KUKSA' ? 'primary' : 'secondary'}
          >
            Kuksa
          </Button>
          <Button
            className={classes.button}
            onClick={() => this.selectView('CALENDAR')}
            variant="contained"
            color={ui.view === 'CALENDAR' ? 'primary' : 'secondary'}
          >
            Kalenteri
          </Button>
          <Button
            className={classes.button}
            onClick={this.props.newEvent}
            variant="contained"
            color="secondary"
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
  ...PropTypesSchema,
}

ButtonRow.defaultProps = {}

const mapStateToProps = state => ({
  ui: state.ui,
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
)(withStyles(styles)(ButtonRow))
