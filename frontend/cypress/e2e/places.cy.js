describe('Tests CRUD des lieux', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    
    cy.fixture('users').as('users')
    cy.fixture('places').as('places')
  })

  // Helper function to login before testing places
  const loginAsValidUser = function() {
    cy.get('@users').then((users) => {
      cy.login(users.adminUser.username, users.adminUser.password)
      cy.url().should('include', '/')
      cy.window().then((window) => {
        const token = window.localStorage.getItem('token')
        expect(token).to.exist
      })
    })
  }

  describe('Création de lieu (Create)', () => {
    it('devrait permettre de créer un nouveau lieu', function() {
      loginAsValidUser()
      
      // Navigate to add page
      cy.visit('/add')
      cy.contains('Ajouter un lieu').should('be.visible')

      // Fill the form
      cy.get('input[placeholder="Nom"]').should('be.visible').type(this.places.testPlace.name)
      cy.get('input[placeholder="Adresse"]').should('be.visible').type(this.places.testPlace.address)
      cy.get('textarea[placeholder="Décris-nous ta dernière découverte !"]').should('be.visible').type(this.places.testPlace.description)
      
      // Select category
      cy.get('select[name="typePlace"]').should('be.visible').select('park_id')
      
      // Set accessibility
      if (this.places.testPlace.accessibility) {
        cy.get('input[id="accessibilityPlace"]').check()
      }
      
      // Submit form
      cy.get('button[type="submit"]').contains('Ajouter').click()
      
      // Should redirect to places list or show success
      cy.url().should('match', /\/(places|)$/)
      
      // Verify success message or redirection
      cy.contains('créé').should('be.visible', { timeout: 10000 })
    })

    it('devrait valider les champs requis lors de la création', function() {
      loginAsValidUser()
      
      cy.visit('/add')
      
      // Try to submit without filling required fields
      cy.get('button[type="submit"]').click()
      
      // Check that required fields are highlighted or validation messages appear
      cy.get('input[placeholder="Nom"]').should('have.prop', 'validity').and('deep.include', { valid: false })
      cy.get('input[placeholder="Adresse"]').should('have.prop', 'validity').and('deep.include', { valid: false })
    })
  })

  describe('Lecture de lieux (Read)', () => {
    it('devrait afficher la liste des lieux', function() {
      loginAsValidUser()
      
      cy.visit('/places')
      cy.contains('Lieux à proximité').should('be.visible')
      
      // Should show places or "no places" message
      cy.get('body').should('contain.text', 'Aucun lieux disponibles').or('contain', 'places')
    })

    it('devrait permettre de voir les détails d\'un lieu', function() {
      loginAsValidUser()
      
      cy.visit('/places')
      
      // Check if there are places to view
      cy.get('body').then(($body) => {
        if ($body.text().includes('Aucun lieux disponibles')) {
          cy.log('No places available to test detail view')
        } else {
          // Click on first place if available - Card component with cursor pointer
          cy.get('[data-testid="place-card"], div[cursor="pointer"], .chakra-ui-box').first().click()
          
          // Should navigate to detail page
          cy.url().should('match', /\/places\/[^/]+$/)
          
          // Should show place details
          cy.get('body').should('contain.text', 'Voir sur la map')
        }
      })
    })
  })

  describe('Modification de lieu (Update)', () => {
    it('devrait permettre de modifier un lieu existant', function() {
      loginAsValidUser()
      
      cy.visit('/places')
      
      // Check if there are places to edit
      cy.get('body').then(($body) => {
        if ($body.text().includes('Aucun lieux disponibles')) {
          cy.log('No places available to test editing')
        } else {
          // Click on first place to go to detail page
          cy.get('div[cursor="pointer"]').first().click()
          
          // Look for edit button
          cy.get('body').then(($detailBody) => {
            if ($detailBody.find('svg').length > 0) {
              // Click edit button (EditIcon)
              cy.get('svg').first().click()
              
              // Should navigate to edit page
              cy.url().should('match', /\/edit\/[^/]+$/)
              
              // Modify the form
              cy.get('input[placeholder="Nom"]').clear().type(this.places.updatedPlace.name)
              cy.get('input[placeholder="Adresse"]').clear().type(this.places.updatedPlace.address)
              cy.get('textarea[placeholder*="Description"]').clear().type(this.places.updatedPlace.description)
              
              // Submit changes
              cy.get('button[type="submit"]').contains('Modifier').click()
              
              // Should show success message or redirect
              cy.contains('modifié').should('be.visible', { timeout: 10000 })
            } else {
              cy.log('Edit functionality not available for this place')
            }
          })
        }
      })
    })
  })

  describe('Suppression de lieu (Delete)', () => {
    it('devrait permettre de supprimer un lieu', function() {
      loginAsValidUser()
      
      cy.visit('/places')
      
      // Check if there are places to delete
      cy.get('body').then(($body) => {
        if ($body.text().includes('Aucun lieux disponibles')) {
          cy.log('No places available to test deletion')
        } else {
          // Click on first place to go to detail page
          cy.get('div[cursor="pointer"]').first().click()
          
          // Look for delete button
          cy.get('body').then(($detailBody) => {
            if ($detailBody.find('svg').length > 1) {
              // Click delete button (second icon - DeleteIcon with red color)
              cy.get('svg[color="red.500"], svg').eq(1).click()
              
              // Handle confirmation dialog if it appears
              cy.get('body').then(($confirmBody) => {
                if ($confirmBody.text().includes('Confirmer') || $confirmBody.text().includes('Supprimer')) {
                  cy.get('button').contains('Supprimer').click()
                }
              })
              
              // Should redirect back to places list or home
              cy.url().should('match', /\/(places|)$/)
              
              // Should show success message
              cy.contains('supprimé').should('be.visible', { timeout: 10000 })
            } else {
              cy.log('Delete functionality not available for this place')
            }
          })
        }
      })
    })

    it('devrait demander confirmation avant de supprimer un lieu', function() {
      loginAsValidUser()
      
      cy.visit('/places')
      
      // Check if there are places to test deletion confirmation
      cy.get('body').then(($body) => {
        if (!$body.text().includes('Aucun lieux disponibles')) {
          // Click on first place to go to detail page
          cy.get('div[cursor="pointer"]').first().click()
          
          // Look for delete button
          cy.get('body').then(($detailBody) => {
            if ($detailBody.find('svg').length > 1) {
              // Click delete button (DeleteIcon)
              cy.get('svg').eq(1).click()
              
              // Should show confirmation dialog
              cy.contains('Êtes-vous sûr').should('be.visible').or('cy.contains("Confirmer")').should('be.visible')
              
              // Cancel deletion
              cy.get('button').contains('Annuler').click().or('cy.get("button").contains("Non")').click()
              
              // Should remain on detail page
              cy.url().should('match', /\/places\/[^/]+$/)
            }
          })
        }
      })
    })
  })

  describe('Navigation et interface utilisateur', () => {
    it('devrait permettre de naviguer entre les pages de lieux', function() {
      loginAsValidUser()
      
      // Test navigation to places list
      cy.visit('/')
      cy.visit('/places')
      cy.contains('Lieux à proximité').should('be.visible')
      
      // Test navigation to add page
      cy.visit('/add')
      cy.contains('Ajouter un lieu').should('be.visible')
      
      // Test back navigation
      cy.go('back')
      cy.url().should('include', '/places')
    })

    it('devrait afficher les éléments d\'interface appropriés', function() {
      loginAsValidUser()
      
      // Check add page elements
      cy.visit('/add')
      cy.get('input[placeholder="Nom"]').should('be.visible')
      cy.get('input[placeholder="Adresse"]').should('be.visible')
      cy.get('textarea[placeholder="Décris-nous ta dernière découverte !"]').should('be.visible')
      cy.get('select[name="typePlace"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })
})