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
  it('initiate tosu', function() {})
  it('user adds a new repeating event', function() {
    cy.get('button[id="uusi-event"]').click()
    cy.get('input[name="title"').type('testMultipleEvent', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"]').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('input[name="repeatCount"]').type('{backspace}4', {
      multiple: true,
      force: true,
    })
    cy.get('li[id="tyyppi-kokous"]').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('testtesttest', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="tallenna-event"]').click({ multiple: true, force: true })
    cy.wait(4000)
    cy.get('li[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(4)
    })
  })
  it('user adds a new kuksa-event', function() {
    cy.get('button[id="kuksa"]').click()
    cy.get('button[id="add-kuksa"]').first().click()
    cy.get('button[id="verify-add-kuksa"]').click()
    cy.get('button[id="omat"]').click()
    cy.get('button[id="edit-event"]').should('not.exist')
  })
})
