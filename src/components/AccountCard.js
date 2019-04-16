import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { scoutLogout } from '../reducers/scoutReducer'
import { Avatar, Button, Grid, Paper, Typography } from '@material-ui/core'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    border: '1px solid #ccc',
    borderRadius: 'unset',
    borderColor: 'rgba(0,0,0,.2)',
    boxShadow: '0 2px 10px rgba(0,0,0,.2)',
  },
  image: {
    width: 128,
    height: 128,
  },
  accountInfo: {
    padding: theme.spacing.unit * 2.5,
  },
  actionButtons: {
    background: '#f5f5f5',
    borderTop: '1px solid #ccc',
    padding: '10px 0',
  },
  bigAvatar: {
    width: 96,
    height: 96,
    fontSize: 24,
  },
})

function AccountCard(props) {
  const { scout, classes } = props

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={16} className={classes.accountInfo}>
        <Grid item>
          <Avatar
            className={classes.bigAvatar}
            src="http://placekitten.com/g/200/200"
          >
            {scout.name.substring(0, 1)}
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="button">{scout.name}</Typography>
          <Typography>email@example.com</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justify="space-evenly"
        alignItems="center"
        className={classes.actionButtons}
      >
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          rel="noopener"
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform"
        >
          Anna palautetta
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={props.scoutLogout}
        >
          Kirjaudu ulos
        </Button>
      </Grid>
    </Paper>
  )
}

const mapDispatchToProps = {
  scoutLogout,
}

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(AccountCard))
