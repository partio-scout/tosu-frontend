import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Parser } from 'html-to-react'
import { deletePlan } from '../reducers/planReducer'
import { editEvent } from '../reducers/eventReducer'
import planService from '../services/plan'
import convertToSimpleActivity from '../functions/activityConverter.js'
import findActivity from '../functions/findActivity'
import { notify } from '../reducers/notificationReducer'
import { updateActivity } from '../reducers/activityReducer'
import PropTypesSchema from '../utils/PropTypesSchema'

class SuggestionCard extends React.Component {
  constructor(props) {
    super(props)
    this.deleteClick = this.deleteClick.bind(this)
  }

  getSimpleActivity = (activity, pofTree) =>
    convertToSimpleActivity(findActivity(activity, pofTree))

  deleteClick = async e => {
    const { plan, notify, activity } = this.props
    e.preventDefault()
    try {
      await planService.deletePlan(plan.id)
      this.props.deletePlan(plan.id, plan.activityId)
      const updatedActivity = { ...activity }
      updatedActivity.plans = activity.plans.filter(p => p.id !== plan.id)
      this.props.updateActivity(updatedActivity)
    } catch (exception) {
      notify('Toteutusvinkin poistaminen ei onnistunut')
    }
  }

  render() {
    const { plan, activity, pofTree } = this.props

    return (
      <div key={plan.id}>
        <Card style={{ backgroundColor: '#fafafa', marginTop: '10px' }}>
          <CardHeader
            action={
              <IconButton onClick={this.deleteClick}>
                <DeleteIcon />
              </IconButton>
            }
            title={plan.title}
            subheader={
              <Typography>
                {this.getSimpleActivity(activity, pofTree).title}
              </Typography>
            }
          />

          <CardContent>
            <Typography component="p">
              {Parser().parse(plan.content)}
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  }
}

SuggestionCard.propTypes = {
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  plans: PropTypes.arrayOf(PropTypes.object).isRequired,
  notify: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
}

SuggestionCard.defaultProps = {}

const mapStateToProps = state => ({
  pofTree: state.pofTree,
  plans: state.plans,
})

const mapDispatchToProps = {
  notify,
  editEvent,
  deletePlan,
  updateActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuggestionCard)
