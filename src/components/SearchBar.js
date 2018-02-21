import React from 'react';
import SearchBar from 'material-ui-search-bar'
import matchSorter from 'match-sorter'

export default class ActivitySearch extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
          dataSource: props.dataSource,
          selectedActivity: null
        };
     }

     updateSelectedActivity = (activity) => {
         this.setState({
            selectedActivity: activity
         })
     }

     updateDatasource = (data) => {
         this.setState({
             dataSource: data
         })
     }
     

      render(){
          return(
          <div>

          <SearchBar
            dataSource={this.state.dataSource.map(activity => activity.title)}
            onChange={(value) =>  {
                const data = matchSorter(this.props.dataSource, value, {keys: ['title']})
               return this.updateDatasource(data)
            
            }}
            onRequestSearch={() => this.updateSelectedActivity(this.state.dataSource)}
            style={{
              margin: '0 auto',
              maxWidth: 800
            }}
          />
          </div>
        )
      }
}

    

