import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import PropTypes from 'prop-types'
import {
  Button,
  Icon,
  IconButton,
  withStyles,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'
import TosuDialog from './TosuDialog'
import { viewChange } from '../reducers/uiReducer'
import { selectTosu } from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { setLoading } from '../reducers/loadingReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import PropTypesSchema from '../utils/PropTypesSchema'
import tosuChange from '../functions/tosuChange'

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
    const { ui, classes, tosuMap } = this.props

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
          <Button
            id="tosu-button"
            className={classes.button}
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
  newEvent: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  tosuMap: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  scout: PropTypesSchema.scoutShape.isRequired,
  selectTosu: PropTypes.func.isRequired,
  eventsInitialization: PropTypes.func.isRequired,
  activityInitialization: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
}

ButtonRow.defaultProps = {
  endDate: undefined,
  startDate: undefined,
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
  selectTosu,
  eventsInitialization,
  activityInitialization,
  setLoading,
  pofTreeUpdate,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ButtonRow))
