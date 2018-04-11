import React from 'react'
import TreeSearchBar from './TreeSearchBar'

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

export default class AppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    this.getHeight()
  }

  componentDidUpdate = () => {
    this.getHeight()
  }

  getHeight = () => {
    const bufferZoneHeight = document.getElementById('top-bar-header')
      .clientHeight

    this.props.setHeaderHeight(bufferZoneHeight)
  }
  render() {
    return (
      <div
        className="top-search"
        id="top-bar-header"
        style={{ background: '#5DBCD2', padding: 1 }}
      >
        <TreeSearchBar getHeight={this.getHeight} />
        {/* <TopSearchBar getHeight={this.getHeight} /> */}
      </div>
    )
  }
}
