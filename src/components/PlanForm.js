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

const PlanCard = ({suggestion, saveSuggestion, activityId}) => {
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
      <FlatButton label="Valitse" onClick={()=>saveSuggestion(suggestion, activityId)}/>
    
    </CardText>
  </Card>)
}

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props);

  
    this.state = {
      
    };
  }

  saveSuggestion = async (suggestion, activityId) =>{
    const data ={"title": suggestion.title, "content": suggestion.content}
    try{
      console.log("Data", data)
      const res = await planService.addPlanToActivity(data, activityId)
      
      console.log("Response", res)
    } catch (exception){
      console.log("Exception")
    }
  }  

  render() {
    const activity = this.props.activity
    const savedActivity = this.props.savedActivity
    console.log("Saved activity", savedActivity)

    
    const suggestionDeatails = activity.suggestions.map(suggestion => 
      <PlanCard key={suggestion.title} suggestion={suggestion} saveSuggestion={this.saveSuggestion} activityId={savedActivity.id}/>);
    return ( 
      <div>
      {suggestionDeatails.length !== 0 ? suggestionDeatails : "Ei toteutusvinkkejä"}

      </div>
    )
  }
}