import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography';
import PlanCard from './PlanCard'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {value: 0}
  }

  handleChange = (event, value) => {
    this.setState({ value })
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
    const { value } = this.state;
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
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Tiedot" />
          <Tab label="Vinkit" />
        </Tabs>
        {value===0 &&
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
          </TabContainer>}
        {value === 1 &&
          <TabContainer>
            <div>
              <h2 classNames="headline">Toteutusvinkit</h2>
              {suggestionDeatails.length !== 0
                  ? suggestionDeatails
                  : 'Ei toteutusvinkkejä'}
            </div>
          </TabContainer>}
      </div>
    )
  }
}
