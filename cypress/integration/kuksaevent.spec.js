import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
describe('Creating and deleting kuksa-events', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.wait(5000)
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
    cy.get('button[id="edit-event"]').should('be.disabled')
  })

  it('user can delete kuksa event from own events', function() {
    //add kuksa event
    cy.get('button[id="kuksa"]').click()
    cy.get('button[id="add-kuksa"]')
      .first()
      .click()
    cy.get('button[id="verify-add-kuksa"]').click()
    cy.get('button[id="omat"]').click()
    cy.get('button[id="edit-event"]').should('be.disabled')
    //delete kuksa event
    cy.get('button[id="delete-event"]').click()
    cy.get('button[id="confirm-delete"]').click()
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(0)
    })
  })
})
