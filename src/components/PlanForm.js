import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import PlanCard from './PlanCard'

/** Use Typography v2: https://material-ui.com/style/typography/#strategies */
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

export default class PlanForm extends React.Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  /** Creates a new div element, set the HTML content with the providen and retrieves the text property of the element. Provides cross-browser support. */
  stripHtml = html => {
    const temporalDivElement = document.createElement('div')
    temporalDivElement.innerHTML = html
    return temporalDivElement.textContent || temporalDivElement.innerText || ''
  }

  render() {
    const { value } = this.state
    const { activity, savedActivity, parentId } = this.props

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
                <strong>Paikka:</strong> {activity.place.join(', ')}
                <br />
                <strong>Kesto:</strong> {activity.duration}
                <br />
                <strong>Taitoalueet:</strong> {activity.taitoalueet.join(', ')}
                <br />
                <strong>Kasvatustavoitteet:</strong>{' '}
                {activity.kasvatustavoitteet.join(', ')}
                <br />
                <strong>Johtamistaidot:</strong>{' '}
                {activity.johtamistaito.join(', ')}
                <br />
                <strong>Pakollisuus:</strong>{' '}
                {activity.mandatory ? 'Pakollinen ' : 'Ei pakollinen '}
                <img
                  src={activity.mandatoryIconUrl}
                  alt="mandatoryIcon"
                  height="15px"
                />
              </p>
              <p>
                <strong>Tavoite: </strong> {this.stripHtml(activity.ingress)}
              </p>
              <p>
                <strong>Kuvaus: </strong> {this.stripHtml(activity.content)}
              </p>
              <p>
                <strong>Johtajan tehtävät: </strong>{' '}
                {this.stripHtml(activity.leader_tasks)}
              </p>
            </div>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <div>
              <h2 className="headline">Toteutusvinkit</h2>
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
