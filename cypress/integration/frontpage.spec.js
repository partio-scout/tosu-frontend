describe('Front page ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Toiminnan suunnittelusovellus')
  })
})
describe('After logging in', function() {
  beforeEach('user logs in', function() {
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('login succesful', function() {
    cy.contains('Teppo Testaaja')
  })
  it('user can hide the sidebar', function() {
    cy.contains('Valitse ensimmäisenä suoritettava tarppo.')
    cy.contains('Piilota suunnittelunäkymä').click()
    cy.contains('Valitse ensimmäisenä suoritettava tarppo.').should(
      'not.be.visible'
    )
  })
  it('user can open the form to add a new event', function() {
    cy.contains('Luo uusi tapahtuma').should('not.exist')
    cy.contains('Uusi tapahtuma').click()
    cy.contains('Luo uusi tapahtuma')
  })
  it('user can open the calendar', function() {
    cy.contains('Tänään').should('not.exist')
    cy.contains('Kalenteri').click()
    cy.contains('Tänään')
  })
  it('user can open the tarppo menu', function() {
    cy.contains('Tervetuloa tarpojaksi').should('not.exist')
    cy.contains('Valitse tarppo...').click()
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
