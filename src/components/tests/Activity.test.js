import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import store from '../../store'
import Activity from '../Activity'

describe('<Activity />', () => {

  const activity = 'test'
  const pofActivity = { parents: [{ guid: 1, name: 'mockParent' }] }
  const identity = el => el
  const OriginalActivity = Activity.DecoratedComponent

  // Thanks to FreeMasen https://github.com/react-dnd/react-dnd/issues/925#issuecomment-351445125
  // for getting this to work with shallow rendering
  it('renders a chip', () => {
    const props = { activity, pofActivity }
    const wrapper = shallow(<OriginalActivity {...props} store={store} connectDragSource={identity} />)
    expect(wrapper.childAt(0).hasClass('non-mandatory-chip')).to.be.true
  })

  it('renders a chip', () => {
    const pofActivity = { parents: [{ guid: 1, name: 'mockParent' }], mandatory: true }
    const props = { activity, pofActivity }
    const wrapper = shallow(<OriginalActivity {...props} store={store} connectDragSource={identity} />)
    expect(wrapper.childAt(0).hasClass('mandatory-chip')).to.be.true
  })
})