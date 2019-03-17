import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypesSchema from './PropTypesSchema'

const styles = () => ({
  root: {
    background: 'white',
    borderRadius: 3,
    border: '1px solid gray',
    color: 'black',
  },
})

const StyledButton = withStyles(styles)(Button)

/** Renders a feedbackbutton if the app is not in mobile state */
export const FeedbackButton = props => {
  if (props.visible) {
    return (
      <div className="feedback">
        <a
          style={{ textDecoration: 'none' }}
          href={props.feedback_url}
          rel="noopener noreferer"
          target="blank"
        >
          <StyledButton
            type="button"
            className="FeedbackButton"
            variant="contained"
          >
            Anna palautetta
          </StyledButton>
        </a>
      </div>
    )
  }
  return <div />
}

export default FeedbackButton

FeedbackButton.propTypes = {
  ...PropTypesSchema,
}

FeedbackButton.defaultProps = {}
