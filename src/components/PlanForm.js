import React from 'react';
import planService from '../services/plan'
import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  CardText
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const PlanCard = ({suggestion}) => {
return( <Card>
    <CardHeader
      title={suggestion.title}
      // subtitle="Subtitle"
      actAsExpander={true}
      showExpandableButton={true}
    />

    <CardText expandable={true}>
      {suggestion.content}

       <br/>     
      <FlatButton label="Valitse" />
    
    </CardText>
  </Card>)
}

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props);

    
    this.state = {
      
    };
  }

  render() {
    const activity = this.props.activity
    console.log(activity.suggestions)
  const suggestionDeatails = activity.suggestions.map(suggestion => <PlanCard suggestion={suggestion}/> );
    return ( 
      <div>
      {suggestionDeatails.length !== 0 ? suggestionDeatails : "Ei toteutusvinkkejä"}

      </div>
    )
  }
}