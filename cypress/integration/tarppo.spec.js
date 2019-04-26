describe('Tarppo menu', function() {
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
    cy.contains('Kotiseutu')
  })

  // updates the screen and shows the activities
  it('', function() {
    cy.visit('http://localhost:3000')
  })

  it('user can get additional information', function() {
    cy.wait(4000)
    cy.get('div[role="button"]')
      .first()
      .click({ multiple: true, force: true })
    cy.get('div[role="tablist"]')
      .contains('Vinkit')
      .click({ force: true })
    cy.contains('Toteutusvinkit')
  })

  it('closes additional info by pressing the escape key', () => {
    cy.wait(4000)
    cy.get('body').type('{esc}', { force: true })
    cy.get('div[role="tablist"]').should('not.exist')
  })

  // updates the screen and shows the activities
  it('', function() {
    cy.visit('http://localhost:3000')
  })

  it('user can remove one activity', function() {
    cy.get('[id="delete-activity"]')
      .first()
      .click()
    cy.get('[id="delete-activity"]').should($lis => {
      expect($lis).to.have.length(1)
    })
  })

  it('user can empty buffer', function() {
    cy.contains('Tyhjennä')
    cy.contains('Tyhjennä').click({ force: true })
    cy.get('div[role="button"]').should('not.exist')
  })
})
