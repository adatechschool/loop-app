describe("User login", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.fixture("users").as("users");
  });

  interface UsersFixture {
    validUser: { username: string; password: string };
    invalidUser: { username: string; password: string };
    [key: string]: any;
  }

  it("it should redirect to homepage when successful login", function (this: {
    users: UsersFixture;
  }) {
    cy.visit("/signin", { failOnStatusCode: false });

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(
      this.users.validUser.username
    );

    cy.get('input[placeholder="Mot de passe"]').type(
      this.users.validUser.password
    );

    cy.get('button[type="submit"]').contains("Se connecter").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    cy.contains("Connexion réussie").should("be.visible");

    cy.window().its("localStorage.token").should("exist");
  });

  it("it should display an error for invalid credentials", function (this: {
    users: UsersFixture;
  }) {
    cy.visit("/signin");

    cy.contains("Connexion").should("be.visible");

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
      .should("be.visible")
      .type(this.users.invalidUser.username);

    cy.get('input[placeholder="Mot de passe"]')
      .should("be.visible")
      .type(this.users.invalidUser.password);

    cy.get('button[type="submit"]')
      .contains("Se connecter")
      .should("be.visible")
      .click();

    cy.contains("Nom d'utilisateur ou mot de passe invalide").should(
      "be.visible"
    );

    cy.url().should("include", "/signin");

    cy.window().then((window) => {
      const token = window.localStorage.getItem("token");
      expect(token).to.be.null;
    });
  });

  it("it should allow to show/hide the password", () => {
    cy.visit("/signin");

    cy.get('input[placeholder="Mot de passe"]').type("motdepasse123");

    cy.get('input[placeholder="Mot de passe"]').should(
      "have.attr",
      "type",
      "password"
    );

    cy.get('button[aria-label="Afficher le mot de passe"]').click();

    cy.get('input[placeholder="Mot de passe"]').should(
      "have.attr",
      "type",
      "text"
    );

    cy.get('button[aria-label="Cacher le mot de passe"]').click();

    cy.get('input[placeholder="Mot de passe"]').should(
      "have.attr",
      "type",
      "password"
    );
  });

  it("it should validate required fields", () => {
    cy.visit("/signin");

    cy.get('button[type="submit"]').click();

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });

    cy.get('input[placeholder="Mot de passe"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });
  });

  it("it should allow to navigate to the signup page", () => {
    cy.visit("/login");

    cy.get("button").contains("S'inscrire").click();

    cy.url().should("include", "/signup");
  });

  it("it should allow to navigate back from the login page", () => {
    cy.visit("/login");
    cy.get("button").contains("Se connecter").click();
    cy.url().should("include", "/signin");

    cy.get("button").first().click();
  });
});
