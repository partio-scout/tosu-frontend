import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
const createMultipleEvent = () => {
  cy.get('button[id=uusi-event]')
    .should('be.visible')
    .click()
  cy.get('input[name="title"').type('testMultiple', {
    multiple: true,
    force: true,
  })
  cy.get('input[name="formStartDate"').click()
  cy.contains('OK').click({ multiple: true, force: true })
  cy.get('input[name="startTime"]').click({ multiple: true })
  cy.contains('OK').click({ multiple: true, force: true })
  cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
  cy.get('input[name="repeatCount"]').type('{backspace}3', {
    multiple: true,
    force: true,
  })
  cy.get('div[id="select-type"]').click({ multiple: true, force: true })
  cy.contains('Kokous').click({ multiple: true, force: true })
  cy.get('input[name="information"').type('recurrentevent', {
    multiple: true,
    force: true,
  })
  cy.contains('Tallenna').click({ multiple: true, force: true })
}
describe('Creating and deleting recurrent events', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.wait(4000)
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('initialize tosu', function() {})
  it('user can delete all same recurrent events', function() {
    createMultipleEvent()
    cy.wait(4000)
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(3)
    })
    //delete all same recurrent events
    cy.get('button[id="delete-event"]')
      .first()
      .click()
    cy.get('button[id="delete-recurrent-events"]').click()
    cy.get('div[id="event-list-element"]').should('not.exist')
  })

  it('user can delete only one of recurring events', function() {
    //create recurrent event
    createMultipleEvent()
    cy.wait(4000)
    //delete only one event
    cy.get('button[id="delete-event"]')
      .first()
      .click()
    cy.get('button[id="delete-one-recurrent-event"]').click()
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(2)
    })
  })

  it('eventgroup can be created when last date is given', function() {
    cy.get('button[id=uusi-event]')
      .should('be.visible')
      .click()
    cy.get('input[name="title"').type('testMultiple', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('[name="lastDate"]').type(
      '{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'
    )
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.contains('Kokous').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('recurrentevent', {
      multiple: true,
      force: true,
    })
    cy.contains('Tallenna').click({ multiple: true, force: true })
    cy.wait(4000)
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(3)
    })
  })
})
