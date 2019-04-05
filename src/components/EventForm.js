import React from 'react'
import moment from 'moment'
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  IconButton,
  Icon,
} from '@material-ui/core/'
import {
  TextValidator,
  ValidatorForm,
  SelectValidator,
} from 'react-material-ui-form-validator'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import ValidatedDatePicker from '../utils/ValidatedDatePicker'
import ValidatedTimePicker from '../utils/ValidatedTimePicker'
import FrequentEventsHandler from '../utils/FrequentEventsHandler'
import repeatCount from '../utils/repeatCount'
import PropTypesSchema from './PropTypesSchema'

export default class EventForm extends React.Component {
  state = {
    title: this.props.data.title,
    startDate: this.props.data.startDate,
    startTime: this.props.data.startTime,
    endDate: this.props.data.endDate,
    endTime: this.props.data.endTime,
    checked: false,
    repeatCount: 2,
    repeatFrequency: 2,
    lastDate: this.props.data.lastDate,
    type: this.props.data.type,
    information: this.props.data.information,
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('dateIsLater', value => {
      if (!value || !this.state.startDate) {
        return false
      }
      if (
        value.setHours(0, 0, 0, 0) < this.state.startDate.setHours(0, 0, 0, 0)
      ) {
        return false
      }
      return true
    })

    ValidatorForm.addValidationRule('timeIsLater', value => {
      if (
        !this.state.startDate ||
        !this.state.endDate ||
        !this.state.startTime
      ) {
        return false
      }
      if (
        this.state.startDate.setHours(0, 0, 0, 0) ===
          this.state.endDate.setHours(0, 0, 0, 0) &&
        moment(value).format('HH:mm') <
          moment(this.state.startTime).format('HH:mm')
      ) {
        return false
      }
      return true
    })
  }

  handleNewEventFormChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  /**
   * Converts moment-object to Date
   * @param date date in moment form
   */
  handleStartDate = date => {
    this.setState({
      startDate: date.toDate(),
      endDate: date.toDate(),
    })
    this.countDate(
      date.toDate(),
      this.state.repeatFrequency,
      this.state.repeatCount
    )
  }

  handleStartTime = date => {
    this.setState({
      startTime: date.toDate(),
      endTime: new Date(moment(date).add(1, 'h')),
    })
  }

  handleEndDate = date => {
    this.setState({
      endDate: new Date(date),
    })
  }

  handleEndTime = date => {
    this.setState({
      endTime: date.toDate(),
    })
  }

  updateCheck() {
    this.setState(oldState => ({
      checked: !oldState.checked,
    }))
  }

  handleRepeatCount = event => {
    this.setState({
      repeatCount: event.target.value,
    })
    this.countDate(
      this.state.startDate,
      this.state.repeatFrequency,
      event.target.value)
  }

  handleFrequency = event => {
    this.setState({
      repeatFrequency: event.target.value,
    })
    this.countDate(
      this.state.startDate,
      event.target.value,
      this.state.repeatCount
    )
  }

  handleLastDate = date => {
    this.setState({
      lastDate: date.toDate(),
    })
    this.countRepeatCount(
      this.state.startDate,
      this.state.repeatFrequency,
      date.toDate())
  }

  handleTitle = event => {
    this.setState({
      title: event.target.value,
    })
  }

  handleType = event => {
    this.setState({
      type: event.target.value,
    })
  }

  handleInformation = event => {
    this.setState({
      information: event.target.value,
    })
  }

  countRepeatCount(startDate, repeatFrequency, lastDate) {
    let newRepeatCount = repeatCount(
      startDate,
      repeatFrequency,
      lastDate)
    if (isNaN(newRepeatCount)) {
      newRepeatCount = 1
    }
    this.setState({
      repeatCount: newRepeatCount
    })
  }

  countDate(startDate, repeatFrequency, repeatCount) {
    let newDate = FrequentEventsHandler(
    startDate,
    repeatFrequency,
    repeatCount).format('YYYY-MM-DD')
    if (repeatFrequency === 1) {
      this.setState({
        lastDate: moment(newDate).add(-1, 'days').toDate()
      })
    }
    if (repeatFrequency === 2) {
      this.setState({
        lastDate: moment(newDate).add(-1, 'weeks').toDate()
      })
    }
    if (repeatFrequency === 3) {
      this.setState({
        lastDate: moment(newDate).add(-1 * 14, 'weeks').toDate()
      })
    }
    if (repeatFrequency === 4) {
      this.setState({
        lastDate: moment(newDate).add(-1, 'months').toDate()
      })
    }
  }

  send = async () => {
    await this.props.update(
      this.state.title,
      this.state.startDate,
      this.state.startTime,
      this.state.endDate,
      this.state.endTime,
      this.state.checked,
      this.state.repeatCount,
      this.state.repeatFrequency,
      this.state.lastDate,
      this.state.type,
      this.state.information
    )

    this.props.submitFunction()
  }

