// Test du workflow complet de gestion de compte utilisateur
describe("User Account Complete Workflow", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.fixture("users").as("users");
  });

  it("should complete the full user lifecycle: create account → modify profile → delete account", function () {
    // ===== ÉTAPE 1: CRÉATION DU COMPTE =====
    cy.log("Starting account creation");
    
    // Utiliser la commande personnalisée pour l'inscription
    cy.signup(
      this.users.testUserWorkflow.name,
      this.users.testUserWorkflow.username,
      this.users.testUserWorkflow.email,
      this.users.testUserWorkflow.password
    );

    // Vérifier la création réussie du compte
    cy.contains("Compte créé !").should("be.visible");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.log("Account created successfully");

    // ===== ÉTAPE 2: MODIFICATION DU PROFIL =====
    cy.log("Starting profile modification");
    
    // Utiliser la commande personnalisée pour aller aux paramètres
    cy.goToSettings();

    // Vérifier qu'on est sur la page des paramètres
    cy.url().should("include", "/settings");
    cy.contains("Paramètres du compte").should("be.visible");

    // Modifier les informations du compte
    const newUsername = `${this.users.testUserWorkflow.username}_modifié`;
    const newEmail = `modifié_${this.users.testUserWorkflow.email}`;

    cy.contains("Nom d'utilisateur").parent().find("input").clear().type(newUsername);
    cy.contains("Email").parent().find("input").clear().type(newEmail);

    // Sauvegarder les modifications
    cy.get("button").contains("Sauvegarder les modifications").click();

    // Vérifier que la modification a réussi
    cy.contains("Profil mis à jour.").should("be.visible");
    cy.log("Profile modified successfully");

    // Vérifier que les changements sont persistés
    cy.visit("/profile");
    cy.contains(newUsername).should("be.visible");

    // ===== ÉTAPE 3: SUPPRESSION DU COMPTE =====
    cy.log("Starting account deletion");
    
    // Retourner aux paramètres pour supprimer le compte
    cy.visit("/settings");
    
    // Supprimer le compte
    cy.get("button").contains("Supprimer mon compte").click();

    // Vérifier la suppression réussie
    cy.contains("Compte supprimé.").should("be.visible");
    cy.url().should("include", "/login");

    // Vérifier que l'utilisateur est déconnecté
    cy.window().then((window) => {
      const token = window.localStorage.getItem("token");
      expect(token).to.be.null;
    });

    cy.log("Account deleted successfully - workflow completed");
  });

  it("should handle errors during the workflow", function () {
    // Test avec un email existant
    cy.visit("/signup");
    
    cy.get('input[placeholder="Nom complet"]').type("Test User");
    cy.get('input[placeholder="Nom d\'utilisateur"]').type("testuser123");
    cy.get('input[placeholder="Email"]').type(this.users.validUser.email);
    cy.get('input[placeholder="Mot de passe"]').type("password123");
    
    cy.get('button[type="submit"]').click();
    
    // Vérifier que l'erreur est affichée
    cy.contains("User already exists!").should("be.visible");
  });
});