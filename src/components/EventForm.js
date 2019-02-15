import React from 'react'
import moment from 'moment'
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
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

  handleStartDate = date => {
    this.setState({
      startDate: date.toDate(), // Convert moment-object to Date
      endDate: date.toDate(),
    })
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
  }

  handleFrequency = event => {
    this.setState({
      repeatFrequency: event.target.value,
    })
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
      this.state.type,
      this.state.information
    )

    this.props.submitFunction()
  }

  render() {
    const actions = (
      <div>
        <Button
          style={{ marginRight: 10 }}
          variant="contained"
          color="primary"
          onClick={this.props.close}
        >
          Peruuta
        </Button>
        <Button variant="contained" type="submit" color="primary">
          Tallenna
        </Button>
      </div>
    )

    const frequentStyle = { display: this.state.checked ? '' : 'none' }

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.send}
          onError={errors => console.log(errors)}
        >
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
              <TextValidator
                label="Toistuvien tapahtumien määrä"
                name="repeatCount"
                value={this.state.repeatCount}
                onChange={this.handleNewEventFormChange}
                disabled={!this.state.checked}
                validators={['minNumber:2', 'maxNumber:55']}
                errorMessages={[
                  'Toistuvien tapahtumien määrän pitää olla väliltä 2 - 55!',
                ]}
                fullWidth
                margin="normal"
              />
              <br />

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
