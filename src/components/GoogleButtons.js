import { connect } from 'react-redux'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import { GoogleLogin } from 'react-google-login'
import RaisedButton from 'material-ui/RaisedButton'
import { userLogin, userLogout } from '../reducers/userReducer'
import { setGoogleToken, removeGoogleToken } from '../services/googleToken'


class googleButtons extends React.Component {

    forceMyOwnLogout = async (response) => {
        console.log('forcelogout')
        await this.props.userLogout()
        removeGoogleToken()
        /* if (window.gapi) { const auth2 = window.gapi.auth2.getAuthInstance()
             if (auth2 != null) { auth2.signOut().then( auth2.disconnect().then(this.props.onLogoutSuccess))} }*/
    }

    googleLoginSuccess = async (response) => {
        if (this.props.scout === null) {
            setGoogleToken(response.tokenId)
            await this.props.userLogin()
        }
    }

    googleLoginFail = async (response) => {
        //console.log('login failed')
    }

    render() {
        return (

            <div>

                {this.props.scout === null ?
                    <GoogleLogin
                        className='customBtn'
                        scope='profile email'
                        clientId="7360124073-8f1bq4mul415hr3kdm154vq3c65lp36d.apps.googleusercontent.com"
                        onSuccess={this.googleLoginSuccess}
                        onFailure={this.googleLoginFail}
                    >
                        <FontAwesome className='icon' name='google' size='2x' />
                        <span className='label'>LOGIN WITH GOOGLE</span>
                    </GoogleLogin>
                    :

                    <div>
                        <RaisedButton
                            label='Kirjaudu ulos'
                            style={{ float: 'right', marginRight: 5, marginTop: 20 }}
                            onClick={(this.forceMyOwnLogout)}
                        />
                        {this.props.selfInfo}
                    </div>
                }
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
    userLogin,
    userLogout
})(googleButtons)