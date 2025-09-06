/// <reference types="cypress" />

describe("Loop App Smoke Tests", () => {
  it("should be able to visit the homepage", () => {
    cy.visit("/");
    // This test just ensures the app is running and accessible
    cy.get("body").should("be.visible");
  });

  it("should be able to visit the login page", () => {
    cy.visit("/signin");
    cy.contains("Connexion").should("be.visible");
  });

  it("should be able to navigate to places page", () => {
    // First login to access protected routes
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
      cy.visit("/places");
      cy.get("body").should("be.visible");
    });
  });

  it("should be able to navigate to add place page", () => {
    // First login to access protected routes
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
      cy.visit("/add");
      cy.contains("Ajouter un lieu").should("be.visible");
    });
  });
});