import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'

import { ActivityPreview } from '../ActivityPreview'

describe('<ActivityPreview />', () => {
  const pofActivity = {
    parents: [{ guid: 1, name: 'mockParent' }],
    title: 'this is pof activity',
  }

  it("renders nothing if it's not being dragged", () => {
    const props = { isDragging: false, pofActivity, startPoint: { x: 5, y: 5 } }
    const wrapper = shallow(<ActivityPreview {...props} />)
    // react-dnd wraps the found component in a context so we need to go one level deeper
    expect(wrapper.find({ className: 'previewChip' }).length).to.equal(0)
  })

  it("renders a chip if it's being dragged", () => {
    const props = {
      isDragging: true,
      pofActivity,
      currentOffset: 5,
      startPoint: { x: 5, y: 5 },
    }
    const wrapper = shallow(<ActivityPreview {...props} />)
    expect(
      wrapper
        .dive()
        .dive()
        .find({ className: 'activityTitle' }).length
    ).to.equal(1)
  })
})
