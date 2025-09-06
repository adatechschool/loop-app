describe("User Account Management", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.fixture("users").as("users");
  });

  it("should allow user to create account, modify it, and delete it", function () {
    // Step 1: Create new account
    cy.visit("/signup");

    // Fill signup form
    cy.get('input[placeholder="Nom complet"]').type(this.users.newUser.name);
    cy.get('input[placeholder="Nom d\'utilisateur"]').type(
      this.users.newUser.username
    );
    cy.get('input[placeholder="Email"]').type(this.users.newUser.email);
    cy.get('input[placeholder="Mot de passe"]').type(
      this.users.newUser.password
    );

    // Submit signup form
    cy.get('button[type="submit"]').contains("S'inscrire").click();

    // Verify account creation success
    cy.contains("Compte créé !").should("be.visible");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    // Step 2: Navigate to profile and then settings
    cy.get('[aria-label="Options"]').click(); // Menu button in profile
    cy.contains("Paramètres").click();

    // Verify we're on settings page
    cy.url().should("include", "/settings");

    // Step 3: Modify account information
    const newUsername = `${this.users.newUser.username}_modified`;
    const newEmail = `modified_${this.users.newUser.email}`;

    // Find inputs by their FormLabel association
    cy.contains("Nom d'utilisateur")
      .parent()
      .find("input")
      .clear()
      .type(newUsername);
    cy.contains("Email").parent().find("input").clear().type(newEmail);

    // Save modifications
    cy.get("button").contains("Sauvegarder les modifications").click();

    // Verify modification success
    cy.contains("Profil mis à jour.").should("be.visible");

    // Step 4: Delete account
    cy.get("button").contains("Supprimer mon compte").click();

    // Verify account deletion
    cy.contains("Compte supprimé.").should("be.visible");
    cy.url().should("include", "/login");

    // Verify user is logged out (no token in localStorage)
    cy.window().then((window) => {
      const token = window.localStorage.getItem("token");
      expect(token).to.be.null;
    });
  });

  it("should validate signup form fields", function () {
    cy.visit("/signup");

    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Check required field validation
    cy.get('input[placeholder="Nom complet"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });

    cy.get('input[placeholder="Nom d\'utilisateur"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });

    cy.get('input[placeholder="Email"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });

    cy.get('input[placeholder="Mot de passe"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });
  });

  it("should handle signup with existing email", function () {
    cy.visit("/signup");

    // Fill form with existing user email
    cy.get('input[placeholder="Nom complet"]').type("Test User");
    cy.get('input[placeholder="Nom d\'utilisateur"]').type("testuser123");
    cy.get('input[placeholder="Email"]').type(this.users.validUser.email); // Using existing email
    cy.get('input[placeholder="Mot de passe"]').type("password123");

    cy.get('button[type="submit"]').click();

    // Should show error for existing user
    cy.contains("User already exists!").should("be.visible");
  });

  it("should allow navigation back from signup page", () => {
    cy.visit("/signup");

    // Click back button
    cy.get("button").first().click(); // BackButton component

    // Should navigate back to login
    cy.url().should("include", "/login");
  });

  it("should allow profile modification without deletion", function () {
    // First login with existing user using manual login
    cy.visit("/signin");
    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(
      this.users.validUser.username
    );
    cy.get('input[placeholder="Mot de passe"]').type(
      this.users.validUser.password
    );
    cy.get('button[type="submit"]').contains("Se connecter").click();

    // Wait for successful login
    cy.contains("Connexion réussie").should("be.visible");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    // Navigate to settings
    cy.visit("/profile");
    cy.get('[aria-label="Options"]').click();
    cy.contains("Paramètres").click();

    // Modify username only
    const newUsername = `${this.users.validUser.username}_test`;
    cy.contains("Nom d'utilisateur")
      .parent()
      .find("input")
      .clear()
      .type(newUsername);

    // Save changes
    cy.get("button").contains("Sauvegarder les modifications").click();

    // Verify success
    cy.contains("Profil mis à jour.").should("be.visible");

    // Navigate back to profile to verify changes
    cy.visit("/profile");
    cy.contains(newUsername).should("be.visible");
  });
});