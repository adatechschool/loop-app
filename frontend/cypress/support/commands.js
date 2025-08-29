// cypress/support/commands.js

// Custom command for user login
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/signin')
    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(username)
    cy.get('input[placeholder="Mot de passe"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.window().its('localStorage.token').should('exist')
  })
})

// Custom command for user signup
Cypress.Commands.add('signup', (userData) => {
  cy.visit('/signup')
  cy.get('input[placeholder="Nom complet"]').type(userData.name)
  cy.get('input[placeholder="Nom d\'utilisateur"]').type(userData.username)
  cy.get('input[placeholder="Email"]').type(userData.email)
  cy.get('input[placeholder="Mot de passe"]').type(userData.password)
  
  if (userData.profilePicture) {
    cy.get('input[type="file"]').selectFile(userData.profilePicture)
  }
  
  cy.get('button[type="submit"]').click()
})

// Custom command for creating a test user
Cypress.Commands.add('createTestUser', () => {
  const timestamp = Date.now()
  const testUser = {
    name: `Test User ${timestamp}`,
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'testpassword123'
  }
  
  cy.signup(testUser)
  return cy.wrap(testUser)
})

// Custom command for adding a place
Cypress.Commands.add('addPlace', (placeData) => {
  cy.visit('/add')
  cy.get('input[placeholder*="nom"]', { timeout: 10000 }).should('be.visible').type(placeData.name)
  cy.get('textarea[placeholder*="description"]').type(placeData.description)
  cy.get('input[placeholder*="adresse"]').type(placeData.address)
  
  // Select place types if provided
  if (placeData.types && placeData.types.length > 0) {
    placeData.types.forEach(type => {
      cy.get(`input[value="${type}"]`).check({ force: true })
    })
  }
  
  // Upload images if provided
  if (placeData.images && placeData.images.length > 0) {
    cy.get('input[type="file"]').selectFile(placeData.images)
  }
  
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/')
})

// Custom command for deleting all test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would typically make API calls to clean up test data
  // For now, we'll just clear localStorage
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Custom command to intercept API calls
Cypress.Commands.add('interceptAPI', (method, url, alias, response) => {
  cy.intercept(method, `**/api${url}`, response).as(alias)
})

// Custom command to wait for map to load
Cypress.Commands.add('waitForMap', () => {
  cy.get('.leaflet-container', { timeout: 15000 }).should('be.visible')
  cy.get('.leaflet-tile-loaded').should('exist')
})

// Custom command to check if user is authenticated
Cypress.Commands.add('shouldBeAuthenticated', () => {
  cy.window().its('localStorage.token').should('exist')
})

// Custom command to check if user is not authenticated
Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.window().its('localStorage.token').should('not.exist')
})

// Custom command for mobile viewport
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667)
})

// Custom command for desktop viewport
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720)
})