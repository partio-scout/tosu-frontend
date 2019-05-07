import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
describe('Creating and deleting kuksa-events', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.wait(4000)
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('initiate tosu', function() {})
  it('user adds a new kuksa-event', function() {
    cy.get('button[id="kuksa"]').click()
    cy.get('button[id="add-kuksa"]')
      .first()
      .click()
    cy.get('button[id="verify-add-kuksa"]').click()
    cy.get('button[id="omat"]').click()
    cy.get('button[id="edit-event"]').should('be.disabled')
  })
  it('user deletes a kuksa event', function() {
    cy.get('button[id="kuksa"]').click()
    cy.get('button[id="add-kuksa"]')
      .first()
      .click()
    cy.get('button[id="verify-add-kuksa"]').click()
    cy.get('button[id="omat"]').click()
    cy.get('button[id="delete-event"]').click()
    cy.contains('Poista tapahtuma').click()
    cy.contains('Tapahtuma poistettu')
  })
})
