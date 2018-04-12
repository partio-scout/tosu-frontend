import React from 'react'
import FontAwesome from 'react-fontawesome'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import { notify } from '../reducers/notificationReducer'

class googleButtons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }

    googleLogout = (response) => {
        if (this.state.isLoggedIn === true) {
            this.setState({ isLoggedIn: false })
        }
        console.log(response)
        console.log('User signed out.')
    }

    googleLogin = (response) => {
        if (this.state.isLoggedIn === false) {
            this.setState({ isLoggedIn: true })
        }
        console.log(response)
        console.log('user signed in.')
    }

    render() {
    return (
    
    <div>
        
            {!this.state.isLoggedIn ?
                <GoogleLogin
                    className='customBtn'
                    scope='profile email'
                    clientId="7360124073-8f1bq4mul415hr3kdm154vq3c65lp36d.apps.googleusercontent.com"
                    onSuccess={(this.googleLogin)}
                    onFailure={(this.googleLogout)}
                >
                <FontAwesome className='icon' name='google' size='2x' />
                <span className='label'>LOGIN WITH GOOGLE</span>
                </GoogleLogin>
                :
                <div>
                    <Link to="/user-info">
                        <RaisedButton
                            label='Omat tiedot'
                            style={{ float: 'right', marginRight: 5, marginTop: 20 }}
                            onClick={this.hideTopBar}
                        />
                    </Link>
                    <GoogleLogout
                        className='customBtn'
                        scope='profile email'
                        onLogoutSuccess={(this.googleLogout)}
                    >
                    <FontAwesome className='icon' name="sign-out" size='2x' />
                    <span className='label'>SIGN OUT</span>
                    </GoogleLogout>
                </div>
            }
    </div>
    )
    }
}



export default googleButtons