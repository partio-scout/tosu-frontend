describe('After logging in', function() {
  beforeEach('user logs in', function() {
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })

  it('', function() {
    cy.visit('http://localhost:3000')
  })

  it('user can open the tarppo menu', function() {
    cy.contains('Tervetuloa tarpojaksi').should('not.exist')
    cy.contains('Valitse tarppo...').click({ force: true })
    cy.contains('Kaupunki-tarppo')
    cy.contains('Kaupunki-tarppo').click({ force: true })
    cy.contains('Lisää aktiviteetti').click({ force: true })
    cy.contains('Kotiseutu').click({ force: true })
  })

  // updates the screen and shows the activities
  it('', function() {
    cy.visit('http://localhost:3000')
  })

  it('user can get additional information', function() {
    cy.get('div[role="button"]')
      .first()
      .click({ multiple: true, force: true })
  })

 it('closes additional info by pressing the escape key', () => {
    cy.get('body').type('{esc}', { force: true })
  })
  
  // updates the screen and shows the activities
  it('', function() {
    cy.visit('http://localhost:3000')
 })

 it('user can remove one activity', function() {
    cy.get('div[role="button"]')
      .first()
      .contains('clear')
      .click({ force: true })
 })

 it('user can empty buffer', function() {
    cy.contains('Tyhjennä')
    cy.contains('Tyhjennä').click({ force: true })
  })
})
