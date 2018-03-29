import React from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { green100 } from 'material-ui/styles/colors'
import planService from '../services/plan'
import { initPlans, savePlan, deletePlan } from '../reducers/planReducer'
import { notify } from '../reducers/notificationReducer'

class PlanCard extends React.Component {
  componentDidMount = () => {
    this.updateSuggestions()
  }
  componentDidUpdate = () => {
    this.updateSuggestions()
  }

  // Check if suggestions are already saved in store and if not save them
  updateSuggestions = () => {
    const { savedActivity, plans } = this.props

    if (plans.filter(plan => plan.id === savedActivity.id).length === 0) {
      this.props.initPlans({ id: savedActivity.id, plans: savedActivity.plans })
    }
  }

  saveSuggestion = async (suggestion, activityId) => {
    const data = {
      guid: suggestion.guid,
      title: suggestion.title,
      content: suggestion.content
    }
    try {
      const res = await planService.addPlanToActivity(data, activityId)
      this.props.savePlan(suggestion, activityId, res.id)
    } catch (exception) {
      this.props.notify('Toteutusvinkin tallentaminen ei onnistunut')
    }
  }

  deleteSuggestion = async (id, activityId) => {
    try {
      await planService.deletePlan(id)
      this.props.deletePlan(id, activityId)
    } catch (exception) {
      this.props.notify('Toteutusvinkin poistaminen ei onnistunut')
    }
  }
  render() {
    const { suggestion, savedActivity, plans } = this.props
    // Find plans for current activity from store
    const activityPlans = plans.filter(plan => plan.id === savedActivity.id)

    let selectedPlan = []

    // Check if current suggestion is selected or not
    if (activityPlans.length !== 0) {
      selectedPlan = activityPlans[0].plans.filter(
        plan => plan.guid === suggestion.guid
      )
    }

    // Determine button and card style depending on if suggestion is selected or not
    let style
    let button

    if (selectedPlan.length !== 0) {
      button = () => (
        <FlatButton
          label="Poista valituista"
          onClick={() =>
            this.deleteSuggestion(selectedPlan[0].id, savedActivity.id)
          }
        />
      )

      style = { background: green100 }
    } else {
      button = () => (
        <FlatButton
          label="Valitse"
          onClick={() => this.saveSuggestion(suggestion, savedActivity.id)}
        />
      )
      style = { background: 'none' }
    }

    return (
      <Card>
        <CardHeader
          title={suggestion.title}
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

const mapStateToProps = state => ({
  plans: state.plans
})

export default connect(mapStateToProps, {
  initPlans,
  savePlan,
  deletePlan,
  notify
})(PlanCard)