  render() {
    const actions = (
      <div>
        <Button variant="contained" type="submit" color="primary">
          Tallenna
        </Button>
      </div>
    )

    const frequentStyle = { display: this.state.checked ? '' : 'none' }

    return (
      <div>
        <IconButton
          style={{
            marginRight: 0,
            marginTop: -100,
            marginBottom: 0,
            float: 'right',
          }}
          onClick={this.props.close}
        >
          <Icon color="primary">clear</Icon>
        </IconButton>
        <ValidatorForm ref="form" onSubmit={this.send}>
          <TextValidator
            label="Tapahtuman nimi"
            name="title"
            value={this.state.title}
            onChange={this.handleNewEventFormChange}
            validators={['required']}
            errorMessages={['Tapahtuman nimi vaaditaan']}
            fullWidth
            margin="normal"
          />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ValidatedDatePicker
              label="Tapahtuman alkamispäivä"
              onChange={this.handleStartDate}
              name="startDate"
              autoOk
              cancelLabel="Peruuta"
              value={this.state.startDate === '' ? null : this.state.startDate}
              validators={['required']}
              errorMessages={['Päivämäärä vaaditaan']}
              fullWidth
              margin="normal"
            />

            <ValidatedTimePicker
              label="Tapahtuman alkamisaika"
              ampm={false}
              name="startTime"
              cancelLabel="Peruuta"
              autoOk
              value={this.state.startTime === '' ? null : this.state.startTime}
              onChange={this.handleStartTime}
              validators={['required']}
              errorMessages={['Aloitusaika vaaditaan']}
              fullWidth
              disabled={this.state.startDate === ''}
              margin="normal"
            />
            <ValidatedDatePicker
              label="Tapahtuman loppumispäivä"
              onChange={this.handleEndDate}
              name="endDate"
              autoOk
              value={this.state.endDate === '' ? null : this.state.endDate}
              validators={['dateIsLater']}
              errorMessages={[
                'Päättymishetki ei voi olla aiemmin kuin alkamishetki!',
              ]}
              fullWidth
              margin="normal"
            />

            <ValidatedTimePicker
              label="Tapahtuman loppumisaika"
              ampm={false}
              name="endTime"
              cancelLabel="Peruuta"
              autoOk
              value={this.state.endTime === '' ? null : this.state.endTime}
              onChange={this.handleEndTime}
              validators={['timeIsLater']}
              errorMessages={[
                'Päättymishetki ei voi olla aiemmin kuin alkamishetki!',
              ]}
              fullWidth
              disabled={this.state.endDate === ''}
              margin="normal"
            />
          </MuiPickersUtilsProvider>
          <br />
          {this.props.allowRepeatedEvent ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checked}
                  onChange={this.updateCheck.bind(this)}
                  color="primary"
                />
              }
              label="Luo toistuva tapahtuma"
              margin="normal"
            />
          ) : null}
          {this.props.allowRepeatedEvent ? (
            <div className="frequent" style={frequentStyle}>

            <SelectValidator
              name="repeatFrequency"
              label="Toistumisväli"
              value={this.state.repeatFrequency}
              onChange={this.handleFrequency}
              disabled={!this.state.checked}
              fullWidth
            >
              <MenuItem value={1}>Päivittäin</MenuItem>
              <MenuItem value={2}>Viikottain</MenuItem>
              <MenuItem value={3}>Joka toinen viikko</MenuItem>
              <MenuItem value={4}>Kuukausittain (esim. 12. pvä)</MenuItem>
            </SelectValidator>

              <div><p><font color='green'>Valitse toistumien lukumäärä tai viimeinen päivämäärä toistumiselle.</font></p></div>

              <TextValidator
                label="Toistuvien tapahtumien määrä"
                name="repeatCount"
                value={this.state.repeatCount}
                onChange={this.handleNewEventFormChange}
                onChange={this.handleRepeatCount}
                disabled={!this.state.checked}
                validators={['minNumber:2', 'maxNumber:55']}
                errorMessages={[
                  'Toistuvien tapahtumien määrän pitää olla väliltä 2 - 55!',
                  'Toistuvien tapahtumien määrän pitää olla väliltä 2 - 55!'
                ]}
                fullWidth
                margin="normal"
              />
              <br />

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <ValidatedDatePicker
                  label="Viimeinen toistumispäivä"
                  onChange={this.handleLastDate}
                  name="startDate"
                  autoOk
                  cancelLabel="Peruuta"
                  value={this.state.lastDate === '' ? null : this.state.lastDate}
                  validators={['dateIsLater']}
                  errorMessages={[
                    'Tarvittavia tietoja puuttuu tai ne ovat virheellisiä. (Alkamispäivä ja tapahtumien määrä.)'
                  ]}
                  fullWidth
                  margin="normal"
                />
                </MuiPickersUtilsProvider>
                <br />
            </div>
          ) : null}
          <br />

          <SelectValidator
            name="type"
            label="Tapahtuman tyyppi"
            value={this.state.type}
            onChange={this.handleType}
            validators={['required']}
            errorMessages={['Tapahtuman tyyppi vaaditaan']}
            fullWidth
          >
            <MenuItem value="kokous">Kokous</MenuItem>
            <MenuItem value="leiri">Leiri</MenuItem>
            <MenuItem value="retki">Retki</MenuItem>
            <MenuItem value="vaellus">Vaellus</MenuItem>
            <MenuItem value="muu tapahtuma">Muu tapahtuma</MenuItem>
          </SelectValidator>
          <br />

          <TextField
            label="Lisätietoja"
            name="information"
            value={this.state.information}
            onChange={this.handleNewEventFormChange}
            rowsMax="2"
            fullWidth
            margin="normal"
          />
          <br />

          {actions}
        </ValidatorForm>
      </div>
    )
  }
}

EventForm.propTypes = {
  ...PropTypesSchema,
}

EventForm.defaultProps = {}
