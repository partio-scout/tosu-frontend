import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Divider,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
} from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import DeleteIcon from '@material-ui/icons/Delete'
import CreateIcon from '@material-ui/icons/Create'
import AddIcon from '@material-ui/icons/Add'

import { setSideBar } from '../reducers/uiReducer'
import {
  selectTosu,
  createTosu,
  updateTosu,
  deleteTosu,
} from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { setLoading } from '../reducers/loadingReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { notify } from '../reducers/notificationReducer'

import tosuChange from '../functions/tosuChange'

const styles = theme => ({
  drawerPaper: {
    width: '90vw',
    maxWidth: 400,
  },
  titleContainer: {
    ...theme.mixins.toolbar,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  tosuList: {
    overflowY: 'auto',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
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
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 30,
    margin: 4,
  },
  centered: {
    margin: 'auto',
  },
})

class TosuDrawer extends React.Component {
  state = {
    newTosuName: '',
    nameChange: null,
    tosuDelete: null,
  }

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
   * Updates the given Tosu in nameChange state variable and resets the variable.
   */
  handleTosuUpdate = async () => {
    this.props.updateTosu(this.state.nameChange)
    this.setState({ nameChange: null })
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
    const { newTosuName, nameChange, tosuDelete } = this.state

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
                <Avatar className={classes.avatar}>
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
                <ListItemSecondaryAction className={classes.actionButtons}>
                  <IconButton
                    onClick={() => this.setState({ nameChange: tosu })}
                  >
                    <CreateIcon color="primary" />
                  </IconButton>
                  <Divider className={classes.divider} />
                  <IconButton
                    onClick={() => this.setState({ tosuDelete: tosu })}
                  >
                    <DeleteIcon color="error" />
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
          value={newTosuName}
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

    const nameChangeDialog = (
      <Dialog
        open={nameChange}
        onClose={() => this.setState({ nameChange: null })}
      >
        <DialogTitle>Muokkaa nimeä</DialogTitle>
        <DialogContent>
          <TextField
            id="name"
            margin="none"
            label="Toimintasuunnitema"
            value={nameChange ? nameChange.name : ''}
            onChange={event =>
              this.setState({
                nameChange: { ...nameChange, name: event.target.value },
              })
            }
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => this.setState({ nameChange: null })}
          >
            peruuta
          </Button>
          <Button color="primary" onClick={() => this.handleTosuUpdate()}>
            päivitä
          </Button>
        </DialogActions>
      </Dialog>
    )

    const tosuDeleteDialog = (
      <Dialog
        open={tosuDelete}
        onClose={() => this.setState({ tosuDelete: null })}
      >
        <DialogTitle>Vahvistus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haluatko varmasti poistaa kyseisen toimintasuunnitelman?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => this.setState({ tosuDelete: null })}
          >
            peruuta
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.handledTosuDelete(tosuDelete.id)
              this.setState({ tosuDelete: null })
            }}
          >
            poista
          </Button>
        </DialogActions>
      </Dialog>
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
        <div className={classes.titleContainer}>
          <Typography
            style={{ flexGrow: 1 }}
            className={classes.title}
            align="center"
            color="inherit"
            variant="h6"
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
        {nameChangeDialog}
        {tosuDeleteDialog}
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
  updateTosu,
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
