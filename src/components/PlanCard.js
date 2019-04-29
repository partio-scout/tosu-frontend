import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DoneIcon from '@material-ui/icons/Done'
import { Parser } from 'html-to-react'
import planService from '../services/plan'
import { initPlans, savePlan, deletePlan } from '../reducers/planReducer'
import { withSnackbar } from 'notistack'
import { editEvent } from '../reducers/eventReducer'
import { updateActivity } from '../reducers/activityReducer'
import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography,
  Divider,
} from '@material-ui/core'


/** 
 * Plancard
 */
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
   * @method
   * @param suggestion suggestion to be saved
   * @param activityId activity that is linked to the suggestion
   * @param parentId eventId of event that has the activity
   *
   * Consider moving this logic to activity reducer 
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
      this.props.enqueueSnackbar('Toteutusvinkin tallentaminen epäonnistui', {
        variant: 'error',
      })
    }
  }

  /**
   * Deletes a suggestion from the backend and from frontend
   * @method
   * @param id id of suggestion that will be deleted
   * @param activityId id of activity that the suggestion is linked to
   * @param parentId eventId of event that has the activity
   * 
   * Consider moving this logic to activiyt reducer
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
      this.props.enqueueSnackbar('Toteutusvinkin poistaminen epäonnistui', {
        variant: 'error',
      })
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
      button = (
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
      button = (
        <Button
          size="small"
          onClick={() =>
            this.saveSuggestion(suggestion, savedActivity.id, parentId)
          }
        >
          Valitse
        </Button>
      )
    }

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={style}>
          <Typography variant="subtitle1">
            {suggestion.title}
            {selectedPlan.length !== 0 && (
              <DoneIcon
                color="primary"
                fontSize="small"
                style={{ marginLeft: 8, marginBottom: -4 }}
              />
            )}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{this.parseSuggestionContent(suggestion)}</Typography>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>{button}</ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

const mapStateToProps = state => ({
  plans: state.plans,
  events: state.events,
  activities: state.activities,
})

PlanCard.propTypes = {
  plans: PropTypes.arrayOf(PropTypes.object).isRequired,
  events: PropTypes.object.isRequired,
  activities: PropTypes.object.isRequired,
  initPlans: PropTypes.func.isRequired,
  savePlan: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  initPlans,
  savePlan,
  deletePlan,
  editEvent,
  updateActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(PlanCard))
