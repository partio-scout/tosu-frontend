import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Divider,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Parser } from 'html-to-react'
import { deletePlan } from '../reducers/planReducer'
import { editEvent } from '../reducers/eventReducer'
import planService from '../services/plan'
import convertToSimpleActivity from '../functions/activityConverter.js'
import findActivity from '../functions/findActivity'
import { withSnackbar } from 'notistack'
import { updateActivity } from '../reducers/activityReducer'
import PropTypesSchema from '../utils/PropTypesSchema'
/** @module */

/**
 * Component for displaying suggestion information in
 * extended EventCards
 * @param {Object} props - see proptypes for more detail
 *
 */
class SuggestionCard extends React.Component {
  constructor(props) {
    super(props)
    this.deleteClick = this.deleteClick.bind(this)
  }

  getSimpleActivity = (activity, pofTree) =>
    convertToSimpleActivity(findActivity(activity, pofTree))

  deleteClick = async e => {
    const { plan, activity } = this.props
    e.preventDefault()
    try {
      await planService.deletePlan(plan.id)
      this.props.deletePlan(plan.id, plan.activityId)
      const updatedActivity = { ...activity }
      updatedActivity.plans = activity.plans.filter(p => p.id !== plan.id)
      this.props.updateActivity(updatedActivity)
    } catch (exception) {
      this.props.enqueueSnackbar('Toteutusvinkin poistaminen epäonnistui', {
        variant: 'error',
      })
    }
  }

  render() {
    const { plan, activity, pofTree } = this.props

    return (
      <Card key={plan.id} style={{ marginTop: 16 }}>
        <CardHeader
          action={
            <IconButton onClick={this.deleteClick}>
              <DeleteIcon />
            </IconButton>
          }
          title={<Typography variant="h6">{plan.title}</Typography>}
          subheader={
            <Typography variant="subheading">
              {this.getSimpleActivity(activity, pofTree).title}
            </Typography>
          }
        />
        <Divider variant="middle" />
        <CardContent>
          <Typography component="p">{Parser().parse(plan.content)}</Typography>
        </CardContent>
      </Card>
    )
  }
}

SuggestionCard.propTypes = {
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  plans: PropTypes.arrayOf(PropTypes.object).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
  updateActivity: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  pofTree: state.pofTree,
  plans: state.plans,
})

const mapDispatchToProps = {
  editEvent,
  deletePlan,
  updateActivity,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(SuggestionCard))
