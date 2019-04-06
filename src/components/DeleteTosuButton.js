import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, withStyles} from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import {setLoading} from '../reducers/loadingReducer'
import { deleteTosu } from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import {notify} from '../reducers/notificationReducer'
import theme from '../theme'




const styles = () => ( {
    root: {
        background:'#FE6B8B' ,
        color: 'white',
        borderRadius: 3,
        border: 0,
        height: 48,
    },
    label: {
        textTransform: 'uppercase'
    },
})

const StyledButton = withStyles(styles)(Button)

class DeleteTosuButton extends Component{
  render() {
    const {
      setLoading,
      tosu,
      deleteTosu,
      eventsInitialization,
      initialization,
      notify,
    } = this.props
    if( Object.entries(tosu).length === 0) return (<div/>)
    return (
      <StyledButton classes={{label: 'deleteTosuButton' }}
        variant="contained"
        onClick={e => {
          setLoading(true)
          e.preventDefault()
          const toDelete = Object.keys(tosu)
            .map(key => tosu[key])
            .find(tosu => tosu.selected)
          deleteTosu(toDelete.id)
          eventsInitialization({})
          initialization()
          notify('Tosu poistettu', 'success')
          setLoading(false)
        }}
      >
        Poista tosu
      </StyledButton>
    )
  }
}


const mapStateToProps = state => ({
    tosu: state.tosu,
})

const mapDispatchToProps = {
    setLoading,
    deleteTosu,
    eventsInitialization,
    notify,
}


export default connect(mapStateToProps, mapDispatchToProps)(DeleteTosuButton)
