import React from 'react'
import { connect } from 'react-redux'
import { Switch, FormControlLabel } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { withStyles } from '@material-ui/core/styles'
import { showKuksaEvents, hideKuksaEvents } from '../reducers/calendarReducer'
import PropTypesSchema from './PropTypesSchema'

const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
})

class Toolbar extends React.Component {

  /**
   * Toggles whether kuksa events are shown
   */
  onSwitchChange = () => {
    if (this.props.switchState) {
      this.props.hideKuksaEvents()
    } else {
      this.props.showKuksaEvents()
    }
  }

  navigate = action => {
    this.props.onNavigate(action)
  }

  view = event => {
    this.props.onViewChange(event.target.value)
  }
  /**
   *  A selection menu that can change whether the events are shown in a month, week or day view.
   * @returns menu selector for calendar
   */
  viewNamesGroup() {
    const viewNames = this.props.views

    if (viewNames.length > 1) {
      return (
        <Select value={this.props.view} onChange={this.view}>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="day">Day</MenuItem>
        </Select>
      )
    }
    return ''
  }

  render() {
    const { messages, label, switchState, classes } = this.props
    return (
      <div style={{ marginBottom: 10 }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={this.navigate.bind(null, navigate.TODAY)}
        >
          Tänään
        </Button>
        <IconButton
          className={classes.button}
          color="primary"
          onClick={this.navigate.bind(null, navigate.PREVIOUS)}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          className={classes.button}
          color="primary"
          onClick={this.navigate.bind(null, navigate.NEXT)}
        >
          <ChevronRight />
        </IconButton>

        <span style={{ margin: '0 35px' }}>{label}</span>

        <FormControlLabel
          style={{ color: '00000', marginRight: 35 }}
          control={
            <Switch
              checked={switchState}
              onClick={this.onSwitchChange}
              color="primary"
            />
          }
          label="Näytä myös Kuksan tapahtumat"
        />

        <span className="rbc-btn-group">{this.viewNamesGroup(messages)}</span>
      </div>
    )
  }
}

Toolbar.propTypes = {
  ...PropTypesSchema,
}

Toolbar.defaultProps = {}

const mapStateToProps = state => ({
  switchState: state.calendar.showKuksa,
})

export default connect(
  mapStateToProps,
  {
    showKuksaEvents,
    hideKuksaEvents,
  }
)(withStyles(styles)(Toolbar))
