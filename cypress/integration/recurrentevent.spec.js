import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}

describe('After logging in', function() {
  beforeEach('user logs in', function() {
    cy.wait(2000)
    resetDatabase()
    cy.wait(2000)
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
    cy.wait(2000)
  })
  it('initialize tosu', function() {})
  it('user can delete all same recurrent events', function() {
    //create recurrent event
    cy.reload()
    cy.get('button[id="uusi-event"]').click()
    cy.get('input[name="title"').type('makeMultipleEvents', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"]').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('input[name="repeatCount"]').type('{backspace}3', {
      multiple: true,
      force: true,
    })
    cy.get('li[id="tyyppi-leiri"]').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('recurrentevent', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="tallenna-event"]').click({ multiple: true, force: true })
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
    cy.reload()
    cy.get('button[id="uusi-event"]').click()
    cy.get('input[name="title"').type('makeMultipleEvents', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"]').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('input[name="repeatCount"]').type('{backspace}7', {
      multiple: true,
      force: true,
    })
    cy.get('li[id="tyyppi-vaellus"]').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('recurrentevent', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="tallenna-event"]').click({ multiple: true, force: true })
    cy.wait(4000)
    //delete only one event
    cy.get('button[id="delete-event"]')
      .first()
      .click()
    cy.get('button[id="delete-one-recurrent-event"]').click()
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(6)
    })
  })

  it('eventgroup can be created when last date is given', function() {
    cy.get('button[id="uusi-event"]').click()
    cy.get('input[name="title"').type('manyEvents', {
      multiple: true,
      force: true,
    })
    cy.get('input[name="formStartDate"]').click()
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('[name="lastDate"]').type(
      '{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}{rightarrow}'
    )
    cy.contains('OK').click()
    cy.get('input[name="repeatCount"]').should('have.value', '3')
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('li[id="tyyppi-leiri"]').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('recurrentevent', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="tallenna-event"]').click({ multiple: true, force: true })
    cy.wait(4000)
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(3)
    })
  })
})
