import React from 'react'
import FontAwesome from 'react-fontawesome'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { BrowserRouter as Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
class googleButtons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: window.localStorage.getItem('googleToken') !== null
        }
        console.log(window.localStorage.getItem('googleToken'))
    }

     forceMyOwnLogout = (response) => {
         console.log('forcelogout')
         window.localStorage.removeItem('googleToken')
         this.setState({ isLoggedIn: false })
       /* if (window.gapi) {
            const auth2 = window.gapi.auth2.getAuthInstance()
            if (auth2 != null) {
                auth2.signOut().then(
                    auth2.disconnect().then(this.props.onLogoutSuccess)
                )
            }
        }*/
    }

    googleLogin = (response) => {
        if (this.state.isLoggedIn === false) {
            this.setState({ isLoggedIn: true })
            
        }
        window.localStorage.setItem('googleToken', response)
        //window.localStorage.setItem('', '')
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
                    onFailure={(console.log('fail'))}
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
                    <Link to="/user-info">
                        <RaisedButton
                            label='Omat tiedot'
                            style={{ float: 'right', marginRight: 5, marginTop: 20 }}
                            onClick={this.hideTopBar}
                        />
                    </Link>
                </div>
            }
    </div>
    )
    }
}



export default googleButtons