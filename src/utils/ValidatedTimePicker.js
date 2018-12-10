import React from 'react'
import { TimePicker } from 'material-ui-pickers'
import { ValidatorComponent } from 'react-material-ui-form-validator'

class ValidatedTimePicker extends ValidatorComponent {
  render() {
    const {
      errorMessages,
      validators,
      requiredError,
      helperText,
      validatorListener,
      ...rest
    } = this.props
    const { isValid } = this.state
    return (
      <TimePicker
        {...rest}
        error={!isValid}
        helperText={(!isValid && this.getErrorMessage()) || helperText}
      />
    )
  }
}

export default ValidatedTimePicker
