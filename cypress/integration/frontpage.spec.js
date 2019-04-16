describe('Front page ', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.get('p[class="login-text"]')
  })
})
describe('After logging in', function() {
  beforeEach('user logs in', function() {
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
    cy.get('div[id="react-select-2--option-0"]').should('not.exist')
    cy.get('div[id="select-tarppo"]').click()
    cy.get('div[id="react-select-2--option-0"]')
  })

})
