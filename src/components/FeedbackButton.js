import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = () => ({
    root: {
    background: 'white',
    borderRadius: 3,
    border: '1px solid gray',
    color: 'black'
  }
})

const StyledButton = withStyles (styles)(Button)

const FeedbackButton = (props) => (
  <div className='feedback'>
    <a style={{textDecoration: 'none'}} href={props.feedback_url}>
      <StyledButton type="button" className="FeedbackButton" variant='contained'>
        Anna palautetta
      </StyledButton>
    </a>
  </div>
);

export default (FeedbackButton)

FeedbackButton.propTypes = {
    feedback_url: PropTypes.string.isRequired
}

