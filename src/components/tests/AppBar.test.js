import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
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
    ).childAt(0).childAt(1)
    expect(wrapper.find('Connect(AccountIcon)')).to.have.lengthOf(1)
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
    expect(form).to.have.lengthOf(1)
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

})
