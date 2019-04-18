import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
const createEvent = () => {
  cy.get('button[id=new-event-button]')
    .should('be.visible')
    .click()
  cy.get('input[name="title"').type('testEvent', {
    multiple: true,
    force: true,
  })
  cy.get('input[name="formStartDate"').click()
  cy.contains('OK').click({ multiple: true, force: true })
  cy.get('input[name="startTime"]').click({ multiple: true })
  cy.contains('OK').click({ multiple: true, force: true })
  cy.get('div[id="select-type"]').click({ multiple: true, force: true })
  cy.contains('Kokous').click({ multiple: true, force: true })
  cy.get('input[name="information"').type('testtest', {
    multiple: true,
    force: true,
  })
  cy.contains('Tallenna').click({ multiple: true, force: true })
}
describe('Creating and deleting events', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('Initiate tosu', function() {})
  it('user adds a new single event', function() {
    createEvent()
    cy.contains('testEvent')
  })
})
