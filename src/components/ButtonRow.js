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
import PropTypesSchema from './PropTypesSchema'
import { eventSchema } from '../pofTreeSchema'

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
  handleTosuSelect = async tosuId => {
    this.handleTosuMenuClose()
    if (this.props.tosuMap.selected !== tosuId) {
      this.props.setLoading(true)
      this.props.selectTosu(tosuId)
      this.props.eventsInitialization({})
      const eventDataRaw = await eventService.getAll(tosuId)
      const eventData = normalize(eventDataRaw, eventSchema).entities
      if (!eventData.activities) eventData.activities = {}
      if (!eventData.events) eventData.events = {}
      const buffer = await activityService.getBufferZoneActivities(
        this.props.scout.id
      )
      this.props.activityInitialization(
        Object.keys(eventData.activities).map(key => eventData.activities[key]),
        buffer.activities
      )
      this.props.eventsInitialization(eventData.events)
      this.props.pofTreeUpdate(this.props.activities)
      this.props.setLoading(false)
    }
  }

  /**
   * Opens dialog to create new Tosu
   */
  openTosuDialog = () => {
    console.log(this.tosuDialog)
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

  render() {
    const { anchorEl, startDate, endDate } = this.state
    const { tosuMap } = this.props
    console.log(this.tosuDialog)
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
            className={this.props.view === 'OWN' ? 'active button' : 'button'}
            onClick={() => this.selectView('OWN')}
            variant="contained"
            color="secondary"
          >
            Omat
          </Button>
          <Button
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
              {/* Placeholder untill Tosus are loaded */
              Object.entries(tosuMap).length === 0
                ? 'Ladataan...'
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
          <TosuDialog ref={this.tosuDialog} />
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
  ...PropTypesSchema,
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
