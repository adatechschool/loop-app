// cypress/support/commands.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login user with session management
     * @param username - Username or email
     * @param password - Password
     * @example cy.login('user@example.com', 'password123')
     */
    login(username: string, password: string): Chainable<void>

    /**
     * Custom command to login with existing user credentials from environment
     * @example cy.loginWithExistingUser()
     */
    loginWithExistingUser(): Chainable<void>

    /**
     * Custom command to signup new user
     * @param userData - User registration data
     * @example cy.signup({ name: 'John', username: 'john', email: 'john@example.com', password: 'pass' })
     */
    signup(userData: {
      name: string
      username: string
      email: string
      password: string
      profilePicture?: string
    }): Chainable<void>

    /**
     * Custom command to create a test user
     * @returns Chainable with created user data
     * @example cy.createTestUser().then(user => { ... })
     */
    createTestUser(): Chainable<{
      name: string
      username: string
      email: string
      password: string
    }>

    /**
     * Custom command to add a place
     * @param placeData - Place data
     * @example cy.addPlace({ name: 'Test Place', description: '...', address: '...' })
     */
    addPlace(placeData: {
      name: string
      description: string
      address: string
      types?: string[]
      accessibility?: boolean
      images?: string[]
    }): Chainable<void>

    /**
     * Custom command to clean up test data
     * @example cy.cleanupTestData()
     */
    cleanupTestData(): Chainable<void>

    /**
     * Custom command to intercept API calls
     * @param method - HTTP method
     * @param url - API endpoint
     * @param alias - Alias name
     * @param response - Mock response
     * @example cy.interceptAPI('GET', '/places', 'getPlaces', { places: [] })
     */
    interceptAPI(method: string, url: string, alias: string, response: any): Chainable<void>

    /**
     * Custom command to wait for map to load
     * @example cy.waitForMap()
     */
    waitForMap(): Chainable<void>

    /**
     * Custom command to check if user is authenticated
     * @example cy.shouldBeAuthenticated()
     */
    shouldBeAuthenticated(): Chainable<void>

    /**
     * Custom command to check if user is not authenticated
     * @example cy.shouldNotBeAuthenticated()
     */
    shouldNotBeAuthenticated(): Chainable<void>

    /**
     * Custom command to set mobile viewport
     * @example cy.setMobileViewport()
     */
    setMobileViewport(): Chainable<void>

    /**
     * Custom command to set desktop viewport
     * @example cy.setDesktopViewport()
     */
    setDesktopViewport(): Chainable<void>
  }
}