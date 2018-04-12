import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import {
  TextValidator,
  ValidatorForm
  // DateValidator,
  // TimeValidator,
  // SelectValidator
} from 'react-material-ui-form-validator'
// import Toggle from 'material-ui/Toggle'

export default class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: ''
    }
  }

  send = () => {
    console.log('tallennettu')
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div>
        <Paper zDepth={2} style={{ padding: 20 }}>
          <h3>Käyttäjän tiedot</h3>
          <ValidatorForm ref={() => 'form'} onSubmit={this.send} disabled>
            <TextValidator
              name="name"
              hintText="Käyttäjän nimi"
              value={this.state.name}
              onChange={this.handleChange}
              fullWidth
            />
            <TextValidator
              name="username"
              hintText="Käyttäjänimi"
              value={this.state.username}
              onChange={this.handleChange}
              fullWidth
            />
          </ValidatorForm>
        </Paper>
      </div>
    )
  }
}
