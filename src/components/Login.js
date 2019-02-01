// Vendor
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import FontAwesome from 'react-fontawesome'
import { Button } from '@material-ui/core'
import isTouchDevice from 'is-touch-device'
// Services
import { setGoogleToken } from '../services/googleToken' // TODO: rename service
import { API_ROOT } from '../api-config'
// Reducers
import { scoutGoogleLogin, readScout } from '../reducers/scoutReducer'
import { setLoading } from '../reducers/loadingReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeInitialization, pofTreeUpdate } from '../reducers/pofTreeReducer'
import { bufferZoneInitialization, deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { eventsInitialization } from '../reducers/eventReducer'

class Login extends Component {
  constructor(props){
    super(props)
  }

  googleLoginSuccess = async response => {
      if (this.props.scout === null) {
        this.props.store.dispatch(setLoading(true))
        await this.props.scoutGoogleLogin(response.tokenId)
        setGoogleToken(response.tokenId)
        await Promise.all([
          this.props.eventsInitialization(),
          this.props.bufferZoneInitialization(),

        ]).then(() => {
          this.props.pofTreeUpdate(this.props.buffer, this.props.events)
          this.props.store.dispatch(setLoading(false))
        })
      }
    }

    googleLoginFail = async response => {
      notify('Google-kirjautuminen epäonnistui. Yritä uudestaan.')
    }

  render() {
    return (
      <div className='Login'>
        {!isTouchDevice() ?
          (<p className='login-text'>Toiminnan suunnittelusovellus</p>) :
          (<p className='login-mobile-text'>Toiminnan suunnittelusovellus</p>)
        }
        <GoogleLogin
          className='login-button'
          scope='profile email'
          clientId={this.props.token} // TODO: GET THE TOKEN FOK OUTTA HERE
          onSuccess={this.googleLoginSuccess}
          onFailure={this.googleLoginFail}
        >
          <FontAwesome className='icon' name='google' />
          <span className='label'>
            {' '}
            <span className='appbar-button-text'>Kirjaudu sisään Googlella</span>
          </span>
        </GoogleLogin>
        <Button
          style={{ backgroundColor: 'transparent' }}
          href={`${API_ROOT}/scouts/login`}
        >
          <span className='login-button'>
            {' '}
            <span className='appbar-button-text'>Kirjaudu sisään PartioID:llä</span>
          </span>
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  scout: state.scout,
  buffer: state.buffer,
  events: state.events
})


export default connect(mapStateToProps, {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  deleteActivityFromBuffer,
  scoutGoogleLogin,
  readScout,
  setLoading
}) (Login)
