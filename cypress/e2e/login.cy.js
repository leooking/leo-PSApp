import { app } from '../utils/variables'

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit(app)
  })

  it('should login', () => {
    cy.login()
  })

  it('should logout', () => {
    cy.login()
    cy.get('#logout').click()
    cy.get('#sign-in').should('exist')
  })
})
