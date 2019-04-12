import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { AccountIcon } from '../AccountIcon'

describe('<AccountIcon />', () => {

    it('renders an <IconButton />', () => {
        const wrapper = shallow(<AccountIcon accountIcon="WOW" />).childAt(0).dive()
        expect(wrapper.find('IconButton')).to.have.lengthOf(1)
    })

    it('initially hides a <Menu />', () => {
        const wrapper = shallow(<AccountIcon  accountIcon="WOW"/>).childAt(1).dive()
        const menu = wrapper.find('Menu')
        expect(menu.prop('open')).to.be.false
    })

    it('shows a menu if <IconButton /> is clicked', () => {
        const wrapper = shallow(<AccountIcon />)
        wrapper.childAt(0).dive().find('IconButton').simulate('click', {currentTarget: wrapper})
        expect(wrapper.childAt(1).dive().find('Menu').prop('open')).to.be.true
    })
})
