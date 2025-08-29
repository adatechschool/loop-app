// cypress/e2e/user/user-profile.cy.js

describe('User Profile and Settings', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    
    // Create and login with a test user
    cy.fixture('users').then(users => {
      const testUser = {
        ...users.validUser,
        username: `profiletest${Date.now()}`,
        email: `profile${Date.now()}@example.com`
      }
      cy.signup(testUser)
      cy.login(testUser.email, testUser.password)
      cy.wrap(testUser).as('testUser')
    })
  })

  context('Profile Page', () => {
    it('should display user profile information', function() {
      cy.visit('/profile')
      
      // Should show user information
      cy.contains(this.testUser.name).should('be.visible')
      cy.contains(this.testUser.username).should('be.visible')
    })

    it('should show user created places', () => {
      // Add a test place first
      cy.fixture('places').then(places => {
        const userPlace = {
          ...places.validPlace,
          name: `User Place ${Date.now()}`
        }
        cy.addPlace(userPlace)
        
        cy.visit('/profile')
        
        // Should show the place created by the user
        cy.contains(userPlace.name).should('be.visible')
      })
    })

    it('should allow navigation to place details from profile', () => {
      cy.fixture('places').then(places => {
        const userPlace = {
          ...places.validPlace,
          name: `Profile Place ${Date.now()}`
        }
        cy.addPlace(userPlace)
        
        cy.visit('/profile')
        cy.contains(userPlace.name).click()
        
        // Should navigate to place detail page
        cy.url().should('include', '/places/')
        cy.contains(userPlace.description).should('be.visible')
      })
    })
  })

  context('Settings Page', () => {
    it('should display current user settings', function() {
      cy.visit('/settings')
      
      // Should show settings form with current user data
      cy.get('input[name="username"]').should('have.value', this.testUser.username)
      cy.get('input[name="email"]').should('have.value', this.testUser.email)
      
      cy.contains('Paramètres du compte').should('be.visible')
    })

    it('should allow updating username', function() {
      const newUsername = `updated${Date.now()}`
      
      cy.visit('/settings')
      
      cy.get('input[name="username"]')
        .clear()
        .type(newUsername)
      
      cy.get('button[type="submit"]').click()
      
      // Should show success message
      cy.contains('mis à jour', { matchCase: false }).should('be.visible')
      
      // Verify the update
      cy.get('input[name="username"]').should('have.value', newUsername)
    })

    it('should allow updating email', function() {
      const newEmail = `updated${Date.now()}@example.com`
      
      cy.visit('/settings')
      
      cy.get('input[name="email"]')
        .clear()
        .type(newEmail)
      
      cy.get('button[type="submit"]').click()
      
      // Should show success message
      cy.contains('mis à jour', { matchCase: false }).should('be.visible')
      
      // Verify the update
      cy.get('input[name="email"]').should('have.value', newEmail)
    })

    it('should allow updating profile picture', () => {
      cy.visit('/settings')
      
      // Upload new profile picture
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
      
      cy.get('button[type="submit"]').click()
      
      // Should show success message
      cy.contains('mis à jour', { matchCase: false }).should('be.visible')
    })

    it('should show validation errors for invalid data', () => {
      cy.visit('/settings')
      
      // Try to set username too short
      cy.get('input[name="username"]')
        .clear()
        .type('ab')
      
      cy.get('button[type="submit"]').click()
      
      // Should show validation error
      cy.contains('Minimum 3 caractères').should('be.visible')
    })

    it('should show loading state during update', () => {
      cy.visit('/settings')
      
      cy.get('input[name="username"]')
        .clear()
        .type(`loading${Date.now()}`)
      
      cy.get('button[type="submit"]').click()
      
      // Should show loading state
      cy.get('button[type="submit"]').should('be.disabled')
    })
  })

  context('Account Deletion', () => {
    it('should allow account deletion with confirmation', function() {
      cy.visit('/settings')
      
      // Click delete account button
      cy.contains('Supprimer mon compte').click()
      
      // Should show confirmation dialog
      cy.contains('Êtes-vous sûr').should('be.visible')
      
      // Confirm deletion
      cy.get('[role="dialog"]').within(() => {
        cy.contains('Supprimer').click()
      })
      
      // Should redirect to login page
      cy.url().should('include', '/login')
      cy.shouldNotBeAuthenticated()
    })

    it('should allow cancelling account deletion', () => {
      cy.visit('/settings')
      
      cy.contains('Supprimer mon compte').click()
      
      // Cancel deletion
      cy.get('[role="dialog"]').within(() => {
        cy.contains('Annuler').click()
      })
      
      // Should remain on settings page
      cy.url().should('include', '/settings')
      cy.shouldBeAuthenticated()
    })
  })

  context('PWA Installation', () => {
    it('should show PWA install button', () => {
      cy.visit('/settings')
      
      // Should show install PWA button
      cy.get('[data-testid="install-pwa"]').should('be.visible')
    })

    it('should handle PWA install prompt', () => {
      cy.visit('/settings')
      
      // Mock the beforeinstallprompt event
      cy.window().then(win => {
        const mockEvent = new Event('beforeinstallprompt')
        mockEvent.prompt = cy.stub()
        win.dispatchEvent(mockEvent)
      })
      
      cy.get('[data-testid="install-pwa"]').click()
      
      // Should handle the install prompt
      cy.window().its('beforeinstallprompt').should('exist')
    })
  })

  context('Navigation from Profile/Settings', () => {
    it('should have back button on settings page', () => {
      cy.visit('/settings')
      
      cy.get('[aria-label="Retour"]').should('be.visible')
      cy.get('[aria-label="Retour"]').click()
      
      // Should navigate back to home
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('should allow navigation between profile and settings', () => {
      cy.visit('/profile')
      
      // Navigate to settings
      cy.contains('Paramètres').click()
      cy.url().should('include', '/settings')
      
      // Navigate back to profile
      cy.contains('Profil').click()
      cy.url().should('include', '/profile')
    })
  })

  context('Responsive Design', () => {
    it('should be responsive on mobile devices', function() {
      cy.setMobileViewport()
      
      cy.visit('/settings')
      
      // Form should be accessible on mobile
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should maintain functionality on tablet', function() {
      cy.viewport(768, 1024)
      
      cy.visit('/profile')
      
      // Profile should be displayed correctly
      cy.contains(this.testUser.name).should('be.visible')
      cy.contains(this.testUser.username).should('be.visible')
    })
  })

  context('Error Handling', () => {
    it('should handle update errors gracefully', () => {
      // Mock API error
      cy.intercept('PUT', '**/api/user', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('updateError')
      
      cy.visit('/settings')
      
      cy.get('input[name="username"]')
        .clear()
        .type(`error${Date.now()}`)
      
      cy.get('button[type="submit"]').click()
      
      cy.wait('@updateError')
      
      // Should show error message
      cy.contains('erreur', { matchCase: false }).should('be.visible')
    })

    it('should handle network connectivity issues', () => {
      cy.visit('/settings')
      
      // Simulate network failure
      cy.intercept('PUT', '**/api/user', { forceNetworkError: true }).as('networkError')
      
      cy.get('input[name="username"]')
        .clear()
        .type(`network${Date.now()}`)
      
      cy.get('button[type="submit"]').click()
      
      cy.wait('@networkError')
      
      // Should handle network error
      cy.contains('erreur', { matchCase: false }).should('be.visible')
    })

    it('should handle unauthorized access', () => {
      // Clear authentication
      cy.window().then(win => {
        win.localStorage.removeItem('token')
      })
      
      cy.visit('/settings')
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  context('Form Validation', () => {
    it('should validate email format', () => {
      cy.visit('/settings')
      
      cy.get('input[name="email"]')
        .clear()
        .type('invalid-email-format')
      
      cy.get('button[type="submit"]').click()
      
      // Should show HTML5 validation error
      cy.get('input[name="email"]:invalid').should('exist')
    })

    it('should enforce minimum username length', () => {
      cy.visit('/settings')
      
      cy.get('input[name="username"]')
        .clear()
        .type('a')
      
      cy.get('button[type="submit"]').click()
      
      // Should show validation message
      cy.contains('Minimum 3 caractères').should('be.visible')
    })

    it('should handle empty required fields', () => {
      cy.visit('/settings')
      
      cy.get('input[name="username"]').clear()
      
      cy.get('button[type="submit"]').click()
      
      // Should show required field validation
      cy.contains('requis').should('be.visible')
    })
  })
})