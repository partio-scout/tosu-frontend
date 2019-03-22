import React from 'react'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse/Collapse'
import { Parser } from 'html-to-react'
import planService from '../services/plan'
import { initPlans, savePlan, deletePlan } from '../reducers/planReducer'
import { notify } from '../reducers/notificationReducer'
import { editEvent } from '../reducers/eventReducer'
import PropTypesSchema from './PropTypesSchema'
import {
  editEvent,
  addActivityToEventOnlyLocally,
  deleteActivityFromEventOnlyLocally,
} from '../reducers/eventReducer'
import { updateActivity } from '../reducers/activityReducer'

class PlanCard extends React.Component {
  state = { expanded: false }

  componentDidMount = () => {
    this.updateSuggestions()
  }
  componentDidUpdate = () => {
    this.updateSuggestions()
  }
  handleExpandChange = expanded => {
    this.setState({ expanded: !this.state.expanded })
  }

  /**
   * Check if suggestions are already saved in store and if not save them
   */
  updateSuggestions = () => {
    const { savedActivity, plans } = this.props

    if (plans.filter(plan => plan.id === savedActivity.id).length === 0) {
      this.props.initPlans({ id: savedActivity.id, plans: savedActivity.plans })
    }
  }
  /**
   * Saves the suggestions
   * @param suggestion suggestion to be saved
   * @param activityId activity that is linked to the suggestion
   * @param parentId eventId of event that has the activity
   */
  saveSuggestion = async (suggestion, activityId, parentId) => {
    const data = {
      guid: suggestion.guid,
      title: suggestion.title,
      content: suggestion.content,
    }
    try {
      const res = await planService.addPlanToActivity(data, activityId)
      data.id = res.id
      this.props.savePlan(suggestion, activityId, res.id)
      const parentActivity = { ...this.props.activities[activityId] }
      parentActivity.plans = Array.from(parentActivity.plans)
      parentActivity.plans.push(data)
      this.props.updateActivity(parentActivity)
    } catch (exception) {
      console.log(exception)
      this.props.notify('Toteutusvinkin tallentaminen ei onnistunut')
    }
  }
  /**
   * Deletes a suggestion from the backend and from frontend
   * @param id id of suggestion that will be deleted
   * @param activityId id of activity that the suggestion is linked to
   * @param parentId eventId of event that has the activity
   */
  deleteSuggestion = async (id, activityId, parentId) => {
    try {
      await planService.deletePlan(id)
      this.props.deletePlan(id, activityId)
      const activity = { ...this.props.activities[activityId] }
      activity.plans = activity.plans.filter(e => {
        return e.id !== id
      })
      this.props.updateActivity(activity)
    } catch (exception) {
      console.log(exception)
      this.props.notify('Toteutusvinkin poistaminen ei onnistunut')
    }
  }
  /**
   * Parses the suggestion to string form
   * @param suggestion suggestion in html form
   * @returns content in string form
   */
  parseSuggestionContent = suggestion => {
    const htmlParser = new Parser()
    const parsedContent = htmlParser.parse(suggestion.content)
    return parsedContent
  }

  render() {
    const { suggestion, savedActivity, plans, parentId } = this.props
    // Find plans for current activity from store
    const activityPlans = plans.filter(plan => plan.id === savedActivity.id)
    let selectedPlan = []

    // Check if current suggestion is selected or not
    if (activityPlans.length !== 0) {
      selectedPlan = savedActivity.plans.filter(
        plan => plan.guid === suggestion.guid
      )
    }

    // Determine button and card style depending on if suggestion is selected or not
    let style
    let button

    if (selectedPlan.length !== 0) {
      button = () => (
        <Button
          size="small"
          onClick={() =>
            this.deleteSuggestion(
              selectedPlan[0].id,
              savedActivity.id,
              parentId
            )
          }
        >
          Poista valituista
        </Button>
      )

      style = { background: '#C8E6C9' }
    } else {
      button = () => (
        <Button
          size="small"
          onClick={() =>
            this.saveSuggestion(suggestion, savedActivity.id, parentId)
          }
        >
          Valitse
        </Button>
      )
      style = { background: 'none' }
    }

    return (
      <Card>
        <CardHeader title={suggestion.title} style={style} />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {this.parseSuggestionContent(suggestion)}
            <br />
          </CardContent>
        </Collapse>
        <CardActions>
          <IconButton
            onClick={this.handleExpandChange}
            className={this.state.expanded ? 'arrow-up' : ''}
          >
            <ExpandMoreIcon />
          </IconButton>
          {button()}
        </CardActions>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  plans: state.plans,
  events: state.events,
  activities: state.activities,
})

PlanCard.propTypes = {
  ...PropTypesSchema,
}

PlanCard.defaultProps = {}
const mapDispatchToProps = {
  initPlans,
  savePlan,
  deletePlan,
  editEvent,
  notify,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
  updateActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanCard)
