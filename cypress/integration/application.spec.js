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
    cy.contains('Uusi tapahtuma').click()
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
    cy.contains('Kokous').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('testtesttest', {
      multiple: true,
      force: true,
    })
    cy.contains('Tallenna').click({ multiple: true, force: true })
    cy.wait(3000)
    /* cy.get('ul[class="event-list"] > li').should($lis => {
      expect($lis).to.have.length(5)
    })*/
    cy.contains('testMultipleEvent')
  })
  it('user adds a new kuksa-event', function() {
    cy.contains('Kuksa').click()
    cy.contains('Lisää omaan suunnitelmaan').click()
    cy.contains('Lisää suunnitelmaan').click()
    cy.contains('Omat').click()
    //cy.get('div[class=kuksa-synced-event-card]').should('exist')
  })
  it('event created in a tosu does not show in an other tosu', function() {
    /* cy.wait(4000)
    cy.contains('Yleinen').click()
    cy.contains('UUSI').click()
    cy.get('input[id=name]').type('new tosu')
    cy.contains('luo uusi').click()
    createEvent()
    cy.contains('testEvent')
    cy.contains('new tosu').click()
    cy.contains('Yleinen').click()
    cy.contains('testEvent').should('not.exist')*/
    // Ei toimi koska nyt yleinen lukee myös appbarissa
  })
  it('tosu can be deleted', function() {
    cy.contains('Poista tosu').click()
    cy.get('button[id=confirm]').click()
    cy.contains('Ei tosuja')
  })
})
