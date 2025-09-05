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
})

// Custom command to create a place
Cypress.Commands.add('createPlace', (placeData) => {
  cy.visit('/add')
  cy.get('input[placeholder="Nom"]').type(placeData.name)
  cy.get('input[placeholder="Adresse"]').type(placeData.address)
  if (placeData.description) {
    cy.get('textarea[placeholder="Décris-nous ta dernière découverte !"]').type(placeData.description)
  }
  if (placeData.types && placeData.types.length > 0) {
    cy.get('select[name="typePlace"]').select(placeData.types[0])
  }
  if (placeData.accessibility) {
    cy.get('input[id="accessibilityPlace"]').check()
  }
  cy.get('button[type="submit"]').contains('Ajouter').click()
})

// Custom command to navigate to place detail
Cypress.Commands.add('goToFirstPlaceDetail', () => {
  cy.visit('/places')
  cy.get('body').then(($body) => {
    if (!$body.text().includes('Aucun lieux disponibles')) {
      cy.get('div[cursor="pointer"]').first().click()
    }
  })
})

// Custom command to login and ensure authenticated state
Cypress.Commands.add('loginAndWait', (username, password) => {
  cy.login(username, password)
  cy.url().should('include', '/')
  cy.window().then((window) => {
    const token = window.localStorage.getItem('token')
    expect(token).to.exist
  })
})