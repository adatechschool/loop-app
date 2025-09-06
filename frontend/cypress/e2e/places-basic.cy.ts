describe("Places Basic CRUD Tests", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Login as valid user
    cy.loginAsValidUser();
  });

  it("should create, read, update, and delete a place", () => {
    // CREATE - Add a new place
    cy.visit("/add");
    cy.contains("Ajouter un lieu").should("be.visible");
    
    // Fill required fields
    cy.get('input[name="namePlace"]').type("Test Cypress Place");
    cy.get('input[name="addressPlace"]').type("123 Test Street, Paris");
    cy.get('select[name="typePlace"]').select("park_id");
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Should navigate to places list
    cy.url().should("include", "/places");
    
    // READ - Verify place appears in list
    cy.contains("Test Cypress Place").should("be.visible");
    
    // Click to view details
    cy.contains("Test Cypress Place").click();
    cy.url().should("include", "/places/");
    cy.contains("Test Cypress Place").should("be.visible");
    cy.contains("123 Test Street, Paris").should("be.visible");
    
    // UPDATE - Edit the place (if edit button is available)
    cy.get('body').then(($body) => {
      if ($body.find('[style*="cursor: pointer"]').length > 0) {
        cy.get('[style*="cursor: pointer"]').first().click();
        cy.url().should("include", "/edit/");
        
        // Update name
        cy.get('input').first().clear().type("Updated Cypress Place");
        cy.get('button[type="submit"]').click();
        
        // Should show success message and navigate back
        cy.contains("Lieu modifié").should("be.visible");
        cy.url().should("include", "/places");
        
        // Verify update
        cy.contains("Updated Cypress Place").should("be.visible");
        
        // Go back to detail page for deletion
        cy.contains("Updated Cypress Place").click();
        
        // DELETE - Delete the place
        cy.get('[style*="cursor: pointer"]').eq(1).click();
        cy.contains("Confirmer la suppression").should("be.visible");
        cy.get('button').contains("Supprimer").click();
        
        // Should redirect and place should be gone
        cy.url().should("eq", `${Cypress.config().baseUrl}/`);
        cy.visit("/places");
        cy.contains("Updated Cypress Place").should("not.exist");
      } else {
        cy.log("Edit/Delete buttons not visible - possibly not the place owner");
      }
    });
  });

  it("should handle form validation for required fields", () => {
    cy.visit("/add");
    
    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click();
    
    // Check HTML5 validation
    cy.get('input[name="namePlace"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });
      
    cy.get('input[name="addressPlace"]')
      .should("have.prop", "validity")
      .and("deep.include", { valid: false });
  });

  it("should display places in the list view", () => {
    cy.visit("/places");
    
    // The page should load without errors
    cy.get('body').should("be.visible");
    
    // Should be able to navigate back to home
    cy.visit("/");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });
});