import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import AddIcon from '@material-ui/icons/Add'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CalendarToday from '@material-ui/icons/CalendarToday'
import PropTypes from 'prop-types'
import ListIcon from '@material-ui/icons/List'
import { normalize } from 'normalizr'
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import TosuDialog from './TosuDialog'
import { viewChange } from '../reducers/viewReducer'
import { selectTosu } from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { setLoading } from '../reducers/loadingReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import activityService from '../services/activities'
import eventService from '../services/events'
import PropTypesSchema from '../utils/PropTypesSchema'
import { eventSchema } from '../pofTreeSchema'
import tosuChange from '../functions/tosuChange'
class ButtonRow extends React.Component {
  constructor(props) {
    super(props)
    this.tosuDialog = React.createRef()
    this.state = {
      startDate: moment(),
      endDate: null,
      anchorEl: null,
    }
  }

  /**
   * Closes the Tosu select menu
   */
  handleTosuMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  /**
   * Closes the menu and dispatches 'Tosu view change' -action
   * @param tosuId - ID of the selected Tosu
   */
  handleTosuSelect = tosuId => {
    if (this.props.tosuMap.selected !== tosuId) {
      this.handleTosuSelectHelper(tosuId)
      this.tosuDialog.current.handleClose()
    }
  }


  handleTosuSelectHelper = async tosuId => {
    this.handleTosuMenuClose()
    const {
      setLoading,
      selectTosu,
      eventsInitialization,
      activityInitialization,
      pofTreeUpdate,
      activities,
      buffer,
    } = this.props
    tosuChange(
      tosuId,
      setLoading,
      selectTosu,
      eventsInitialization,
      activityInitialization,
      pofTreeUpdate,
      activities,
      buffer
    )
  }

  /**
   * Opens dialog to create new Tosu
   */
  openTosuDialog = () => {
    this.tosuDialog.current.handleOpen()
    this.handleTosuMenuClose()
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
    const { anchorEl, startDate, endDate } = this.state
    const { tosuMap } = this.props
    const calendarIcon = (
      <IconButton
        className={
          this.props.view === 'CALENDAR'
            ? 'active-mobile-button button'
            : 'mobile-button button'
        }
        onClick={() => this.selectView('CALENDAR')}
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
            id="omat"
            className={this.props.view === 'OWN' ? 'active button' : 'button'}
            onClick={() => this.selectView('OWN')}
            variant="contained"
            color="secondary"
          >
            Omat
          </Button>
          <Button
            id="kuksa"
            className={this.props.view === 'KUKSA' ? 'active button' : 'button'}
            onClick={() => this.selectView('KUKSA')}
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
              id="kalenteri"
              onClick={() => this.selectView('CALENDAR')}
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
              id="uusi-event"
              className="button"
              onClick={this.props.newEvent}
              variant="contained"
              color="secondary"
              disabled={!this.canCreateEvent(tosuMap)}
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
              id="tosu-button"
              className="button"
              onClick={e => this.setState({ anchorEl: e.currentTarget })}
              variant="contained"
              color="secondary"
              disabled={this.props.loading}
            >
              {/* Placeholder untill Tosus are loaded */
              this.props.loading
                ? 'Ladataan...'
                : Object.entries(tosuMap).length === 0
                ? 'Ei tosuja'
                : tosuMap[tosuMap.selected].name}
            </Button>
          )}
          <Menu
            id="tosu-menu"
            open={Boolean(anchorEl)}
            onClose={this.handleTosuMenuClose}
            anchorEl={anchorEl}
          >
            {Object.entries(this.props.tosuMap).map(([property, tosu]) =>
              property === 'selected' ? null : (
                <MenuItem
                  key={tosu.id}
                  selected={tosu.selected}
                  onClick={() => this.handleTosuSelect(tosu.id)}
                >
                  {tosu.name}
                </MenuItem>
              )
            )}
            <MenuItem onClick={this.openTosuDialog}>
              <ListItemText primary="UUSI" />
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
            </MenuItem>
          </Menu>
          <TosuDialog
            ref={this.tosuDialog}
            handleTosuSelect={this.handleTosuSelectHelper}
          />
        </div>
        <div
          className="date-range-container"
          style={this.props.view === 'CALENDAR' ? { display: 'none' } : {}}
        >
          Rajaa tapahtumia:
          <DateRangePicker
            startDateId="startDate"
            endDateId="endDate"
            startDate={startDate}
            endDate={endDate}
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
  mobile: PropTypes.bool.isRequired,
  viewChange: PropTypes.func.isRequired,
  selectTosu: PropTypes.func.isRequired,
  eventsInitialization: PropTypes.func.isRequired,
  activityInitialization: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
}

ButtonRow.defaultProps = {}

const mapStateToProps = state => ({
  view: state.view,
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
  selectTosu,
  eventsInitialization,
  activityInitialization,
  setLoading,
  pofTreeUpdate,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonRow)
