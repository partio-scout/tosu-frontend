import scoutService from '../../src/services/scout'
const resetDatabase = () => {
  scoutService.deleteScout('12345')
}

describe('Front page ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.get('p[class="login-text"]')
  })
})
describe('After logging in', function() {
  beforeEach('user logs in', function() {
    resetDatabase()
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('login succesful', function() {
    cy.get('div[class="account-name-and-button"]')
  })
  it('user can hide the sidebar', function() {
    cy.get('div[id="select-tarppo"]')
    cy.get('input[type="checkbox"]').click()
    cy.get('div[id="select-tarppo"]').should(
      'not.be.visible'
    )
  })
  it('user can open the form to add a new event', function() {
    cy.get('div[name="luo-uusi-tapahtuma"]').should('not.exist')
    cy.get('button[id="uusi"]').click()
    cy.get('div[name="luo-uusi-tapahtuma"]')
  })
  it('user can open the calendar', function() {
    cy.get('button[name="tanaan"]').should('not.exist')
    cy.get('button[id="kalenteri"]').click()
    cy.get('button[name="tanaan"]')
  })
  it('user can open the tarppo menu', function() {
    cy.contains('Tervetuloa tarpojaksi').should('not.exist')
    cy.wait(2000)
    cy.get('span[class=Select-arrow]').click()
    cy.contains('Tervetuloa tarpojaksi')
  })
  it('user can open the tarppo menu', function() {
    cy.contains('Tervetuloa tarpojaksi').should('not.exist')
    cy.contains('Valitse tarppo...').click({ force: true })
    cy.contains('Kaupunki-tarppo')
    cy.contains('Kaupunki-tarppo').click({ force: true })
    cy.contains('Lisää aktiviteetti').click({ force: true })
    cy.contains('Kotiseutu').click({ force: true })
  })

})
