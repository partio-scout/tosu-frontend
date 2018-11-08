import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { DragSource } from 'react-dnd'

import store from '../../store'
import Activity from '../Activity'
import ItemTypes from '../../ItemTypes';
import { withStyles } from '@material-ui/core';

describe('<Activity />', () => {
  /* const mockActivitySource = {
    beginDrag(mockProps, monitor) {
      return {
        activity: { activity: 'test', canDrag: false}
      }
    }
  }
  function mockCollect(connector, monitor) {
    return {
      connectDragSource: connector.dragSource(),
      // connectDragPreview: connector.dragPreview(),
      isDragging: monitor.isDragging()
    }
  }
  const mockDraggableActivity = DragSource(
    ItemTypes.ACTIVITY,
    mockActivitySource,
    mockCollect
  )(Activity) */

    // Thanks to FreeMasen https://github.com/react-dnd/react-dnd/issues/925#issuecomment-351445125
    // for getting this to work with shallow rendering
    it('renders a chip', () => {
      const props = {activity: 'test', pofActivity: {parents: [{guid: 1, name: 'mockParent'}]}}
      const identity = el => el
      const OriginalActivity = Activity.DecoratedComponent
      const wrapper = shallow(<OriginalActivity {...props} store={store} connectDragSource={identity} />)
      expect(wrapper.childAt(0).hasClass('non-mandatory-chip')).to.be.true
    })
})