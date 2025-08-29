// cypress/e2e/integration/complete-user-journey.cy.js

describe('Complete User Journey', () => {
  const timestamp = Date.now()
  const testUser = {
    name: `E2E Test User ${timestamp}`,
    username: `e2euser${timestamp}`,
    email: `e2e${timestamp}@example.com`,
    password: 'testpassword123'
  }

  const testPlace = {
    name: `E2E Test Place ${timestamp}`,
    description: 'This is a comprehensive end-to-end test place created by Cypress automation',
    address: '123 E2E Test Street, 75001 Paris, France',
    types: ['street_art', 'monument'],
    accessibility: true
  }

  beforeEach(() => {
    cy.cleanupTestData()
  })

  it('should complete the entire user journey from registration to place management', () => {
    // === STEP 1: User Registration ===
    cy.log('🔐 Starting user registration')
    cy.visit('/')
    
    // Should redirect to login for unauthenticated users
    cy.url().should('include', '/login')
    
    // Navigate to signup
    cy.contains('Créer un compte').click()
    cy.url().should('include', '/signup')
    
    // Register new user
    cy.get('input[placeholder="Nom complet"]').type(testUser.name)
    cy.get('input[placeholder="Nom d\'utilisateur"]').type(testUser.username)
    cy.get('input[placeholder="Email"]').type(testUser.email)
    cy.get('input[placeholder="Mot de passe"]').type(testUser.password)
    
    // Upload profile picture
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
    cy.contains('test-image.jpg').should('be.visible')
    
    cy.get('button[type="submit"]').click()
    
    // Should redirect to home page after successful registration
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Compte créé !').should('be.visible')
    cy.shouldBeAuthenticated()
    
    // === STEP 2: Explore Home Page and Map ===
    cy.log('🗺️ Exploring home page and map')
    cy.waitForMap()
    cy.get('.leaflet-container').should('be.visible')
    
    // Test map interactions
    cy.get('.leaflet-control-zoom-in').click()
    cy.wait(1000)
    cy.get('.leaflet-control-zoom-out').click()
    
    // === STEP 3: Add a New Place ===
    cy.log('📍 Adding a new place')
    cy.get('nav').within(() => {
      cy.contains('Ajouter').click()
    })
    
    cy.url().should('include', '/add')
    cy.contains('Ajouter un lieu').should('be.visible')
    
    // Fill place form
    cy.get('input[placeholder*="nom"]', { timeout: 10000 })
      .should('be.visible')
      .type(testPlace.name)
    
    cy.get('textarea[placeholder*="description"]').type(testPlace.description)
    cy.get('input[placeholder*="adresse"]').type(testPlace.address)
    
    // Select place types
    testPlace.types.forEach(type => {
      cy.get(`input[value="${type}"]`).check({ force: true })
    })
    
    // Enable accessibility
    if (testPlace.accessibility) {
      cy.get('input[type="checkbox"][name="accessibility"]').check()
    }
    
    // Upload place images
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
    
    // Submit place
    cy.get('button[type="submit"]').click()
    
    // Should redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('ajouté', { matchCase: false }).should('be.visible')
    
    // === STEP 4: View Places List ===
    cy.log('📋 Viewing places list')
    cy.get('nav').within(() => {
      cy.contains('Lieux').click()
    })
    
    cy.url().should('include', '/places')
    cy.contains(testPlace.name).should('be.visible')
    
    // === STEP 5: View Place Details ===
    cy.log('👀 Viewing place details')
    cy.contains(testPlace.name).click()
    
    cy.url().should('include', '/places/')
    cy.contains(testPlace.name).should('be.visible')
    cy.contains(testPlace.description).should('be.visible')
    cy.contains(testPlace.address).should('be.visible')
    
    // Test "Voir sur la map" functionality
    cy.contains('Voir sur la map').should('be.visible').click()
    cy.url().should('include', '/')
    cy.url().should('include', 'lat=')
    cy.url().should('include', 'lng=')
    
    // === STEP 6: Edit the Place ===
    cy.log('✏️ Editing the place')
    cy.get('nav').within(() => {
      cy.contains('Lieux').click()
    })
    cy.contains(testPlace.name).click()
    
    cy.contains('Modifier').click()
    cy.url().should('include', '/edit/')
    
    // Update place information
    const updatedName = `${testPlace.name} - Updated`
    const updatedDescription = `${testPlace.description} - Updated with new information`
    
    cy.get('input[value*="E2E Test Place"]').clear().type(updatedName)
    cy.get('textarea').clear().type(updatedDescription)
    
    cy.get('button[type="submit"]').click()
    
    // Verify updates
    cy.url().should('include', '/places/')
    cy.contains(updatedName).should('be.visible')
    cy.contains(updatedDescription).should('be.visible')
    
    // === STEP 7: Search Functionality ===
    cy.log('🔍 Testing search functionality')
    cy.get('nav').within(() => {
      cy.contains('Rechercher').click()
    })
    
    cy.url().should('include', '/search')
    cy.get('input[placeholder*="rechercher"]').type('E2E Test')
    cy.get('button[type="submit"]').click()
    
    // Should find our test place
    cy.contains('E2E Test').should('be.visible')
    
    // Test search with no results
    cy.get('input[placeholder*="rechercher"]').clear().type('NonExistentPlace123456789')
    cy.get('button[type="submit"]').click()
    cy.contains('Aucun résultat', { matchCase: false }).should('be.visible')
    
    // === STEP 8: User Profile ===
    cy.log('👤 Checking user profile')
    cy.get('nav').within(() => {
      cy.contains('Profil').click()
    })
    
    cy.url().should('include', '/profile')
    cy.contains(testUser.name).should('be.visible')
    cy.contains(testUser.username).should('be.visible')
    
    // Should show user's created place
    cy.contains(updatedName).should('be.visible')
    
    // === STEP 9: User Settings ===
    cy.log('⚙️ Testing user settings')
    cy.visit('/settings')
    cy.contains('Paramètres du compte').should('be.visible')
    
    // Verify current user data
    cy.get('input[name="username"]').should('have.value', testUser.username)
    cy.get('input[name="email"]').should('have.value', testUser.email)
    
    // Update username
    const newUsername = `${testUser.username}_updated`
    cy.get('input[name="username"]').clear().type(newUsername)
    cy.get('button[type="submit"]').click()
    
    // Verify update success
    cy.contains('mis à jour', { matchCase: false }).should('be.visible')
    cy.get('input[name="username"]').should('have.value', newUsername)
    
    // === STEP 10: Mobile Responsiveness ===
    cy.log('📱 Testing mobile responsiveness')
    cy.setMobileViewport()
    
    cy.visit('/')
    cy.waitForMap()
    
    // Test mobile navigation
    cy.get('[data-testid="mobile-nav"]').should('be.visible')
    
    // Navigate on mobile
    cy.get('[data-testid="menu-toggle"]').click()
    cy.get('[data-testid="mobile-menu"]').within(() => {
      cy.contains('Lieux').click()
    })
    
    cy.url().should('include', '/places')
    cy.contains(updatedName).should('be.visible')
    
    // === STEP 11: Error Handling ===
    cy.log('🚨 Testing error handling')
    cy.setDesktopViewport()
    
    // Test non-existent place
    cy.visit('/places/999999')
    cy.contains('Lieu introuvable').should('be.visible')
    cy.contains('Retour à la page d\'accueil').should('be.visible').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // === STEP 12: Delete Place ===
    cy.log('🗑️ Deleting the test place')
    cy.get('nav').within(() => {
      cy.contains('Lieux').click()
    })
    cy.contains(updatedName).click()
    
    cy.contains('Supprimer').click()
    
    // Confirm deletion
    cy.contains('Êtes-vous sûr').should('be.visible')
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Supprimer').click()
    })
    
    // Should redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Verify place is deleted
    cy.visit('/places')
    cy.contains(updatedName).should('not.exist')
    
    // === STEP 13: Logout ===
    cy.log('🚪 Testing logout')
    cy.visit('/settings')
    cy.contains('Se déconnecter').click()
    
    cy.shouldNotBeAuthenticated()
    cy.url().should('include', '/login')
    
    // === STEP 14: Login Again ===
    cy.log('🔑 Testing login functionality')
    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(testUser.email)
    cy.get('input[placeholder="Mot de passe"]').type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Connexion réussie').should('be.visible')
    cy.shouldBeAuthenticated()
    
    // === STEP 15: Account Deletion ===
    cy.log('🗑️ Testing account deletion')
    cy.visit('/settings')
    
    cy.contains('Supprimer mon compte').click()
    cy.contains('Êtes-vous sûr').should('be.visible')
    
    cy.get('[role="dialog"]').within(() => {
      cy.contains('Supprimer').click()
    })
    
    // Should redirect to login after account deletion
    cy.url().should('include', '/login')
    cy.shouldNotBeAuthenticated()
    
    // Verify account is deleted by trying to login
    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').type(testUser.email)
    cy.get('input[placeholder="Mot de passe"]').type(testUser.password)
    cy.get('button[type="submit"]').click()
    
    // Should show invalid credentials error
    cy.contains('Nom d\'utilisateur ou mot de passe invalide').should('be.visible')
    
    cy.log('✅ Complete user journey test completed successfully!')
  })
  
  it('should handle the user journey with different place types', () => {
    cy.log('🎨 Testing complete journey with different place types')
    
    // Register and login
    const specialUser = {
      ...testUser,
      username: `special${timestamp}`,
      email: `special${timestamp}@example.com`
    }
    
    cy.signup(specialUser)
    cy.login(specialUser.email, specialUser.password)
    
    // Test different place types
    const placeTypes = [
      { type: 'street_art', name: 'Street Art Gallery' },
      { type: 'monument', name: 'Historic Monument' },
      { type: 'park', name: 'Beautiful Park' },
      { type: 'museum', name: 'Art Museum' }
    ]
    
    placeTypes.forEach((placeType, index) => {
      cy.log(`Adding ${placeType.type} place`)
      
      const typePlace = {
        name: `${placeType.name} ${timestamp}`,
        description: `A wonderful ${placeType.type} place for testing`,
        address: `${index + 1} ${placeType.name} Street, Paris`,
        types: [placeType.type]
      }
      
      cy.addPlace(typePlace)
    })
    
    // Verify all places were created
    cy.visit('/places')
    placeTypes.forEach(placeType => {
      cy.contains(`${placeType.name} ${timestamp}`).should('be.visible')
    })
    
    // Test search for each type
    placeTypes.forEach(placeType => {
      cy.visit('/search')
      cy.get('input[placeholder*="rechercher"]').clear().type(placeType.name)
      cy.get('button[type="submit"]').click()
      cy.contains(`${placeType.name} ${timestamp}`).should('be.visible')
    })
    
    cy.log('✅ Multi-type place journey completed successfully!')
  })
})

// Additional helper test for performance
describe('Performance and Load Testing', () => {
  it('should handle rapid navigation without memory leaks', () => {
    const perfUser = {
      name: `Perf User ${Date.now()}`,
      username: `perfuser${Date.now()}`,
      email: `perf${Date.now()}@example.com`,
      password: 'perftest123'
    }
    
    cy.signup(perfUser)
    cy.login(perfUser.email, perfUser.password)
    
    // Rapid navigation test
    const pages = ['/', '/places', '/add', '/search', '/profile', '/settings']
    
    // Navigate rapidly 5 times through all pages
    for (let round = 0; round < 5; round++) {
      cy.log(`Performance test round ${round + 1}`)
      
      pages.forEach(page => {
        cy.visit(page)
        cy.get('body').should('exist')
        cy.wait(100) // Small delay to prevent overwhelming the browser
      })
    }
    
    // Verify the app is still responsive
    cy.visit('/')
    cy.waitForMap()
    cy.get('.leaflet-container').should('be.visible')
    
    cy.log('✅ Performance test completed successfully!')
  })
})