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

  // Check if suggestions are already saved in store and if not save them
  updateSuggestions = () => {
    const { savedActivity, plans } = this.props

    if (plans.filter(plan => plan.id === savedActivity.id).length === 0) {
      this.props.initPlans({ id: savedActivity.id, plans: savedActivity.plans })
    }
  }

  saveSuggestion = async (suggestion, activityId, parentId) => {
    const data = {
      guid: suggestion.guid,
      title: suggestion.title,
      content: suggestion.content,
    }
    try {
      const res = await planService.addPlanToActivity(data, activityId)
      this.props.savePlan(suggestion, activityId, res.id)
      let parentEvent = this.props.events.find(e => {
        return parentId === e.id
      })
      parentEvent.activities
        .find(e => {
          return e.id === activityId
        })
        .plans.push(data)
      this.props.editEvent(parentEvent)
    } catch (exception) {
      console.log(exception)
      this.props.notify('Toteutusvinkin tallentaminen ei onnistunut')
    }
  }

  deleteSuggestion = async (id, activityId, parentId) => {
    try {
      await planService.deletePlan(id)
      this.props.deletePlan(id, activityId)
      const parentEvent = this.props.events.find( e => {
          return e.id === parentId 
      })
      const activity = parentEvent.activities.find( e => {
          return e.id === activityId 
      })
      activity.plans = activity.plans.filter( e => {
          return e.id !== id 
      })
      this.props.editEvent(parentEvent)
    } catch (exception) {
      console.log(exception)
      this.props.notify('Toteutusvinkin poistaminen ei onnistunut')
    }
  }

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
      selectedPlan = activityPlans[0].plans.filter(
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
            this.deleteSuggestion(selectedPlan[0].id, savedActivity.id, parentId)
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
})

export default connect(
  mapStateToProps,
  {
    initPlans,
    savePlan,
    deletePlan,
    editEvent,
    notify,
  }
)(PlanCard)
