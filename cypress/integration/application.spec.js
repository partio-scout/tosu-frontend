const resetDatabase = () => {}

describe('After logging in', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('user adds a new single event', function() {
    cy.contains('Uusi tapahtuma').click()
    cy.get('input[name="title"').type('testEvent')
    cy.get('input[name="startDate"]').click({ multiple: true, force: true })
    cy.contains('OK').click()
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click()
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.contains('Kokous').click()
    cy.get('input[name="information"').type('testtest')
    cy.contains('Tallenna').click()
    cy.contains('testEvent')
  })
  it('user adds a new repeating event', function() {
    cy.contains('Uusi tapahtuma').click()
    cy.get('input[name="title"').type('testMultipleEvent')
    cy.get('input[name="startDate"]').click({ multiple: true, force: true })
    cy.contains('OK').click()
    cy.get('input[name="startTime"]').click({ multiple: true, force: true })
    cy.contains('OK').click()
    cy.get('div[id="select-type"]').click({ multiple: true, force: true })
    cy.get('input[type="checkbox"]').click({ multiple: true, force: true })
    cy.get('input[name="repeatCount"]').type('{backspace}4', {
      multiple: true,
      force: true,
    })
    cy.contains('Kokous').click({ multiple: true, force: true })
    cy.get('input[name="information"').type('testtesttest')
    cy.contains('Tallenna').click()
    cy.get('ul[class="event-list"] > li').should($lis => {
      expect($lis).to.have.length(4)
    })
  })
})
