import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs'
import PlanCard from './PlanCard'

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  stripHtml = html => {
    // Create a new div element
    const temporalDivElement = document.createElement('div')
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || ''
  }

  render() {
    const { activity, savedActivity } = this.props

    const suggestionDeatails = activity.suggestions.map(suggestion => (
      <PlanCard
        key={suggestion.guid}
        suggestion={suggestion}
        savedActivity={savedActivity}
      />
    ))
    return (
      <div>
        <Tabs>
          <Tab label="Tiedot">
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
          </Tab>
          <Tab label="Vinkit">
            <div>
              <h2 className='headline'>Toteutusvinkit</h2>
              {suggestionDeatails.length !== 0
                ? suggestionDeatails
                : 'Ei toteutusvinkkejä'}
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}
