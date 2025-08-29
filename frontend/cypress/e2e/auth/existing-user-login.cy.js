// cypress/e2e/auth/existing-user-login.cy.js

describe('Existing User Authentication', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    cy.visit('/')
  })

  it('should allow login with existing user credentials', () => {
    // Use the existing user credentials from environment config
    cy.loginWithExistingUser()
    
    // Verify user is logged in
    cy.shouldBeAuthenticated()
    
    // Should be redirected to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Should see user interface elements that indicate successful login
    cy.get('[data-testid="user-menu"], .user-menu, .profile-link').should('exist')
  })

  it('should maintain session across page reloads', () => {
    // Login with existing user
    cy.loginWithExistingUser()
    
    // Reload the page
    cy.reload()
    
    // Should still be authenticated
    cy.shouldBeAuthenticated()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should allow logout after login with existing user', () => {
    // Login with existing user
    cy.loginWithExistingUser()
    
    // Find and click logout button
    cy.get('[data-testid="logout-button"], .logout-button, button').contains(/d[ée]connexion|logout|se d[ée]connecter/i).click()
    
    // Should be logged out
    cy.shouldNotBeAuthenticated()
    
    // Should redirect to appropriate page (login or home)
    cy.url().should('match', /(login|signin|$)/)
  })
})