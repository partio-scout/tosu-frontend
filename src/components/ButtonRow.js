import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DateRangePicker } from 'react-dates'
import AddIcon from '@material-ui/icons/Add'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CalendarToday from '@material-ui/icons/CalendarToday'
import ListIcon from '@material-ui/icons/List'
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { viewChange } from '../reducers/viewReducer'
import { selectTosu } from '../reducers/tosuReducer'

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
    anchorEl: null,
    currentTosuID: null,
  }

  /**
   * Closes the menu and dispatches 'Tosu view change' -action
   * @param {String} tosuID - ID of the selected Tosu
   */
  handleTosuSelect = tosuID => {
    this.setState({ anchorEl: null })
    if (this.state.currentTosuID !== tosuID) {
      this.props.selectTosu(tosuID)
    }
  }

  /**
   * Changes the view to tab Omat/Kuksa/Kalenteri/Uusi tapahtuma
   * @param value new value
   */
  selectView = value => {
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
        <AddIcon />
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
              className="button"
              onClick={this.props.newEvent}
              variant="contained"
              color="secondary"
            >
              Uusi tapahtuma
            </Button>
          )}
          {this.props.mobile ? (
            <IconButton
              className="mobile-button button"
              onClick={e => this.setState({ anchorEl: e.currentTarget })}
            >
              <ListIcon />
            </IconButton>
          ) : (
            <Button
              className="button"
              onClick={e => this.setState({ anchorEl: e.currentTarget })}
              variant="contained"
              color="secondary"
            >
              Tosun nimi
            </Button>
          )}
          <Menu
            id="tosu-menu"
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            {this.props.tosuList.map(tosu => (
              <MenuItem
                key={tosu.id}
                selected={tosu.selected}
                onClick={this.handleTosuSelect(tosu.id)}
              >
                {tosu.name}
              </MenuItem>
            ))}
            <MenuItem onClick={this.createTosuDialog}>
              <ListItemText primary="UUSI" />
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
            </MenuItem>
          </Menu>
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

const mapStateToProps = state => ({
  view: state.view,
  filter: state.filter,
  startDate: state.startDate,
  endDate: state.endDate,
  tosuList: state.tosu,
})

const mapDispatchToProps = {
  viewChange,
  selectTosu,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonRow)
