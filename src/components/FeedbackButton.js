import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = () => ({
  label: {
    color: 'white'
  }
})

const FeedbackButton = () => (
  <div className='feedback'>
    <a style={{textDecoration: 'none'}} href='https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform'>
      <Button type="button" className="button" variant='contained'color='secondary'>
        Anna palautetta
      </Button>
    </a>
  </div>
);

export default withStyles(styles)(FeedbackButton)
