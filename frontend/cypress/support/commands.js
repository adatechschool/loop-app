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

// Custom command for signup
Cypress.Commands.add('signup', (name, username, email, password) => {
  cy.visit('/signup')
  cy.get('input[placeholder="Nom complet"]').type(name)
  cy.get('input[placeholder="Nom d\'utilisateur"]').type(username)
  cy.get('input[placeholder="Email"]').type(email)
  cy.get('input[placeholder="Mot de passe"]').type(password)
  cy.get('button[type="submit"]').contains("S'inscrire").click()
})

// Custom command to navigate to settings
Cypress.Commands.add('goToSettings', () => {
  cy.visit('/profile')
  cy.get('[aria-label="Options"]').click()
  cy.contains('Paramètres').click()
})