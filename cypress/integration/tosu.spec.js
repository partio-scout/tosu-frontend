describe('After logging in', function() {
  beforeEach('user logs in', function() {
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
  })
  it('tosu can be removed', function() {
    cy.contains('Poista tosu').click()
    cy.get('button[id=confirm]').click()
  })
  it('tosu can be created', function() {
    cy.contains('Ei tosuja').click({ multiple: true, force: true })
    cy.contains('UUSI').click({ multiple: true, force: true })
    cy.get('input[id="name"').type('omaTosu', {
      multiple: true,
      force: true,
    })
    cy.contains('luo uusi').click({ multiple: true, force: true })
  })
})
