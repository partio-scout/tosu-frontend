// Vendor
import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login'
import { Button } from '@material-ui/core'
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
    return (
      <div className="Login">
        <p className={isTouchDevice() ? 'login-mobile-text' : 'login-text'}>
          Toiminnan suunnittelusovellus
        </p>
        <GoogleLogin
          className="login-button"
          scope="profile email"
          clientId={this.props.token} // TODO: Maybe get the token out of here
          onSuccess={this.googleLoginSuccess}
          onFailure={this.googleLoginFail}
        >
          <span className="label">
            <span className="appbar-button-text">
              Kirjaudu sisään Googlella
            </span>
          </span>
        </GoogleLogin>
        <Button
          style={{ backgroundColor: 'transparent' }}
          href={`${API_ROOT}/scouts/login`}
        >
          <span className="login-button">
            <span className="appbar-button-text">
              Kirjaudu sisään PartioID:llä
            </span>
          </span>
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
)(Login)
