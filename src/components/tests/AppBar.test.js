import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { FormControlLabel } from '@material-ui/core';

import store from '../../store'
import AccountIcon from '../AccountIcon'
import AppBar from '../AppBar'

describe('<Appbar />', () => {

    it('renders an <AccountIcon />', () => {
        const wrapper = shallow(<AppBar store={store} />)
        expect(wrapper.dive().find(AccountIcon)).to.have.lengthOf(1)
    })

    it('renders a switch for the sidebar', () => {
        const wrapper = shallow(<AppBar store={store} />).dive()
        const form = wrapper.find(FormControlLabel)
        expect(form.dive().dive().find('.toggle-sidebar')).to.have.lengthOf(1)
    })

    it('initially shows the sidebar', () => {
        const wrapper = shallow(<AppBar store={store} />).dive()
        expect(wrapper.state('sidebarVisible')).to.be.true
    })

    it('hides the sidebar after switch click', () => {
        const mockHandler = jest.fn()
        const wrapper = shallow(<AppBar store={store} toggleSideBar={mockHandler} />).dive()
        const swich = wrapper.find(FormControlLabel).dive().dive().find('.toggle-sidebar')
        swich.simulate('click', {currentTarget: wrapper})
        expect(wrapper.state('sidebarVisible')).to.be.false
    })
})