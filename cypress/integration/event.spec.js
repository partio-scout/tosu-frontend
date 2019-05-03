import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
const createEvent = () => {
  cy.get('button[id=uusi-event]')
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
    cy.wait(6000)
    createEvent()
    cy.contains('testEvent')
  })

  it('user can delete an event', function() {
    cy.wait(6000)
    createEvent()
    cy.get('button[id="delete-event"]').click()
    cy.get('[id="confirm-delete"]').click()
    cy.get('div[id="event-list-element"]').should($lis => {
      expect($lis).to.have.length(0)
    })
  })

  it('user can modify event information on eventcard', function() {
    cy.wait(6000)
    createEvent()
    cy.get('button[id="expansion-arrow"]').click()
    cy.get('[id="info-edit-area"]').type('editinfo')
    cy.get('[id="info-edit-area"]').should('have.value', 'testtesteditinfo')
  })

  it('user can modify event information on edit event form', function() {
    cy.wait(6000)
    //create event
    cy.get('button[id=uusi-event]')
      .should('be.visible')
      .click()
    cy.get('input[name="title"').type('tapahtuma')
    cy.get('input[name="formStartDate"').click()
    cy.contains('OK').click({ force: true })
    cy.get('input[name="startTime"]').click()
    cy.contains('OK').click({ force: true })
    cy.get('div[id="select-type"]').click()
    cy.contains('Vaellus').click({ force: true })
    cy.contains('Tallenna').click()
    cy.wait(1000)
    //edit information
    cy.get('button[id="edit-event"]').click()
    cy.get('input[name="information"]').type('importantinfo')
    cy.get('button[id="tallenna-event"]').click()
    cy.get('button[id="expansion-arrow"]').click()
    cy.get('[id="info-edit-area"]').should('have.value', 'importantinfo')
  })

  it('user can modify event title', function() {
    cy.wait(6000)
    createEvent()
    cy.get('button[id="edit-event"]').click()
    cy.get('input[name="title"')
      .clear()
      .type('newtitle')
    cy.get('button[id="tallenna-event"]').click()
    cy.get('div[id="event-name"]').contains('newtitle')
  })

  it('user can change event type', function() {
    cy.wait(10000)
    createEvent()
    cy.get('button[id="expansion-arrow"]').click()
    cy.get('span[id="type-and-start"]').contains('Kokous alkaa:')
    cy.get('button[id="edit-event"]').click()
    cy.get('div[id="select-type"]').click()
    cy.contains('Muu tapahtuma').click({ force: true })
    cy.get('button[id="tallenna-event"]').click()
    cy.wait(3000)
    cy.get('span[id="type-and-start"]').contains('Muu tapahtuma alkaa:')
  })
})
