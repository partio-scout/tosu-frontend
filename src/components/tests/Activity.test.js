import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import store from '../../store'
import Activity from '../Activity'

describe('<Activity />', () => {

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