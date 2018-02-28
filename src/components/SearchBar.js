import React from 'react';
import SearchBar from 'material-ui-search-bar';
import matchSorter from 'match-sorter';
import FlatButton from 'material-ui/FlatButton';

export default class ActivitySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      selectedActivity: null
    };
  }

  updateSelectedActivity = activity => {
    this.setState({
      selectedActivity: activity
    });
  };

  updateDatasource = data => {
    this.setState({
      dataSource: data
    });
  };

  saveActivityToEvent = () => {
    if (this.state.selectedActivity) {
      const data = {
        guid: this.state.selectedActivity[0].guid
      };

      console.log('Tallenna aktiviteetti', data);

      fetch(
        `https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events/${
          this.props.event.id
        }/activities`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
        .then(res => res.json())
        .then(res =>
          this.props.updateActivities({ id: res.id, information: res.guid })
        )
        .then(
          this.setState({
            dataSource: this.props.dataSource,
            selectedActivity: null
          })
        )
        .catch(error => console.error('Error:', error));
    } else {
      console.log('Ei valittua aktiviteettia');
    }
  };

  render() {
    return (
      <div>
        <SearchBar
          dataSource={this.state.dataSource.map(activity => activity.title)}
          onChange={value => {
            const data = matchSorter(this.props.dataSource, value, {
              keys: ['title']
            });
            return this.updateDatasource(data);
          }}
          onRequestSearch={() =>
            this.updateSelectedActivity(this.state.dataSource)
          }
          style={{
            margin: '0 auto',
            maxWidth: 800
          }}
        />
        <div>
          <p>
            {' '}
            Valittu aktiviteetti:{' '}
            {this.state.selectedActivity
              ? this.state.selectedActivity[0].title
              : 'Ei valittu'}
          </p>
          <FlatButton
            label="Tallenna aktiviteetti"
            primary={true}
            onClick={this.saveActivityToEvent}
          />
        </div>
      </div>
    );
  }
}
