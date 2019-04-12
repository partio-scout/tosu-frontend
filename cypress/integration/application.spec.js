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
    cy.contains('Poista tosu').click()
    cy.get('button[id=confirm]').click()
    cy.contains('Ei tosuja')
  })
  it('user adds a new single event', function() {
    cy.contains('Uusi tapahtuma').click()
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
    cy.contains('testEvent')
  })
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
    cy.get('ul[class="event-list"] > li').should($lis => {
      expect($lis).to.have.length(4)
    })
  })
})
