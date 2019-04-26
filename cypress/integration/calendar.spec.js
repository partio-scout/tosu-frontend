import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
describe('Testing calendar view', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.wait(2000)
    // April first 2018 BUG: Should be March first 2018
    cy.clock(new Date(2018, 3, 1).getTime())
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
    cy.wait(2000)
  })
  it('user opens the calendar and it is in the correct time', function() {
    cy.get('button[id=kalenteri]').click()
    cy.contains('huhtikuu 2018')
  })
  it('user can open both daily view and weekly view', function() {
    cy.get('button[id=kalenteri]').click()
    cy.contains('la 31/03').should('not.exist')
    cy.contains('Month').click()
    cy.contains('Week').click()
    cy.contains('la 31/03')
    cy.contains('su 01/04')
    cy.contains('Week').click({ force: true })
    cy.contains('Day').click({ force: true })
    cy.contains('su 01/04')
    cy.contains('la 31/03').should('not.exist')
  })
  it('when pressing the "tänään" button the calendar resets to current day', function() {
    cy.get('button[id=kalenteri]').click()
    cy.contains('23').click()
    cy.contains('ma 23/04')
    cy.contains('su 01/04').should('not.exist')
    cy.get('button[name=tanaan]').click()
    cy.contains('su 01/04')
  })
  it('when pressing radio-button kuksa-events are shown in the calendar', function() {
    cy.get('button[id=kalenteri]').click()
    cy.contains('Kuksa tapahtumat').click()
    cy.contains('KITT kevät 2018')
  })
})
