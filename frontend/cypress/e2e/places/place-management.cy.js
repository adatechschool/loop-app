// cypress/e2e/places/place-management.cy.js

describe('Place Management', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    
    // Create and login with a test user
    cy.fixture('users').then(users => {
      const testUser = {
        ...users.validUser,
        username: `placetest${Date.now()}`,
        email: `place${Date.now()}@example.com`
      }
      cy.signup(testUser)
      cy.login(testUser.email, testUser.password)
    })
  })

  context('Adding Places', () => {
    it('should add a new place with basic information', () => {
      cy.fixture('places').then(places => {
        const newPlace = {
          ...places.validPlace,
          name: `Test Place ${Date.now()}`
        }
        
        cy.visit('/add')
        
        // Verify we're on the add page
        cy.contains('Ajouter un lieu').should('be.visible')
        
        // Fill in place information
        cy.get('input[placeholder*="nom"]', { timeout: 10000 })
          .should('be.visible')
          .type(newPlace.name)
        
        cy.get('textarea[placeholder*="description"]')
          .type(newPlace.description)
        
        cy.get('input[placeholder*="adresse"]')
          .type(newPlace.address)
        
        // Select accessibility if provided
        if (newPlace.accessibility) {
          cy.get('input[type="checkbox"][name="accessibility"]').check()
        }
        
        // Submit the form
        cy.get('button[type="submit"]').click()
        
        // Should redirect back to home page
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        
        // Should show success message
        cy.contains('ajouté').should('be.visible')
      })
    })

    it('should add a place with multiple types selected', () => {
      cy.fixture('places').then(places => {
        const placeWithTypes = {
          ...places.validPlace,
          name: `Multi Type Place ${Date.now()}`
        }
        
        cy.visit('/add')
        
        cy.get('input[placeholder*="nom"]').type(placeWithTypes.name)
        cy.get('textarea[placeholder*="description"]').type(placeWithTypes.description)
        cy.get('input[placeholder*="adresse"]').type(placeWithTypes.address)
        
        // Select multiple place types
        placeWithTypes.types.forEach(type => {
          cy.get(`input[value="${type}"]`).check({ force: true })
        })
        
        cy.get('button[type="submit"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })

    it('should add a place with image uploads', () => {
      cy.fixture('places').then(places => {
        const placeWithImage = {
          ...places.placeWithImages,
          name: `Image Place ${Date.now()}`
        }
        
        cy.visit('/add')
        
        cy.get('input[placeholder*="nom"]').type(placeWithImage.name)
        cy.get('textarea[placeholder*="description"]').type(placeWithImage.description)
        cy.get('input[placeholder*="adresse"]').type(placeWithImage.address)
        
        // Upload image
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
        
        cy.get('button[type="submit"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })

    it('should show validation errors for incomplete place data', () => {
      cy.visit('/add')
      
      // Try to submit without filling required fields
      cy.get('button[type="submit"]').click()
      
      // Should show validation messages
      cy.get('input[placeholder*="nom"]:invalid').should('exist')
      cy.get('textarea[placeholder*="description"]:invalid').should('exist')
    })

    it('should handle long descriptions properly', () => {
      cy.fixture('places').then(places => {
        const longDescPlace = {
          ...places.placeWithLongDescription,
          name: `Long Desc Place ${Date.now()}`
        }
        
        cy.visit('/add')
        
        cy.get('input[placeholder*="nom"]').type(longDescPlace.name)
        cy.get('textarea[placeholder*="description"]').type(longDescPlace.description)
        cy.get('input[placeholder*="adresse"]').type(longDescPlace.address)
        
        cy.get('button[type="submit"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })
  })

  context('Viewing Places', () => {
    beforeEach(() => {
      // Add a test place first
      cy.fixture('places').then(places => {
        const testPlace = {
          ...places.validPlace,
          name: `View Test Place ${Date.now()}`
        }
        cy.addPlace(testPlace)
        cy.wrap(testPlace).as('testPlace')
      })
    })

    it('should display place details correctly', function() {
      // Navigate to places list
      cy.visit('/places')
      
      // Click on the test place
      cy.contains(this.testPlace.name).click()
      
      // Verify we're on the detail page
      cy.url().should('include', '/places/')
      
      // Check place information is displayed
      cy.contains(this.testPlace.name).should('be.visible')
      cy.contains(this.testPlace.description).should('be.visible')
      cy.contains(this.testPlace.address).should('be.visible')
    })

    it('should show "Voir sur la map" button', function() {
      cy.visit('/places')
      cy.contains(this.testPlace.name).click()
      
      cy.contains('Voir sur la map').should('be.visible')
      cy.contains('Voir sur la map').click()
      
      // Should redirect to home with coordinates
      cy.url().should('include', '/')
      cy.url().should('include', 'lat=')
      cy.url().should('include', 'lng=')
    })

    it('should show image carousel if place has images', () => {
      // Add a place with images
      cy.fixture('places').then(places => {
        const imagePlace = {
          ...places.placeWithImages,
          name: `Image Test Place ${Date.now()}`
        }
        cy.addPlace(imagePlace)
        
        cy.visit('/places')
        cy.contains(imagePlace.name).click()
        
        // Should show image carousel
        cy.get('[data-testid="image-carousel"]').should('be.visible')
      })
    })

    it('should handle places without images gracefully', function() {
      cy.visit('/places')
      cy.contains(this.testPlace.name).click()
      
      // Should still show place details even without images
      cy.contains(this.testPlace.name).should('be.visible')
      cy.contains(this.testPlace.description).should('be.visible')
    })
  })

  context('Editing Places', () => {
    beforeEach(() => {
      cy.fixture('places').then(places => {
        const editTestPlace = {
          ...places.validPlace,
          name: `Edit Test Place ${Date.now()}`
        }
        cy.addPlace(editTestPlace)
        cy.wrap(editTestPlace).as('editPlace')
      })
    })

    it('should allow editing place information', function() {
      cy.visit('/places')
      cy.contains(this.editPlace.name).click()
      
      // Click edit button
      cy.contains('Modifier').click()
      
      cy.url().should('include', '/edit/')
      
      // Update place information
      const updatedName = `Updated ${this.editPlace.name}`
      cy.get('input[value*="Edit Test Place"]').clear().type(updatedName)
      
      const updatedDescription = 'This is an updated description for testing'
      cy.get('textarea').clear().type(updatedDescription)
      
      // Save changes
      cy.get('button[type="submit"]').click()
      
      // Should redirect to place detail page
      cy.url().should('include', '/places/')
      
      // Verify updates are displayed
      cy.contains(updatedName).should('be.visible')
      cy.contains(updatedDescription).should('be.visible')
    })

    it('should pre-populate form with existing place data', function() {
      cy.visit('/places')
      cy.contains(this.editPlace.name).click()
      
      cy.contains('Modifier').click()
      
      // Form should be pre-populated
      cy.get('input').should('have.value', this.editPlace.name)
      cy.get('textarea').should('contain.value', this.editPlace.description)
    })
  })

  context('Deleting Places', () => {
    beforeEach(() => {
      cy.fixture('places').then(places => {
        const deleteTestPlace = {
          ...places.validPlace,
          name: `Delete Test Place ${Date.now()}`
        }
        cy.addPlace(deleteTestPlace)
        cy.wrap(deleteTestPlace).as('deletePlace')
      })
    })

    it('should allow deleting a place with confirmation', function() {
      cy.visit('/places')
      cy.contains(this.deletePlace.name).click()
      
      // Click delete button
      cy.contains('Supprimer').click()
      
      // Should show confirmation dialog
      cy.contains('Êtes-vous sûr').should('be.visible')
      
      // Confirm deletion
      cy.get('[role="dialog"]').within(() => {
        cy.contains('Supprimer').click()
      })
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Place should no longer exist
      cy.visit('/places')
      cy.contains(this.deletePlace.name).should('not.exist')
    })

    it('should allow cancelling place deletion', function() {
      cy.visit('/places')
      cy.contains(this.deletePlace.name).click()
      
      cy.contains('Supprimer').click()
      
      // Cancel deletion
      cy.get('[role="dialog"]').within(() => {
        cy.contains('Annuler').click()
      })
      
      // Should remain on place detail page
      cy.url().should('include', '/places/')
      cy.contains(this.deletePlace.name).should('be.visible')
    })
  })

  context('Place List View', () => {
    beforeEach(() => {
      // Add multiple test places
      cy.fixture('places').then(places => {
        const testPlaces = [
          { ...places.validPlace, name: `List Place 1 ${Date.now()}` },
          { ...places.validPlace, name: `List Place 2 ${Date.now()}` },
          { ...places.validPlace, name: `List Place 3 ${Date.now()}` }
        ]
        
        testPlaces.forEach(place => cy.addPlace(place))
        cy.wrap(testPlaces).as('testPlaces')
      })
    })

    it('should display all places in list format', function() {
      cy.visit('/places')
      
      // Should show all test places
      this.testPlaces.forEach(place => {
        cy.contains(place.name).should('be.visible')
      })
    })

    it('should allow navigation from list to detail view', function() {
      cy.visit('/places')
      
      cy.contains(this.testPlaces[0].name).click()
      cy.url().should('include', '/places/')
      cy.contains(this.testPlaces[0].description).should('be.visible')
    })
  })

  context('Place Types and Filters', () => {
    it('should handle different place types correctly', () => {
      const placeTypes = ['street_art', 'monument', 'park', 'museum']
      
      placeTypes.forEach(type => {
        cy.fixture('places').then(places => {
          const typedPlace = {
            ...places.validPlace,
            name: `${type} Place ${Date.now()}`,
            types: [type]
          }
          
          cy.visit('/add')
          cy.get('input[placeholder*="nom"]').type(typedPlace.name)
          cy.get('textarea[placeholder*="description"]').type(typedPlace.description)
          cy.get('input[placeholder*="adresse"]').type(typedPlace.address)
          
          cy.get(`input[value="${type}"]`).check({ force: true })
          cy.get('button[type="submit"]').click()
          
          cy.url().should('eq', Cypress.config().baseUrl + '/')
        })
      })
    })
  })

  context('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Mock network error
      cy.intercept('POST', '**/api/places', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('createPlaceError')
      
      cy.fixture('places').then(places => {
        cy.visit('/add')
        
        cy.get('input[placeholder*="nom"]').type(places.validPlace.name)
        cy.get('textarea[placeholder*="description"]').type(places.validPlace.description)
        cy.get('input[placeholder*="adresse"]').type(places.validPlace.address)
        
        cy.get('button[type="submit"]').click()
        
        cy.wait('@createPlaceError')
        
        // Should show error message
        cy.contains('erreur', { matchCase: false }).should('be.visible')
      })
    })

    it('should handle missing place data', () => {
      // Try to visit a non-existent place
      cy.visit('/places/999999')
      
      // Should show error message
      cy.contains('Lieu introuvable').should('be.visible')
      cy.contains('Retour à la page d\'accueil').should('be.visible')
    })
  })
})