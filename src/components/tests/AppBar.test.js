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
        expect(wrapper.find(AccountIcon)).to.have.lengthOf(1)
    })

    it('renders a switch for the sidebar', () => {
        const wrapper = shallow(<AppBar store={store} />)
        const form = wrapper.find(FormControlLabel)
        expect(form.dive().dive().find('.toggle-sidebar')).to.have.lengthOf(1)
    })
})