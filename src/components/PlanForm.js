import React from 'react';
import planService from '../services/plan'

export default class PlanForm extends React.Component {
  constructor(props) {
    super(props);

    const activity = this.props.activity
    this.state = {
      
    };
  }

  render() {
    return ( // activityn plan lista ei poffin vaan tallennettujen
      <div>Valitut:


      </div>
    )
  }
}