// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command for login
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/signin')
  cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(username)
  cy.get('input[placeholder="Mot de passe"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  cy.window().its('localStorage.token').should('exist')
})

// Custom command for authenticated login using fixtures
Cypress.Commands.add('loginAsValidUser', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.validUser.username, users.validUser.password)
  })
})

// Custom command to create a place via API
Cypress.Commands.add('createPlaceViaAPI', (placeData) => {
  cy.window().then((window) => {
    const token = window.localStorage.getItem('token')
    cy.request({
      method: 'POST',
      url: `${Cypress.env('REACT_APP_LOOP_API_URL') || 'http://localhost:5000'}/api/places`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: placeData
    }).then((response) => {
      expect(response.status).to.eq(201)
      return response.body.place
    })
  })
})

// Custom command to delete a place via API
Cypress.Commands.add('deletePlaceViaAPI', (placeId) => {
  cy.window().then((window) => {
    const token = window.localStorage.getItem('token')
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('REACT_APP_LOOP_API_URL') || 'http://localhost:5000'}/api/places/${placeId}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      failOnStatusCode: false
    })
  })
})

// Custom command to get all places via API
Cypress.Commands.add('getPlacesViaAPI', () => {
  cy.window().then((window) => {
    const token = window.localStorage.getItem('token')
    cy.request({
      method: 'GET',
      url: `${Cypress.env('REACT_APP_LOOP_API_URL') || 'http://localhost:5000'}/api/places`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      return response.body.places
    })
  })
})

// Custom command to fill place form
Cypress.Commands.add('fillPlaceForm', (placeData) => {
  if (placeData.name) {
    cy.get('input[name="namePlace"]').clear().type(placeData.name)
  }
  if (placeData.address) {
    cy.get('input[name="addressPlace"]').clear().type(placeData.address)
  }
  if (placeData.description) {
    cy.get('textarea[name="descriptionPlace"]').clear().type(placeData.description)
  }
  if (placeData.types && placeData.types.length > 0) {
    cy.get('select[name="typePlace"]').select(placeData.types[0])
  }
  if (placeData.accessibility !== undefined) {
    // Toggle accessibility switch if needed - look for the switch input
    cy.get('input[name="accessibilityPlace"]').then(($switch) => {
      const isChecked = $switch.prop('checked')
      if ((placeData.accessibility && !isChecked) || (!placeData.accessibility && isChecked)) {
        cy.wrap($switch).click()
      }
    })
  }
})

// Custom command to wait for navigation and verify URL
Cypress.Commands.add('verifyUrlContains', (urlPart) => {
  cy.url().should('include', urlPart)
})