import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import planService from '../services/plan'

export default class PlanCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: false,
      updated: false,
      createdId: null
    }
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
      this.setState({ selected: true, updated: true, createdId: res.id })
    } catch (exception) {
      console.log('Exception', exception)
    }
  }

  deleteSuggestion = async id => {
    console.log('Plan id', id)
    try {
      const res = await planService.deletePlan(id)
      console.log('Deleted plan from activity', res)
      this.setState({ selected: false, updated: true })
      console.log('State poiston jälkeen', this.state)
    } catch (exception) {
      console.log('Exception', exception)
    }
  }
  render() {
    const { suggestion, savedActivity } = this.props

    let button = () => (
      <FlatButton
        label="Valitse"
        onClick={() => this.saveSuggestion(suggestion, savedActivity.id)}
      />
    )
    const selectedPlan = savedActivity.plans.filter(
      plan => plan.guid === suggestion.guid
    )

    console.log('Selected plan', selectedPlan)

    let style = { background: 'none' }

    if (
      (!this.state.updated && selectedPlan.length !== 0) ||
      this.state.selected
    ) {
      console.log('This suggestion is chosen one', selectedPlan)

      let id
      if (selectedPlan[0] && !this.state.updated) {
        id = selectedPlan[0].id
      } else {
        id = this.state.createdId
      }

      style = { background: '#81C784' }
      button = () => (
        <FlatButton
          label="Poista valituista"
          onClick={() => this.deleteSuggestion(id)}
        />
      )
    } else if (
      (!this.state.updated && selectedPlan.length === 0) ||
      !this.state.selected
    ) {
      style = { background: 'none' }
      button = () => (
        <FlatButton
          label="Valitse"
          onClick={() => this.saveSuggestion(suggestion, savedActivity.id)}
        />
      )
    }
    return (
      <Card>
        <CardHeader
          title={suggestion.title}
          // subtitle="Subtitle"
          actAsExpander={true}
          showExpandableButton={true}
          style={style}
        />

        <CardText expandable={true}>
          {suggestion.content}

          <br />
          {button()}
        </CardText>
      </Card>
    )
  }
}
