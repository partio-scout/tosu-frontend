import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Avatar,
  SwipeableDrawer,
  IconButton,
  Paper,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

import { setSideBar } from '../reducers/uiReducer'
import { selectTosu, createTosu, deleteTosu } from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { setLoading } from '../reducers/loadingReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { notify } from '../reducers/notificationReducer'

import tosuChange from '../functions/tosuChange'

const drawerWidth = 400

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,
  },
  title: {
    ...theme.mixins.toolbar,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  tosuList: {
    overflowY: 'auto',
  },
  root: {
    padding: '2px 4px',
    margin: 10,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  centered: {
    margin: 'auto',
  },
})

class TosuDrawer extends React.Component {
  state = { newTosuName: '' }

  /**
   * Just a helper function to remove copy & paste
   * @param tosuId - ID of the Tosu to change to
   */
  changeTosu = tosuId =>
    tosuChange(
      tosuId,
      this.props.setLoading,
      this.props.selectTosu,
      this.props.eventsInitialization,
      this.props.activityInitialization,
      this.props.pofTreeUpdate,
      this.props.activities,
      this.props.buffer
    )

  /**
   * Creates new Tosu and selects it.
   */
  handleTosuCreate = async () => {
    const created = await this.props.createTosu(this.state.newTosuName)
    this.props.setSideBar(false)
    this.setState({ newTosuName: '' })
    await this.changeTosu(created.id)
  }

  /**
   * Closes the menu and dispatches 'Tosu view change' -action.
   * @param tosuId - ID of the selected Tosu
   */
  handleTosuSelect = async tosuId => {
    if (this.props.tosus.selected !== tosuId) {
      this.props.setSideBar(false)
      await this.changeTosu(tosuId)
    }
  }

  /**
   * Deletes specified Tosu and changes to another one
   * if the deleted Tosu was currently selected.
   * @param tosuId - ID of the selected Tosu
   */
  handledTosuDelete = async tosuId => {
    // Has to be done this (duplicate 'deleteTosu()') way
    // because we need tosus' state before calling deleteTosu().
    // Could be fixed by removing Tosu selection from 'DELETE_TOSU' reducer action,
    // but we still need to call 'selectTosu' API endpoint somewhere.

    if (this.props.tosus.selected === tosuId) {
      await this.props.deleteTosu(tosuId)

      // Check that after deleting there are Tosus left
      if (Object.keys(this.props.tosus).length <= 1) {
        // Clear events, activity buffer, etc.
        this.props.eventsInitialization({})
        this.props.initialization()
      } else {
        // Change to newly selected Tosu
        await this.changeTosu(this.props.tosus.selected)
      }
    } else {
      // Just delete the Tosu because it's not currently selected
      await this.props.deleteTosu(tosuId)
    }
    this.props.notify('Tosu poistettu', 'success')
  }

  render() {
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
    const { ui, tosus, loading, classes } = this.props

    const tosuList = (
      <div className={classes.tosuList}>
        <List>
          {Object.entries(tosus).map(([property, tosu]) =>
            property === 'selected' ? null : (
              <ListItem
                key={tosu.id}
                selected={tosu.selected}
                onClick={() => this.handleTosuSelect(tosu.id)}
                button
              >
                <Avatar>
                  <AssignmentIcon />
                </Avatar>
                <ListItemText
                  primary={tosu.name}
                  secondary={
                    <React.Fragment>
                      <b>Luotu: </b>
                      {moment(tosu.createdAt).format('l')}
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.handledTosuDelete(tosu.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          )}
        </List>
      </div>
    )

    const tosuInput = (
      <Paper className={classes.root} elevation={1}>
        <InputBase
          className={classes.input}
          placeholder="Uusi toimintasuunnitelma"
          value={this.state.newTosuName}
          onChange={event => this.setState({ newTosuName: event.target.value })}
        />
        <IconButton
          className={classes.iconButton}
          onClick={() => this.handleTosuCreate()}
        >
          <AddIcon />
        </IconButton>
      </Paper>
    )

    return (
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={ui.sideBarVisible}
        onClose={() => this.props.setSideBar(false)}
        onOpen={() => this.props.setSideBar(true)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.title}>
          <Typography
            style={{ flexGrow: 1 }}
            align="center"
            color="inherit"
            variant="h5"
          >
            TOIMINTASUUNNITELMAT
          </Typography>
        </div>
        {loading ? (
          <div className={classes.centered}>
            <CircularProgress />
          </div>
        ) : Object.entries(tosus).length === 0 ? (
          <Typography
            variant="overline"
            align="center"
            gutterBottom
            style={{ marginTop: 14 }}
          >
            Ei toimintasuunnitelmia
          </Typography>
        ) : (
          tosuList
        )}
        {loading ? null : tosuInput}
      </SwipeableDrawer>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  tosus: state.tosu,
  activities: state.activities,
  buffer: state.buffer,
  loading: state.loading,
})

const mapDispatchToProps = {
  setSideBar,
  setLoading,
  selectTosu,
  createTosu,
  deleteTosu,
  eventsInitialization,
  activityInitialization,
  pofTreeUpdate,
  notify,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TosuDrawer))
