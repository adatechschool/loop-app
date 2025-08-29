// cypress/e2e/navigation/app-navigation.cy.js

describe('App Navigation and Map Interaction', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    
    // Create and login with a test user
    cy.fixture('users').then(users => {
      const testUser = {
        ...users.validUser,
        username: `navtest${Date.now()}`,
        email: `nav${Date.now()}@example.com`
      }
      cy.signup(testUser)
      cy.login(testUser.email, testUser.password)
    })
  })

  context('Main Navigation', () => {
    it('should navigate between main pages', () => {
      // Start at home
      cy.visit('/')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Navigate to places list
      cy.get('nav').within(() => {
        cy.contains('Lieux').click()
      })
      cy.url().should('include', '/places')
      
      // Navigate to add place
      cy.get('nav').within(() => {
        cy.contains('Ajouter').click()
      })
      cy.url().should('include', '/add')
      
      // Navigate to search
      cy.get('nav').within(() => {
        cy.contains('Rechercher').click()
      })
      cy.url().should('include', '/search')
      
      // Navigate to profile
      cy.get('nav').within(() => {
        cy.contains('Profil').click()
      })
      cy.url().should('include', '/profile')
    })

    it('should highlight active navigation item', () => {
      cy.visit('/places')
      
      // Active nav item should be highlighted
      cy.get('nav').within(() => {
        cy.get('[aria-current="page"]').should('contain', 'Lieux')
      })
    })

    it('should show navigation on all main pages', () => {
      const pages = ['/', '/places', '/add', '/search', '/profile']
      
      pages.forEach(page => {
        cy.visit(page)
        cy.get('nav').should('be.visible')
      })
    })
  })

  context('Map Interactions', () => {
    beforeEach(() => {
      // Add test places for map testing
      cy.fixture('places').then(places => {
        const mapTestPlace = {
          ...places.validPlace,
          name: `Map Test Place ${Date.now()}`
        }
        cy.addPlace(mapTestPlace)
        cy.wrap(mapTestPlace).as('mapPlace')
      })
    })

    it('should load the map on home page', () => {
      cy.visit('/')
      
      // Wait for map to load
      cy.waitForMap()
      
      // Map should be visible
      cy.get('.leaflet-container').should('be.visible')
      cy.get('.leaflet-tile').should('exist')
    })

    it('should show place markers on the map', function() {
      cy.visit('/')
      cy.waitForMap()
      
      // Should show markers for places
      cy.get('.leaflet-marker-icon').should('exist')
    })

    it('should allow zooming in and out', () => {
      cy.visit('/')
      cy.waitForMap()
      
      // Test zoom controls
      cy.get('.leaflet-control-zoom-in').click()
      cy.wait(1000)
      cy.get('.leaflet-control-zoom-out').click()
    })

    it('should allow map dragging', () => {
      cy.visit('/')
      cy.waitForMap()
      
      // Test map dragging
      cy.get('.leaflet-container')
        .trigger('mousedown', { which: 1, pageX: 600, pageY: 300 })
        .trigger('mousemove', { which: 1, pageX: 650, pageY: 350 })
        .trigger('mouseup')
    })

    it('should handle geolocation', () => {
      cy.visit('/')
      cy.waitForMap()
      
      // Mock geolocation
      cy.window().then(win => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsArgWith(0, {
            coords: {
              latitude: 48.8566,
              longitude: 2.3522
            }
          })
      })
      
      // Click locate button if available
      cy.get('.leaflet-control-locate').click()
    })

    it('should center map on place when "Voir sur la map" is clicked', function() {
      // Go to place detail
      cy.visit('/places')
      cy.contains(this.mapPlace.name).click()
      
      // Click "Voir sur la map"
      cy.contains('Voir sur la map').click()
      
      // Should be on home page with coordinates in URL
      cy.url().should('include', '/')
      cy.url().should('include', 'lat=')
      cy.url().should('include', 'lng=')
      
      cy.waitForMap()
    })

    it('should handle map resize on window resize', () => {
      cy.visit('/')
      cy.waitForMap()
      
      // Resize window
      cy.viewport(800, 600)
      cy.wait(1000)
      
      // Map should adapt to new size
      cy.get('.leaflet-container').should('be.visible')
    })
  })

  context('Search Functionality', () => {
    beforeEach(() => {
      // Add test places for search
      cy.fixture('places').then(places => {
        const searchPlaces = [
          { ...places.validPlace, name: `Searchable Canal Place ${Date.now()}` },
          { ...places.validPlace, name: `Test Street Art ${Date.now()}` },
          { ...places.validPlace, name: `Museum Place ${Date.now()}` }
        ]
        
        searchPlaces.forEach(place => cy.addPlace(place))
        cy.wrap(searchPlaces).as('searchPlaces')
      })
    })

    it('should perform basic search', function() {
      cy.visit('/search')
      
      // Search for "Canal"
      cy.get('input[placeholder*="rechercher"]').type('Canal')
      cy.get('button[type="submit"]').click()
      
      // Should show search results
      cy.contains('Canal').should('be.visible')
    })

    it('should show no results for non-existing places', () => {
      cy.visit('/search')
      
      cy.get('input[placeholder*="rechercher"]').type('NonExistentPlace123456')
      cy.get('button[type="submit"]').click()
      
      // Should show no results message
      cy.contains('Aucun résultat', { matchCase: false }).should('be.visible')
    })

    it('should handle search with filters', () => {
      cy.visit('/search')
      
      // Apply search filters
      cy.get('input[placeholder*="rechercher"]').type('Street')
      
      // Select type filter if available
      cy.get('select[name="type"]').select('street_art')
      
      cy.get('button[type="submit"]').click()
      
      // Should show filtered results
      cy.get('[data-testid="search-results"]').should('exist')
    })

    it('should allow clearing search results', () => {
      cy.visit('/search')
      
      cy.get('input[placeholder*="rechercher"]').type('Canal')
      cy.get('button[type="submit"]').click()
      
      // Clear search
      cy.get('input[placeholder*="rechercher"]').clear()
      cy.get('button[type="submit"]').click()
      
      // Should clear results
      cy.get('[data-testid="search-results"]').should('not.exist')
    })

    it('should navigate from search results to place details', function() {
      cy.visit('/search')
      
      cy.get('input[placeholder*="rechercher"]').type('Canal')
      cy.get('button[type="submit"]').click()
      
      // Click on first search result
      cy.get('[data-testid="search-result"]').first().click()
      
      // Should navigate to place detail
      cy.url().should('include', '/places/')
    })
  })

  context('Mobile Navigation', () => {
    beforeEach(() => {
      cy.setMobileViewport()
    })

    it('should show mobile navigation menu', () => {
      cy.visit('/')
      
      // Should show mobile nav
      cy.get('[data-testid="mobile-nav"]').should('be.visible')
    })

    it('should toggle mobile menu', () => {
      cy.visit('/')
      
      // Open mobile menu
      cy.get('[data-testid="menu-toggle"]').click()
      cy.get('[data-testid="mobile-menu"]').should('be.visible')
      
      // Close mobile menu
      cy.get('[data-testid="menu-toggle"]').click()
      cy.get('[data-testid="mobile-menu"]').should('not.be.visible')
    })

    it('should navigate on mobile', () => {
      cy.visit('/')
      
      // Open menu and navigate
      cy.get('[data-testid="menu-toggle"]').click()
      cy.get('[data-testid="mobile-menu"]').within(() => {
        cy.contains('Lieux').click()
      })
      
      cy.url().should('include', '/places')
    })
  })

  context('Breadcrumb Navigation', () => {
    it('should show breadcrumbs on detail pages', () => {
      // Add a test place
      cy.fixture('places').then(places => {
        const breadcrumbPlace = {
          ...places.validPlace,
          name: `Breadcrumb Place ${Date.now()}`
        }
        cy.addPlace(breadcrumbPlace)
        
        // Navigate to place detail
        cy.visit('/places')
        cy.contains(breadcrumbPlace.name).click()
        
        // Should show breadcrumb navigation
        cy.get('[data-testid="breadcrumb"]').should('exist')
        cy.contains('Accueil').should('be.visible')
        cy.contains('Lieux').should('be.visible')
      })
    })

    it('should allow navigation through breadcrumbs', () => {
      cy.fixture('places').then(places => {
        const breadcrumbPlace = {
          ...places.validPlace,
          name: `Nav Breadcrumb ${Date.now()}`
        }
        cy.addPlace(breadcrumbPlace)
        
        cy.visit('/places')
        cy.contains(breadcrumbPlace.name).click()
        
        // Navigate through breadcrumb
        cy.contains('Lieux').click()
        cy.url().should('include', '/places')
        
        // Go back to detail and navigate to home
        cy.contains(breadcrumbPlace.name).click()
        cy.contains('Accueil').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })
  })

  context('Back Button Functionality', () => {
    it('should show back button on relevant pages', () => {
      const pagesWithBack = ['/signin', '/signup', '/settings']
      
      pagesWithBack.forEach(page => {
        cy.visit(page)
        cy.get('[aria-label="Retour"]').should('be.visible')
      })
    })

    it('should navigate back using back button', () => {
      cy.visit('/')
      cy.visit('/settings')
      
      cy.get('[aria-label="Retour"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  context('Deep Linking', () => {
    it('should handle direct URLs correctly', () => {
      // Add a test place and get its ID
      cy.fixture('places').then(places => {
        const deepLinkPlace = {
          ...places.validPlace,
          name: `Deep Link Place ${Date.now()}`
        }
        cy.addPlace(deepLinkPlace)
        
        // Visit place list to get the ID
        cy.visit('/places')
        cy.contains(deepLinkPlace.name).click()
        
        // Get current URL and reload page
        cy.url().then(url => {
          cy.visit(url)
          
          // Should still show the place details
          cy.contains(deepLinkPlace.name).should('be.visible')
          cy.contains(deepLinkPlace.description).should('be.visible')
        })
      })
    })

    it('should handle invalid URLs gracefully', () => {
      cy.visit('/places/999999')
      
      // Should show 404 or error message
      cy.contains('Lieu introuvable').should('be.visible')
    })

    it('should maintain URL parameters', () => {
      cy.visit('/?lat=48.8566&lng=2.3522')
      
      // URL parameters should be preserved
      cy.url().should('include', 'lat=48.8566')
      cy.url().should('include', 'lng=2.3522')
      
      cy.waitForMap()
    })
  })

  context('Performance and Loading', () => {
    it('should show loading states', () => {
      cy.intercept('GET', '**/api/places', {
        delay: 2000,
        body: []
      }).as('slowPlaces')
      
      cy.visit('/places')
      
      // Should show loading state
      cy.contains('Chargement').should('be.visible')
      
      cy.wait('@slowPlaces')
    })

    it('should handle slow map loading', () => {
      cy.visit('/')
      
      // Should eventually load the map
      cy.waitForMap()
      cy.get('.leaflet-container').should('be.visible')
    })
  })
})