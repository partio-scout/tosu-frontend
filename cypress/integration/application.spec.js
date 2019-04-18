import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}

describe('After logging in', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('tosu can be deleted', function() {
    cy.get('button[id="tosu-delete"]').click()
    cy.get('button[id="confirm"]').click()
    cy.get('button[id="tosu-button"]').contains('Ei tosuja')
  })
  it('user adds a new single event', function() {
    cy.get('button[id="uusi-event"]').click()
    cy.get('input[name="title"').type('testEvent', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('li[id="tyyppi-kokous"]').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('testtest', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="tallenna-event"]').click({ multiple: true, force: true })
    cy.get('div[id="event-name"]').contains('testEvent')
  })
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
    cy.get('li[id="event-card-in-list"]').should($lis => {
      expect($lis).to.have.length(4)
    })
  })
  it('user adds a new kuksa-event', function() {
    cy.get('button[id="kuksa"]').click()
    cy.contains('Lisää omaan suunnitelmaan').click()
    cy.contains('Lisää suunnitelmaan').click()
    cy.contains('Omat').click()
    cy.contains('Mall_Åldersgruppsevenemang')
  })
})
