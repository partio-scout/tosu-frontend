import React from 'react'
import moment from 'moment'

import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import TimePicker from 'material-ui-pickers/TimePicker'
import DatePicker from 'material-ui-pickers/DatePicker'


/*
const errorStyle = {
  position: 'absolute',
  marginBottom: '-22px',
  color: 'red'
}
*/

export default class EventForm extends React.Component {
  constructor(props) {
    super(props)
    const event = this.props.data
    this.state = {
      title: event.title,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      checked: false,
      repeatCount: 2,
      repeatFrequency: 2,
      type: event.type,
      information: event.information
    }
  }

  componentDidMount() {
    // TODO: Validation
    // ValidatorForm.addValidationRule('dateIsLater', value => {
    //   if (
    //     value.setHours(0, 0, 0, 0) < this.state.startDate.setHours(0, 0, 0, 0)
    //   ) {
    //     return false
    //   }
    //   return true
    // })
    // ValidatorForm.addValidationRule('timeIsLater', value => {
    //   if (
    //     this.state.startDate.setHours(0, 0, 0, 0) ===
    //       this.state.endDate.setHours(0, 0, 0, 0) &&
    //     moment(value).format('HH:mm') <
    //       moment(this.state.startTime).format('HH:mm')
    //   ) {
    //     return false
    //   }
    //   return true
    // })
  }

  handleNewEventFormChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleStartDate = date => {
    console.log(date)
    this.setState({
      startDate: date,
      endDate: date
    })
  }

  handleStartTime = date => {
    this.setState({
      startTime: date,
      endTime: new Date(moment(date).add(1, 'h'))
    })
  }

  handleEndDate = date => {
    this.setState({
      endDate: new Date(date)
    })
  }

  handleEndTime = date => {
    this.setState({
      endTime: date
    })
  }

  updateCheck() {
    this.setState(oldState => {
      if (oldState.checked) {
        this.setState({
          repeatCount: 1,
          repeatFrequency: 0
        })
      }
      return {
        checked: !oldState.checked
      }
    })
  }

  handleRepeatCount = event => {
    this.setState({
      repeatCount: event.target.value
    })
  }

  handleFrequency = event => {
    this.setState({
      repeatFrequency: event.target.value
    })
  }

  handleTitle = event => {
    this.setState({
      title: event.target.value
    })
  }

  handleType = event => {
    this.setState({
      type: event.target.value
    })
  }

  handleInformation = event => {
    this.setState({
      information: event.target.value
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
        <Button variant="outlined" onClick={this.props.close}>
          Peruuta
        </Button>
        <Button type="submit" variant="outlined" color="primary" onClick={this.send}>
          Tallenna
        </Button>
      </div>
    )

    const frequentStyle = { display: this.state.checked ? '' : 'none' }

    return (
      <div>
        <h2>Uusi tapahtuma</h2>
        <div>
          <TextField
            label="Tapahtuman nimi"
            name="title"
            value={this.state.title}
            onChange={this.handleNewEventFormChange}
            // validators={['required']}
            // errorMessages={['Tapahtuman nimi vaaditaan']}
            // errorStyle={errorStyle}
            fullWidth
            margin="normal"
          />

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              label="Tapahtuman alkamispäivä"
              name="startDate"
              autoOk
              cancelLabel="Peruuta"
              value={this.state.startDate === '' ? null : this.state.startDate}
              onChange={this.handleStartDate}
              // validators={['required']}
              // errorMessages={['Päivämäärä vaaditaan']}
              fullWidth
              margin="normal"
            />
            <TimePicker
              label="Tapahtuman alkamisaika"
              ampm={false}
              name="startTime"
              cancelLabel="Peruuta"
              autoOk
              value={
                this.state.startTime === '' ? null : this.state.startTime
              }
              onChange={this.handleStartTime}
              // validators={['required']}
              // errorMessages={['Aloitusaika vaaditaan']}
              fullWidth
              disabled={this.state.startDate === ''}
              margin="normal"
            />
            <DatePicker
              label="Tapahtuman loppumispäivä"
              name="endDate"
              autoOk
              cancelLabel="Peruuta"
              value={this.state.endDate === '' ? null : this.state.endDate}
              onChange={this.handleEndDate}
              // validators={['dateIsLater']}
              // errorMessages={[
              //   'Päättymishetki ei voi olla aiemmin kuin alkamishetki!'
              // ]}
              fullWidth
              margin="normal"
            />
            <TimePicker
              label="Tapahtuman loppumisaika"
              ampm={false}
              name="endTime"
              cancelLabel="Peruuta"
              autoOk
              value={this.state.endTime === '' ? null : this.state.endTime}
              onChange={this.handleEndTime}
              // validators={['timeIsLater']}
              // errorMessages={[
              //   'Päättymishetki ei voi olla aiemmin kuin alkamishetki!'
              // ]}
              fullWidth
              disabled={this.state.endDate === ''}
              margin="normal"
            />
          </MuiPickersUtilsProvider>
          <br />

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

          <div className="frequent" style={frequentStyle}>
            <TextField
              label="Toistuvien tapahtumien määrä"
              name="repeatCount"
              value={this.state.repeatCount}
              onChange={this.handleNewEventFormChange}
              disabled={!this.state.checked}
              // validators={['minNumber:2', 'maxNumber:55']}
              // errorMessages={[
              //   'Toistuvien tapahtumien määrän pitää olla väliltä 2 - 55!'
              // ]}
              fullWidth
              margin="normal"
            />
            <br />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="repeatFrequency">Toistumisväli</InputLabel>
              <Select
                value={this.state.repeatFrequency}
                onChange={this.handleFrequency}
                disabled={!this.state.checked}
                inputProps={{
                  name: 'repeatFrequency',
                  id: 'repeatFrequency-simple',
                }}
                validators={['required']}
              >
                <MenuItem value={1}>Päivittäin</MenuItem>
                <MenuItem value={2}>Viikottain</MenuItem>
                <MenuItem value={3}>Joka toinen viikko</MenuItem>
                <MenuItem value={4}>Kuukausittain (esim. 12. pvä)</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="type">Tapahtuman tyyppi</InputLabel>
            <Select
              value={this.state.type}
              onChange={this.handleType}
              inputProps={{
                name: 'type',
                id: 'type-simple',
              }}
              // validators={['required']}
              // errorMessages={['Tapahtuman tyyppi vaaditaan']}
            >
              <MenuItem value="kokous">Kokous</MenuItem>
              <MenuItem value="leiri">Leiri</MenuItem>
              <MenuItem value="retki">Retki</MenuItem>
              <MenuItem value="vaellus">Vaellus</MenuItem>
              <MenuItem value="muu tapahtuma">Muu tapahtuma</MenuItem>
            </Select>
          </FormControl>
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
        </div>
      </div>
    )
  }
}
