import { connect } from 'react-redux'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import isTouchDevice from 'is-touch-device'
import { GoogleLogin } from 'react-google-login'
import { bufferZoneInitialization } from '../reducers/bufferZoneReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { userLogin, userLogout } from '../reducers/userReducer'

class googleButtons extends React.Component {
  forceMyOwnLogout = async response => {
    console.log('forcelogout')
    await this.props.userLogout()
    /* if (window.gapi) { const auth2 = window.gapi.auth2.getAuthInstance()
             if (auth2 != null) { auth2.signOut().then( auth2.disconnect().then(this.props.onLogoutSuccess))} }*/
  }

  googleLoginSuccess = async response => {
    if (this.props.scout === null) {
      await this.props.userLogin(response.tokenId)
      await Promise.all([
        this.props.eventsInitialization(),
        this.props.bufferZoneInitialization(2) // id tulee userista myöhemmin
      ])
    }
  }

  googleLoginFail = async response => {
    //console.log('login failed')
  }

  render() {
    return (
      <div>
        {this.props.scout === null ? (
          <GoogleLogin
            className="appbar-button"
            scope="profile email"
            clientId="7360124073-8f1bq4mul415hr3kdm154vq3c65lp36d.apps.googleusercontent.com"
            onSuccess={this.googleLoginSuccess}
            onFailure={this.googleLoginFail}
          >
            <FontAwesome className="icon" name="google" />
            <span className="label">
              {' '}
              {!isTouchDevice() ? (
                <span className="appbar-button-text">Kirjaudu sisään</span>
              ) : null}
            </span>
          </GoogleLogin>
        ) : (
          <div>
            <button
              className="appbar-button"
              onClick={this.forceMyOwnLogout}
            >
              <FontAwesome className="icon" name="sign-out" />
              {!isTouchDevice() ? (
                <span className="appbar-button-text">Kirjaudu ulos</span>
              ) : null}
            </button>

            {this.props.selfInfo}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    scout: state.scout
  }
}

export default connect(mapStateToProps, {
  eventsInitialization,
  bufferZoneInitialization,
  userLogin,
  userLogout
})(googleButtons)
