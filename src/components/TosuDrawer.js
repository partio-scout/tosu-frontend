import React, { useState } from 'react'
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

function TosuDrawer(props) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const { ui, tosus, loading, classes } = props

  const [newTosuName, updateNewTosuName] = useState('')

  /**
   * Closes the menu and dispatches 'Tosu view change' -action
   * @param tosuId - ID of the selected Tosu
   */
  const handleTosuSelect = async tosuId => {
    if (tosus.selected !== tosuId) {
      props.setSideBar(false)
      await tosuChange(
        tosuId,
        props.setLoading,
        props.selectTosu,
        props.eventsInitialization,
        props.activityInitialization,
        props.pofTreeUpdate,
        props.activities,
        props.buffer
      )
    }
  }

  /**
   * Creates new Tosu and selects it
   */
  const handleTosuCreate = async () => {
    const created = await props.createTosu(newTosuName)
    handleTosuSelect(created.id)
    updateNewTosuName('')
  }

  /**
   * Deletes specified Tosu and changes to another one
   * if the deleted Tosu was currently selected.
   * @param tosuId - ID of the selected Tosu
   */
  const handledTosuDelete = async tosuId => {
    await props.deleteTosu(tosuId)
    if (tosus.selected === tosuId) {
      await tosuChange(
        tosus.selected,
        props.setLoading,
        props.selectTosu,
        props.eventsInitialization,
        props.activityInitialization,
        props.pofTreeUpdate,
        props.activities,
        props.buffer
      )
    }
    props.notify('Tosu poistettu', 'success')
  }

  const tosuList = (
    <div className={classes.tosuList}>
      <List>
        {Object.entries(tosus).map(([property, tosu]) =>
          property === 'selected' ? null : (
            <ListItem
              key={tosu.id}
              selected={tosu.selected}
              onClick={() => handleTosuSelect(tosu.id)}
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
                <IconButton onClick={() => handledTosuDelete(tosu.id)}>
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
        value={newTosuName}
        onChange={event => updateNewTosuName(event.target.value)}
      />
      <IconButton
        className={classes.iconButton}
        onClick={() => handleTosuCreate()}
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
      onClose={() => props.setSideBar(false)}
      onOpen={() => props.setSideBar(true)}
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
