import { connect } from 'react-redux'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import isTouchDevice from 'is-touch-device'
import { bufferZoneInitialization } from '../reducers/bufferZoneReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { scoutLogin, scoutLogout } from '../reducers/scoutReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'

class googleButtons extends React.Component {
  forceMyOwnLogout = async response => {
    console.log('forcelogout')
    await this.props.scoutLogout()
    /* if (window.gapi) { const auth2 = window.gapi.auth2.getAuthInstance()
             if (auth2 != null) { auth2.signOut().then( auth2.disconnect().then(this.props.onLogoutSuccess))} } */
  }

  render() {
    return (
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

    )
  }
}

const mapStateToProps = state => {
  return {
    scout: state.scout,
    buffer: state.buffer
  }
}

export default connect(mapStateToProps, {
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  scoutLogin,
  scoutLogout
})(googleButtons)
