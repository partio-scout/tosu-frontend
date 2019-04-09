import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import PlanCard from './PlanCard'
import { withStyles } from '@material-ui/core'

const styles = {
  headline: {
    width: 600,
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

class PlanForm extends React.Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  /**
   *  Creates a new div element, set the HTML content with the providen and retrieves the text property of the element. Provides cross-browser support.
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
      <div>
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Tiedot" />
          <Tab label="Vinkit" />
        </Tabs>
        {value === 0 && (
          <TabContainer>
            <div>
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
                <img
                  src={activity.mandatoryIconUrl}
                  alt="Pakollinen"
                  height="16px"
                />
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
            </div>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <div>
              <h2 className={classes.headline}>Toteutusvinkit</h2>
              {suggestionDetails.length !== 0
                ? suggestionDetails
                : 'Ei toteutusvinkkejä'}
            </div>
          </TabContainer>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(PlanForm)
