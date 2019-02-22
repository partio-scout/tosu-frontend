import { connect } from 'react-redux'
import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Parser } from 'html-to-react'
import PropTypes from 'prop-types'
import { deletePlan } from '../reducers/planReducer'
import { editEvent } from '../reducers/eventReducer'
import planService from '../services/plan'
import convertToSimpleActivity from '../functions/activityConverter.js'
import findActivity from '../functions/findActivity'
import { notify } from '../reducers/notificationReducer'

class SuggestionCard extends React.Component {
  static propTypes = {
    event: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    plan: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    activity: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    pofTree: PropTypes.object.isRequired,
    editEvent: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    deletePlan: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.deleteClick = this.deleteClick.bind(this)
  }

  getSimpleActivity = (activity, pofTree) =>
    convertToSimpleActivity(findActivity(activity, pofTree))

  deleteClick = async e => {
    const { plan, event, editEvent, deletePlan, notify } = this.props
    e.preventDefault()
    try {
      await planService.deletePlan(plan.id)
      deletePlan(plan.id, plan.activityId)
      editEvent(event)
    } catch (exception) {
      notify('Toteutusvinkin poistaminen ei onnistunut')
    }
  }

  render() {
    const { plan, activity, pofTree } = this.props

    return (
      <div key={plan.id}>
        <Card
          className="suggestion"
          style={{ backgroundColor: '#fafafa', marginTop: '10px' }}
        >
          <CardHeader
            action={
              <IconButton onClick={this.deleteClick}>
                {' '}
                <DeleteIcon />{' '}
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

const mapStateToProps = state => ({
  pofTree: state.pofTree,
  plans: state.plans,
})

export default connect(
  mapStateToProps,
  { notify, editEvent, deletePlan }
)(SuggestionCard)
