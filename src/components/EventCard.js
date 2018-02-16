import React from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText
} from "material-ui/Card";
import moment from 'moment-with-locales-es6'
import FlatButton from 'material-ui/FlatButton'

export default class EventCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  }

  handleReduce = () => {
    this.setState({expanded: false})
  }
 
  render() { 
    const event = this.props.event
    console.log(event.startDate)
    moment.locale('fr')
    const title = this.state.expanded ? '' : event.title 
    const subtitle = this.state.expanded ? '' : moment(event.startDate, "YYYY-MM-DD").locale('fi').format('ddd D. MMMM YYYY') + ' ' + event.startTime
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
        title={title}
        subtitle={subtitle}
        // subtitle="päivämäärät, alku ja loppu"
        actAsExpander={true}
        showExpandableButton={true}
        />
        <CardTitle title={event.title} subtitle="Lokaatio?" expandable={true} />
        <CardText expandable={true}>
        <p className='eventTimes'><span>{event.type} alkaa:</span> {moment(event.startDate).format('D.M.YYYY')} kello {event.startTime}</p>
        <p className='eventTimes'><span>{event.type} päättyy:</span> {moment(event.endDate).format('D.M.YYYY')} kello {event.endTime}</p>
        <p>{event.information}</p>
        <p>Aktiviteetit:</p>
        <CardActions>
          <FlatButton label="Sulje" primary={true} fullWidth={true} onClick={this.handleReduce} />
        </CardActions>
        </CardText>
    </Card>
    )
  }
}
