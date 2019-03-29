// Vendor
import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login'
import { Button, withStyles, Typography } from '@material-ui/core'
import isTouchDevice from 'is-touch-device'
// Services
import { setGoogleToken } from '../services/googleToken' // TODO: rename service
import { API_ROOT } from '../api-config'
// Reducers
import { scoutGoogleLogin, readScout } from '../reducers/scoutReducer'
import { setLoading } from '../reducers/loadingReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  bufferZoneInitialization,
  deleteActivityFromBuffer,
} from '../reducers/bufferZoneReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { tosuInitialization } from '../reducers/tosuReducer'
import PropTypesSchema from './PropTypesSchema'

const styles = theme => ({
  loginButton: {
    margin: theme.spacing.unit,
    backgroundColor: 'white',
  },
  login: {
    paddingTop: '20vh',
    paddingBottom: '20vh',
    textAlign: 'center',
    background: '#253264',
  },
})

class Login extends React.Component {
  /**
   * Acknowledges a succesful login and sets credentials for user
   * @param response response from server
   */
  googleLoginSuccess = async response => {
    this.props.setLoading(true)
    await this.props.scoutGoogleLogin(response.tokenId)
    setGoogleToken(response.tokenId)
    const tosuId = await this.props.tosuInitialization()
    await Promise.all([
      this.props.eventsInitialization(tosuId),
      this.props.bufferZoneInitialization(),
    ]).then(() =>
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
    )
    if (isTouchDevice()) {
      await Promise.all(
        this.props.buffer.activities.map(activity =>
          this.props.deleteActivityFromBuffer(activity.id)
        )
      ).catch(error => console.log('Error while emptying buffer', error))
    }
    this.props.setLoading(false)
  }
  /**
   * Returns an error message if login is unsuccesful
   */
  googleLoginFail = async () => {
    notify('Google-kirjautuminen epäonnistui. Yritä uudestaan.')
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.login}>
        <Typography
          variant="h4"
          style={{ color: 'white', textTransform: 'uppercase' }}
          gutterBottom
        >
          Toiminnan suunnittelusovellus
        </Typography>
        <GoogleLogin
          scope="profile email"
          clientId={this.props.token} // TODO: Maybe get the token out of here
          onSuccess={this.googleLoginSuccess}
          onFailure={this.googleLoginFail}
          render={renderProps => (
            <Button
              onClick={renderProps.onClick}
              variant="contained"
              size="small"
              className={classes.loginButton}
            >
              Kirjaudu sisään Googlella
            </Button>
          )}
        />
        <Button
          variant="contained"
          size="small"
          className={classes.loginButton}
          href={`${API_ROOT}/scouts/login`}
        >
          Kirjaudu sisään PartioID:llä
        </Button>
      </div>
    )
  }
}

Login.propTypes = {
  ...PropTypesSchema,
}

Login.defaultProps = {
  scout: PropTypes.shape({ id: '' }),
}
const mapStateToProps = state => ({
  scout: state.scout,
  buffer: state.buffer,
  events: state.events,
  tosu: state.tosu,
})

export default connect(
  mapStateToProps,
  {
    notify,
    pofTreeUpdate,
    eventsInitialization,
    tosuInitialization,
    bufferZoneInitialization,
    deleteActivityFromBuffer,
    scoutGoogleLogin,
    readScout,
    setLoading,
  }
)(withStyles(styles)(Login))
