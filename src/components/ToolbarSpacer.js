import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
})

const ToolbarSpacer = props => <div className={props.classes.toolbar} />

export default withStyles(styles)(ToolbarSpacer)
