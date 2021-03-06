import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'
import {
  Avatar,
  ButtonBase,
  ClickAwayListener,
  Fade,
  Popper,
} from '@material-ui/core'
import AccountCard from './AccountCard'

/** @module */

const styles = theme => ({
  circleButton: {
    borderRadius: '50%',
  },
  userAvatar: {
    backgroundColor: lightBlue[300],
  },
})

/**
 * AccountIcon 
 * @method
 *
 * @param {Object} props
 * @param {Object} props.scout - user
 * @param {Object} props.classes
 *
 */
function AccountIcon(props) {
  const { scout, classes } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClickAway = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  return (
    <div>
      <ButtonBase className={classes.circleButton} onClick={handleOpen}>
        <Avatar className={classes.userAvatar}>
          {scout.name.substring(0, 1)}
        </Avatar>
      </ButtonBase>
      <Popper
        open={open}
        anchorEl={anchorEl}
        modifiers={{
          offset: {
            offset: '0, 20%',
          },
        }}
      >
        <Fade>
          <ClickAwayListener onClickAway={handleClickAway}>
            <AccountCard scout={scout} />
          </ClickAwayListener>
        </Fade>
      </Popper>
    </div>
  )
}

export default withStyles(styles)(AccountIcon)
