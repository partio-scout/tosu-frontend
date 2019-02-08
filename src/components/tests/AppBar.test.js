import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { FormControlLabel } from '@material-ui/core'

import store from '../../store'
import AccountIcon from '../AccountIcon'
import { AppBar } from '../AppBar'

const testScout = {
  name: 'sudenpentu3',
}

describe('<Appbar />', () => {
  it('renders an <AccountIcon />', () => {
    const wrapper = shallow(
      <AppBar
        scout={testScout}
        toggleSideBar={jest.fn()}
        classes={{ label: 'wow' }}
      />
    )
    expect(wrapper.find(AccountIcon)).to.have.lengthOf(1)
  })

  it('renders a switch for the sidebar', () => {
    const wrapper = shallow(
      <AppBar
        scout={testScout}
        toggleSideBar={jest.fn()}
        classes={{ label: 'wow' }}
      />
    )
    const form = wrapper
      .find({ label: 'Piilota suunnittelunäkymä' })
      .dive()
      .dive()
    console.log(form.debug())
    expect(form.find('.toggle-sidebar')).to.have.lengthOf(1)
  })

  it('initially shows the sidebar', () => {
    const wrapper = shallow(
      <AppBar
        scout={testScout}
        toggleSideBar={jest.fn()}
        classes={{ label: 'wow' }}
      />
    )
    expect(wrapper.state('sidebarVisible')).to.be.true
  })

  it('hides the sidebar after switch click', () => {
    const mockHandler = jest.fn()
    const wrapper = shallow(
      <AppBar
        scout={testScout}
        toggleSideBar={jest.fn()}
        classes={{ label: 'wow' }}
      />
    )
    console.log(wrapper.debug())
    const swich = wrapper
      .find({ label: 'Piilota suunnittelunäkymä' })
      .dive()
      .dive()
      .find('.toggle-sidebar')
    console.log(swich.debug())
    swich.simulate('click', { currentTarget: wrapper })
    expect(wrapper.state('sidebarVisible')).to.be.false
  })
})
