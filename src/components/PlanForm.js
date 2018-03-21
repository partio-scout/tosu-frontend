import React from 'react'
import planService from '../services/plan'
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { Tabs, Tab } from 'material-ui/Tabs'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  }
}

const PlanCard = ({ suggestion, saveSuggestion, activityId }) => {
  return (
    <Card>
      <CardHeader
        title={suggestion.title}
        // subtitle="Subtitle"
        actAsExpander={true}
        showExpandableButton={true}
      />

      <CardText expandable={true}>
        {suggestion.content}

        <br />
        <FlatButton
          label="Valitse"
          onClick={() => saveSuggestion(suggestion, activityId)}
        />
      </CardText>
    </Card>
  )
}

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  saveSuggestion = async (suggestion, activityId) => {
    const data = {
      guid: suggestion.guid,
      title: suggestion.title,
      content: suggestion.content
    }
    try {
      console.log('Data', data)
      const res = await planService.addPlanToActivity(data, activityId)
      console.log('Addded plan to activity', res)
    } catch (exception) {
      console.log('Exception', exception)
    }
  }

  render() {
    const { activity, savedActivity } = this.props
    console.log('activity', activity)

    const suggestionDeatails = activity.suggestions.map(suggestion => (
      <PlanCard
        key={suggestion.title}
        suggestion={suggestion}
        saveSuggestion={this.saveSuggestion}
        activityId={savedActivity.id}
      />
    ))
    return (
      <div>
        <Tabs>
          <Tab label="Tiedot">
            <div>
              <p>
                <strong>Paikka:</strong> {activity.place}
                <br />
                <strong>Kesto:</strong> {activity.duration}
                <br />
                <strong>Taitoalueet:</strong> {activity.taitoalueet.join(', ')}
                <br />
                <strong>Kasvatustavoitteet:</strong>{' '}
                {activity.kasvatustavoitteet.join(', ')}
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
                <strong>Kuvaus:</strong> {activity.content}
              </p>
            </div>
          </Tab>
          <Tab label="Vinkit">
            <div>
              <h2 style={styles.headline}>Toteutusvinkit</h2>
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
