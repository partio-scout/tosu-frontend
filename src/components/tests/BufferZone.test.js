import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import store from '../../store'
import BufferZone from '../BufferZone'

describe('<BufferZone />', () => {

  it('renders nothing if bufferzone doesn\'t have an id', () => {
    const wrapper = shallow(<BufferZone store={store} />)
    expect(wrapper.childAt(0)).to.be.empty
  })

  it('renders an ActivityDragAndDropTarget if bufferzone has an id', () => {
    const wrapper = mount(<BufferZone store={store} buffer={{ id: 5 }} />)
    const bzone = wrapper.find(BufferZone)
  })
})