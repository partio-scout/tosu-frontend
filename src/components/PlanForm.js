import React from 'react'
import PlanCard from './PlanCard'
import {
  Dialog,
  Tab,
  Tabs,
  Typography,
  DialogContent,
  withStyles,
} from '@material-ui/core'

const styles = theme => ({
  header: {
    marginTop: theme.spacing.unit * 3,
  },
})

class PlanForm extends React.Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  /**
   *  Creates a new div element,
   * set the HTML content with the providen and
   * retrieves the text property of the element.
   * Provides cross-browser support.
   * @param html html code that is stripped
   */
  stripHtml = html => {
    const temporalDivElement = document.createElement('div')
    temporalDivElement.innerHTML = html
    return temporalDivElement.textContent || temporalDivElement.innerText || ''
  }

  render() {
    const { value } = this.state
    const { activity, savedActivity, parentId, classes } = this.props

    const suggestionDetails = activity.suggestions.map(suggestion => (
      <PlanCard
        key={suggestion.guid}
        suggestion={suggestion}
        savedActivity={savedActivity}
        parentId={parentId}
      />
    ))

    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} scroll="body">
        <Tabs value={value} onChange={this.handleChange} variant="fullWidth">
          <Tab label="Tiedot" />
          <Tab label="Vinkit" />
        </Tabs>
        <DialogContent>
          {value === 0 && (
            <Typography component="div" className={classes.header}>
              <p>
                <strong>Paikka: </strong>
                {activity.place.join(', ')}
                <br />
                <strong>Kesto: </strong>
                {activity.duration}
                <br />
                <strong>Taitoalueet: </strong>
                {activity.taitoalueet.join(', ')}
                <br />
                <strong>Kasvatustavoitteet: </strong>
                {activity.kasvatustavoitteet.join(', ')}
                <br />
                <strong>Johtamistaidot: </strong>
                {activity.johtamistaito.join(', ')}
                <br />
                <strong>Pakollisuus: </strong>
                {activity.mandatory ? 'Pakollinen ' : 'Ei pakollinen '}
                {activity.mandatory ? (
                  <img
                    src={activity.mandatoryIconUrl}
                    alt="Pakollinen"
                    height="16px"
                    style={{ marginBottom: -2 }}
                  />
                ) : null}
              </p>
              <p>
                <strong>Tavoite: </strong> {this.stripHtml(activity.ingress)}
              </p>
              <p>
                <strong>Kuvaus: </strong> {this.stripHtml(activity.content)}
              </p>
              <p>
                <strong>Johtajan tehtävät: </strong>
                {this.stripHtml(activity.leader_tasks)}
              </p>
            </Typography>
          )}
          {value === 1 && (
            <React.Fragment>
              <Typography variant="h5" gutterBottom className={classes.header}>
                Toteutusvinkit
              </Typography>
              {suggestionDetails.length !== 0
                ? suggestionDetails
                : 'Ei toteutusvinkkejä'}
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(PlanForm)
