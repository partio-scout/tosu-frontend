import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
describe('Creating and deleting kuksa-events', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('initiate tosu', function() {})
  it('user adds a new kuksa-event', function() {
    cy.reload()
    cy.get('button[id="kuksa"]').click()
    cy.get('button[id="add-kuksa"]')
      .first()
      .click()
    cy.get('button[id="verify-add-kuksa"]').click()
    cy.get('button[id="omat"]').click()
    cy.get('button[id="edit-event"]').should('not.exist')
  })
})
