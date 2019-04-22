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

  it('user can empty buffer', function() {
    cy.contains('Tyhjennä')
    cy.contains('Tyhjennä').click({ force: true })
  })
})
