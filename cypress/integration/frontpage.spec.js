import scoutService from '../../src/services/scout'
const resetDatabase = () => {
  scoutService.deleteScout('12345')
}

describe('Front page ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.get('h4[id="toiminnansuunnittelu"]')
  })
})
describe('After logging in', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('', function() {
    cy.visit('http://localhost:3000')
  })
  it('login succesful', function() {
    cy.get('div[id="scout-name"]')
  })
  it('user can hide the sidebar', function() {
    /* Kommentoitu, koska tosu-jutut muuttuvat vielä
    cy.get('div[id="select-tarppo"]')
    cy.get('input[type="checkbox"]').click()
    cy.get('div[id="select-tarppo"]').should(
      'not.be.visible'
    )*/
  })
  it('user can open the form to add a new event', function() {
    cy.get('div[id="event-form-title"]').should('not.exist')
    cy.get('button[id="uusi-event"]').click()
    cy.get('div[id="event-form-title"]')
  })
  it('user can open the calendar', function() {
    cy.get('button[name="tanaan"]').should('not.exist')
    cy.get('button[id="kalenteri"]').click()
    cy.get('button[name="tanaan"]')
  })
  it('user can open the tarppo menu', function() {
    cy.get('div[id="react-select-2--option-0"]').should('not.exist')
    cy.get('div[id="select-tarppo"]').click()
    cy.get('div[id="react-select-2--option-0"]')
  })
})
