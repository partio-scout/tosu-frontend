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
