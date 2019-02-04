import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { FeedbackButton } from '../FeedbackButton'




describe('<FeedbackButton />', () => {
    it('Button uses the correct link', () => {
        const wrapper = shallow(<FeedbackButton feedback_url="http://www.google.com" />)
        expect(wrapper.find({href:"http://www.google.com"})).to.not.have.lengthOf(0)
    })

    it('Renders a button', () => {
        const wrapper = shallow(<FeedbackButton feedback_url="http://www.google.com" />)
        expect(wrapper.find({type:"button"})).to.not.have.lengthOf(0)
    })

})

