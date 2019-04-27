describe('Tosu-menu', function() {
  beforeEach('user logs in', function() {
    cy.request('http://localhost:3001/scouts/testuser')
    cy.visit('http://localhost:3000')
    cy.wait(4000)
  })

  it('a new tosu', function() {
    cy.get('button[id="tosu_selection"]').click()
    cy.wait(4000)
    cy.get('input[placeholder="Uusi toimintasuunnitelma"]').type('myTosu', {
      multiple: true,
      force: true,
    })
    cy.get('button[id="plus_button"]').click()
    cy.get('button[id="tosu_selection"]').click()
    cy.wait(10000)
    cy.contains('myTosu')
  })

  it('modify tosu', function() {
    cy.wait(10000)
    cy.get('button[id="tosu_selection"]').click()
    cy.wait(4000)
    cy.get('div[id="list_item"]')
      .first()
      .click({ force: true })
    cy.get('div[id="action_buttons"]')
      .first()
      .get('svg[id="pencil_button"]')
      .click({ force: true })
    cy.get('input[id="name"]').type('2', {
      multiple: true,
      force: true,
    })
    cy.contains('päivitä').click({ force: true })
    cy.contains('myTosu2')
  })

  it('delete tosu', function() {
    cy.get('button[id="tosu_selection"]').click({ force: true })
    cy.wait(10000)
    cy.get('div[id="list_item"]')
      .first()
      .click({ force: true })
    cy.get('div[id="action_buttons"]')
      .first()
      .get('svg[id="delete_button"]')
      .click({ force: true })
    cy.get('button[id="confirm_remove"]').click({ force: true })
    cy.wait(10000)
    cy.get('button[id="tosu_selection"]').click({ force: true })
    cy.wait(4000)
    cy.get('input[placeholder="Uusi toimintasuunnitelma"]').should('exist')
    cy.get('button[id="close_button"]').click({ force: true })
  })
})
