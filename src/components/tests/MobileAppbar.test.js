import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import Select from 'react-select';


import store from '../../store'
import AccountIcon from '../AccountIcon'
import MobileAppbar from '../MobileAppbar'

describe('<MobileAppbar />', () => {


    it('renders an <AccountIcon />', () => {
        // We have to set disableLifecycleMethods since we don't need to render the full dom
        // for this test
        const wrapper = shallow(<MobileAppbar store={store} />, {disableLifecycleMethods: true})
        expect(wrapper.dive().find(AccountIcon)).to.have.lengthOf(1)
    })

    it('renders a <Select />', () => {
        const wrapper = shallow(<MobileAppbar store={store} />, {disableLifecycleMethods: true})
        expect(wrapper.dive().find(Select)).to.have.lengthOf(1)
    })
})