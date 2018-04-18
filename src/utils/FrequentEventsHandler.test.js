import moment from 'moment'
import handleFrequentEvent from './FrequentEventsHandler'

describe.only('Frequent event handler', () => {
  const date = moment('2018-04-18')

  it('returns next date if repeat frequency is 1', () => {
    const newDate = handleFrequentEvent(date, 1, 1).format('YYYY-MM-DD')
    expect(newDate).toContain('2018-04-19')
  })

  it('returns date in next week if repeat frequency is 2', () => {
    const newDate = handleFrequentEvent(date, 2, 1).format('YYYY-MM-DD')
    expect(newDate).toEqual('2018-04-25')
  })

  it('returns date in next two weeks if repeat frequency is 3', () => {
    const newDate = handleFrequentEvent(date, 3, 1).format('YYYY-MM-DD')
    expect(newDate).toEqual('2018-05-02')
  })

  it('returns date in next month if repeat frequency is 4', () => {
    const newDate = handleFrequentEvent(date, 4, 1).format('YYYY-MM-DD')
    expect(newDate).toEqual('2018-05-18')
  })

  it('returns original date if frequency is out of range', () => {
    const newDate = handleFrequentEvent(date, 9, 1)
    expect(newDate).toEqual(date)
  })
})
