import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { Menu, IconButton } from '@material-ui/core';

import store from '../../store'
import AccountIcon from '../AccountIcon'

describe('<AccountIcon />', () => {

    it('renders an <IconButton />', () => {
        const wrapper = shallow(<AccountIcon store={store} />).dive()
        expect(wrapper.find(IconButton)).to.have.lengthOf(1)
    })

    it('initially hides a <Menu />', () => {
        const wrapper = shallow(<AccountIcon store={store} />).dive()
        const menu = wrapper.find(Menu)
        expect(menu.prop('open')).to.be.false
    })

    it('shows a menu if <IconButton /> is clicked', () => {
        const wrapper = shallow(<AccountIcon store={store} />).dive()
        wrapper.find(IconButton).simulate('click', {currentTarget: wrapper})
        expect(wrapper.find(Menu).prop('open')).to.be.true
    })
})