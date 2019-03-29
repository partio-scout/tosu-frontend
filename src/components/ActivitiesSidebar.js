import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'

import TreeSearchBar from './TreeSearchBar'
import BufferZone from './BufferZone'
import StatusMessage from './StatusMessage'

import PropTypesSchema from './PropTypesSchema'

const styles = theme => ({
  divider: {
    height: 4,
    backgroundColor: '#243265',
    margin: '20px 14px',
  },
  toolbar: theme.mixins.toolbar,
})

function ActivitiesSidebar(props) {
  const { classes } = props

  return (
    <div>
      <div className={classes.toolbar} />
      <TreeSearchBar />
      <Divider variant="middle" className={classes.divider} />
      <BufferZone />
      <StatusMessage />
    </div>
  )
}

ActivitiesSidebar.propTypes = {
  ...PropTypesSchema,
}

ActivitiesSidebar.defaultProps = {}

export default withStyles(styles)(ActivitiesSidebar)
