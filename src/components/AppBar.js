import DragDropContext from 'react-dnd/lib/DragDropContext'
import { default as TouchBackend } from 'react-dnd-touch-backend'
import React from 'react'
import TopSearchBar from './TopSearchBar'

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate = () => {
    const bufferZoneHeight = document.getElementById('top-bar-header')
      .clientHeight
    this.props.setHeaderHeight(bufferZoneHeight)
  }

  updateActivities = activity => {
    this.setState({
      bufferZoneActivities: this.state.bufferZoneActivities.concat(activity)
    })
  }
  render() {
    return (
      <div
        className="top-search"
        id="top-bar-header"
        style={{ background: '#5DBCD2', padding: 20 }}
      >
        <TopSearchBar
          activities={this.props.activities}
          events={this.props.events}
          bufferZoneActivities={this.props.bufferZoneActivities}
          updateFilteredActivities={this.props.updateFilteredActivities}
          bufferZoneUpdater={this.props.bufferZoneUpdater}
          filteredActivities={this.props.filteredActivities}
          deleteFromBufferZone={this.props.deleteFromBufferZone}
        />
      </div>
    )
  }
}

export default DragDropContext(TouchBackend)(AppBar)
