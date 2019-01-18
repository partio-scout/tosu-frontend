import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = () => ({
  label: {
    color: 'white'
  }
})

const FeedbackButton = (props) => (
  <div className='feedback'>
    <a style={{textDecoration: 'none'}} href={props.feedback_url}>
      <Button type="button" className="button" variant='contained'color='secondary'>
        Anna palautetta
      </Button>
    </a>
  </div>
);

export default withStyles(styles)(FeedbackButton)
