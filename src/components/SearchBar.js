import React from 'react';
import SearchBar from 'material-ui-search-bar'
import {activitiesArray} from './Activities'


const ActivitySearch = (props) => (
<SearchBar
      dataSource={props.dataSource}
      onChange={(value) => {

        
        return props.updateDataSource([ value, value+value, value+value+value])
      } }
      onRequestSearch={() => console.log('onRequestSearch')}
      style={{
        margin: '0 auto',
        maxWidth: 800
      }}
    />
    );

export default ActivitySearch;
