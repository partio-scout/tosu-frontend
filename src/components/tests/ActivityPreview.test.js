import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'

import ActivityPreview from '../ActivityPreview'

describe('<ActivityPreview />', () => {

  const pofActivity = { parents: [{ guid: 1, name: 'mockParent' }] }

  function wrapInTestContext(ActivityPreview, props) {
    
    return DragDropContext(TestBackend)(
      () => <ActivityPreview {...props} />
    )
  }

  it('renders nothing if it\'s not being dragged', () => {
    const props = { isDragging: false, pofActivity }
    const PreviewContext = wrapInTestContext(ActivityPreview, props)
    const wrapper = mount(<PreviewContext name='test' /> )
    const preview = wrapper.find(ActivityPreview)
    // react-dnd wraps the found component in a context so we need to go one level deeper
    expect(preview.childAt(0).children()).to.have.lengthOf(0)
  })

  /* it('renders a chip if it\'s being dragged', () => {
    const props = { isDragging: true, pofActivity, currentOffset: 5 }
    const PreviewContext = wrapInTestContext(ActivityPreview, props)
    const wrapper = mount(<PreviewContext name='test' /> )
    const backend = wrapper.instance().getManager().getBackend()
    const preview = wrapper.find(ActivityPreview).childAt(0)
    console.log(preview.debug())
    expect(preview.childAt(0).children()).to.have.lengthOf(0)
  }) */
})