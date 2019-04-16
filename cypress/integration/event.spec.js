import scoutService from '../../src/services/scout'

const resetDatabase = () => {
  scoutService.deleteScout('12345')
}
const createEvent = () => {
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
}
