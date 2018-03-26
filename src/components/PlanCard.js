import React from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import planService from '../services/plan'
import { initPlans, savePlan, deletePlan } from '../reducers/planReducer'
import { green100 } from 'material-ui/styles/colors'

class PlanCard extends React.Component {
  componentDidMount = () => {
    console.log('DID MOUNT')
    const { savedActivity, plans } = this.props
    const savePlans = {
      id: savedActivity.id,
      plans: savedActivity.plans
    }

    console.log('Plans', plans)

    const alreadyInit = plans.map(plan => {
      console.log('Plan id', plan.id)
      console.log('Saved id', savePlans.id)
      if (plan.id === savePlans.id) {
        return plan
      }
      return null
    })

    console.log('Init?', alreadyInit)

    if (alreadyInit.length === 0) {
      this.props.initPlans(savePlans)
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
      this.props.savePlan(suggestion, activityId, res.id)
    } catch (exception) {
      console.log('Exception', exception)
    }
  }

  deleteSuggestion = async (id, activityId) => {
    console.log('Plan id', id)
    try {
      const res = await planService.deletePlan(id)
      console.log('Deleted plan from activity', res)
      this.props.deletePlan(id, activityId)
    } catch (exception) {
      console.log('Exception', exception)
    }
  }
  render() {
    const { suggestion, savedActivity, plans } = this.props

    console.log('Propsit', this.props)

    const activityPlans = plans.filter(plan => plan.id === savedActivity.id)

    console.log('Activity plans', activityPlans)

    let selectedPlan = []

    if (activityPlans.length !== 0) {
      selectedPlan = activityPlans[0].plans.filter(
        plan => plan.guid === suggestion.guid
      )
    }
    console.log('Selected plan', selectedPlan)

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

const mapStateToProps = state => {
  console.log('State', state)
  return { plans: state.plans }
}

export default connect(mapStateToProps, {
  initPlans,
  savePlan,
  deletePlan
})(PlanCard)
