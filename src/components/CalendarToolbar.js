import React, { Component } from 'react'
import moment from 'moment'

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1)
    toolbar.onNavigate('prev')
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1)
    toolbar.onNavigate('next')
  };

  const goToCurrent = () => {
    const now = new Date()
    toolbar.date.setMonth(now.getMonth())
    toolbar.date.setYear(now.getFullYear())
    toolbar.onNavigate('current')
  };

  const label = () => {
    const date = moment(toolbar.date)
    return (
      <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
    )
  }

  return (
    <div>
      <label>{label()}</label>

      <div>
        <button onClick={goToBack}>&#8249;</button>
        <button onClick={goToCurrent}>today</button>
        <button onClick={goToNext}>&#8250;</button>
      </div>
    </div >
  )
}

export default CustomToolbar
