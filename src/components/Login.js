// Vendor
import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login'
import { Button, withStyles, Typography } from '@material-ui/core'
// Services
import { setGoogleToken } from '../services/googleToken' // TODO: rename service
import { API_ROOT } from '../api-config'
// Reducers
import { scoutGoogleLogin } from '../reducers/scoutReducer'
import { setLoading } from '../reducers/loadingReducer'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import {
  bufferZoneInitialization,
  deleteActivityFromBuffer,
} from '../reducers/bufferZoneReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { pofTreeInitialization } from '../reducers/pofTreeReducer'

import { tosuInitialization } from '../reducers/tosuReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

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
    if (this.props.scout === null) {
      this.props.setLoading(true)
      await this.props.scoutGoogleLogin(response.tokenId)
      await setGoogleToken(response.tokenId)
      await this.props.initialization(this.props)
      this.props.pofTreeUpdate(this.props.activities)
      this.props.setLoading(false)
    }
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
  scout: PropTypesSchema.scoutShape.isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  store: PropTypesSchema.storeShape.isRequired,
  scoutGoogleLogin: PropTypes.func.isRequired,
  eventsInitialization: PropTypes.func.isRequired,
  bufferZoneInitialization: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  tosu: PropTypes.string.isRequired,
  notify: PropTypes.func.isRequired,
  pofTreeInitialization: PropTypes.func.isRequired,
  activityInitialization: PropTypes.func.isRequired,
  tosuInitialization: PropTypes.func.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
}

Login.defaultProps = {
  scout: PropTypes.shape({ id: '' }),
}
const mapStateToProps = state => ({
  scout: state.scout,
  buffer: state.buffer,
  events: state.events,
  activities: state.activities,
  tosu: state.tosu,
})

const mapDispatchToProps = {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  activityInitialization,
  tosuInitialization,
  bufferZoneInitialization,
  deleteActivityFromBuffer,
  scoutGoogleLogin,
  setLoading,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login))
