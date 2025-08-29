// cypress/e2e/error-handling/error-scenarios.cy.js

describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    cy.cleanupTestData()
  })

  context('Network Errors', () => {
    beforeEach(() => {
      // Create and login with a test user for authenticated tests
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `errortest${Date.now()}`,
          email: `error${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)
      })
    })

    it('should handle API server errors gracefully', () => {
      // Mock 500 server error
      cy.intercept('GET', '**/api/places', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('serverError')

      cy.visit('/places')
      cy.wait('@serverError')

      // Should show error message
      cy.contains('erreur', { matchCase: false }).should('be.visible')
    })

    it('should handle network connectivity issues', () => {
      // Mock network failure
      cy.intercept('GET', '**/api/places', { forceNetworkError: true }).as('networkError')

      cy.visit('/places')
      cy.wait('@networkError')

      // Should show connection error message
      cy.contains('connexion', { matchCase: false }).should('be.visible')
    })

    it('should handle timeout errors', () => {
      // Mock request timeout
      cy.intercept('GET', '**/api/places', {
        delay: 11000, // Longer than the request timeout
        body: []
      }).as('timeoutError')

      cy.visit('/places')
      
      // Should show timeout or error message
      cy.contains('erreur', { matchCase: false }).should('be.visible')
    })

    it('should handle 404 errors for resources', () => {
      // Mock 404 for specific place
      cy.intercept('GET', '**/api/places/999999', {
        statusCode: 404,
        body: { error: 'Place not found' }
      }).as('notFoundError')

      cy.visit('/places/999999')
      cy.wait('@notFoundError')

      // Should show place not found message
      cy.contains('Lieu introuvable').should('be.visible')
      cy.contains('Retour à la page d\'accueil').should('be.visible')
    })

    it('should handle unauthorized access errors', () => {
      // Mock 401 unauthorized
      cy.intercept('GET', '**/api/user', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('unauthorizedError')

      cy.visit('/profile')
      cy.wait('@unauthorizedError')

      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  context('Form Validation Errors', () => {
    it('should handle invalid form data on signup', () => {
      cy.visit('/signup')

      // Submit with invalid email
      cy.get('input[placeholder="Nom complet"]').type('Test User')
      cy.get('input[placeholder="Nom d\'utilisateur"]').type('testuser')
      cy.get('input[placeholder="Email"]').type('invalid-email')
      cy.get('input[placeholder="Mot de passe"]').type('short')

      cy.get('button[type="submit"]').click()

      // Should show validation errors
      cy.get('input[placeholder="Email"]:invalid').should('exist')
    })

    it('should handle missing required fields', () => {
      cy.visit('/signup')

      // Try to submit empty form
      cy.get('button[type="submit"]').click()

      // Should prevent submission
      cy.get('input[placeholder="Nom complet"]:invalid').should('exist')
      cy.get('input[placeholder="Email"]:invalid').should('exist')
    })

    it('should handle file upload errors', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `filetest${Date.now()}`,
          email: `file${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        // Mock file upload error
        cy.intercept('POST', '**/image/upload', {
          statusCode: 500,
          body: { error: 'Upload failed' }
        }).as('uploadError')

        cy.visit('/add')
        cy.get('input[placeholder*="nom"]').type('Test Place')
        cy.get('textarea[placeholder*="description"]').type('Test description')
        cy.get('input[placeholder*="adresse"]').type('Test address')

        // Try to upload file
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
        cy.get('button[type="submit"]').click()

        cy.wait('@uploadError')

        // Should show upload error
        cy.contains('erreur', { matchCase: false }).should('be.visible')
      })
    })
  })

  context('Authentication Edge Cases', () => {
    it('should handle expired tokens', () => {
      // Set expired token
      cy.window().then(win => {
        win.localStorage.setItem('token', 'expired-token')
      })

      // Mock 401 response
      cy.intercept('GET', '**/api/user', {
        statusCode: 401,
        body: { error: 'Token expired' }
      }).as('expiredToken')

      cy.visit('/profile')
      cy.wait('@expiredToken')

      // Should redirect to login
      cy.url().should('include', '/login')
      cy.shouldNotBeAuthenticated()
    })

    it('should handle malformed tokens', () => {
      // Set malformed token
      cy.window().then(win => {
        win.localStorage.setItem('token', 'malformed-token')
      })

      cy.intercept('GET', '**/api/user', {
        statusCode: 401,
        body: { error: 'Invalid token' }
      }).as('malformedToken')

      cy.visit('/profile')
      cy.wait('@malformedToken')

      // Should redirect to login and clear token
      cy.url().should('include', '/login')
      cy.shouldNotBeAuthenticated()
    })

    it('should handle concurrent login sessions', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `concurrent${Date.now()}`,
          email: `concurrent${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        // Simulate token being invalidated by another session
        cy.window().then(win => {
          win.localStorage.removeItem('token')
        })

        cy.visit('/profile')

        // Should redirect to login
        cy.url().should('include', '/login')
      })
    })
  })

  context('Data Integrity Issues', () => {
    beforeEach(() => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `datatest${Date.now()}`,
          email: `data${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)
      })
    })

    it('should handle corrupted place data', () => {
      // Mock corrupted place data
      cy.intercept('GET', '**/api/places/**', {
        statusCode: 200,
        body: {
          id: 1,
          name: null, // Corrupted data
          description: undefined,
          address: '',
          images: null
        }
      }).as('corruptedPlace')

      cy.visit('/places/1')
      cy.wait('@corruptedPlace')

      // Should handle gracefully without crashing
      cy.get('body').should('exist')
      // Should show fallback or error message
      cy.contains('erreur', { matchCase: false }).should('be.visible')
    })

    it('should handle missing required data fields', () => {
      cy.intercept('GET', '**/api/places', {
        statusCode: 200,
        body: [
          {
            id: 1
            // Missing required fields like name, description
          }
        ]
      }).as('incompleteData')

      cy.visit('/places')
      cy.wait('@incompleteData')

      // Should handle incomplete data gracefully
      cy.get('body').should('exist')
    })

    it('should handle invalid date formats', () => {
      cy.intercept('GET', '**/api/places', {
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Test Place',
            createdAt: 'invalid-date-format',
            updatedAt: null
          }
        ]
      }).as('invalidDates')

      cy.visit('/places')
      cy.wait('@invalidDates')

      // Should handle invalid dates without breaking
      cy.contains('Test Place').should('be.visible')
    })
  })

  context('Browser Compatibility Issues', () => {
    it('should handle localStorage unavailability', () => {
      // Disable localStorage
      cy.window().then(win => {
        delete win.localStorage
      })

      cy.visit('/signin')

      // Should still function without localStorage
      cy.get('input[placeholder="Email ou Nom d\'utilisateur"]').should('be.visible')
      cy.get('input[placeholder="Mot de passe"]').should('be.visible')
    })

    it('should handle geolocation unavailability', () => {
      // Mock geolocation as unavailable
      cy.window().then(win => {
        delete win.navigator.geolocation
      })

      cy.visit('/')

      // Should still load map without geolocation
      cy.waitForMap()
      cy.get('.leaflet-container').should('be.visible')
    })

    it('should handle file API unavailability', () => {
      // Mock File API as unavailable
      cy.window().then(win => {
        delete win.File
        delete win.FileList
        delete win.FileReader
      })

      cy.visit('/add')

      // Should still show form without file upload
      cy.get('input[placeholder*="nom"]').should('be.visible')
      cy.get('textarea[placeholder*="description"]').should('be.visible')
    })
  })

  context('Resource Loading Failures', () => {
    it('should handle image loading failures', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `imgtest${Date.now()}`,
          email: `img${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        // Mock place with broken image URLs
        cy.intercept('GET', '**/api/places/**', {
          statusCode: 200,
          body: {
            id: 1,
            name: 'Test Place',
            description: 'Test description',
            address: 'Test address',
            images: [
              { url: 'https://broken-image-url.com/image1.jpg' },
              { url: 'https://broken-image-url.com/image2.jpg' }
            ]
          }
        }).as('brokenImages')

        cy.visit('/places/1')
        cy.wait('@brokenImages')

        // Should show place info even with broken images
        cy.contains('Test Place').should('be.visible')
        cy.contains('Test description').should('be.visible')
      })
    })

    it('should handle CSS/font loading failures', () => {
      // Simulate missing CSS
      cy.visit('/')

      // Should still be functional even with missing styles
      cy.get('body').should('exist')
      cy.get('nav').should('exist')
    })

    it('should handle map tile loading failures', () => {
      // Mock map tiles as failing
      cy.intercept('GET', '**/{z}/{x}/{y}.png', {
        statusCode: 404
      }).as('failedTiles')

      cy.visit('/')

      // Should still show map container
      cy.get('.leaflet-container').should('be.visible')
    })
  })

  context('Memory and Performance Issues', () => {
    it('should handle large datasets', () => {
      // Mock large number of places
      const largePlaceList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Place ${i + 1}`,
        description: 'Test description',
        address: 'Test address'
      }))

      cy.intercept('GET', '**/api/places', {
        statusCode: 200,
        body: largePlaceList
      }).as('largePlaceList')

      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `perftest${Date.now()}`,
          email: `perf${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        cy.visit('/places')
        cy.wait('@largePlaceList')

        // Should handle large dataset without freezing
        cy.contains('Place 1').should('be.visible')
        cy.get('body').should('be.responsive')
      })
    })

    it('should handle rapid user interactions', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `rapidtest${Date.now()}`,
          email: `rapid${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        cy.visit('/')

        // Rapidly click navigation items
        for (let i = 0; i < 5; i++) {
          cy.get('nav').within(() => {
            cy.contains('Lieux').click()
            cy.wait(100)
            cy.contains('Ajouter').click()
            cy.wait(100)
            cy.contains('Rechercher').click()
            cy.wait(100)
            cy.contains('Profil').click()
            cy.wait(100)
          })
        }

        // Should remain responsive
        cy.get('body').should('exist')
      })
    })
  })

  context('Security Edge Cases', () => {
    it('should handle XSS attempts in form inputs', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `xsstest${Date.now()}`,
          email: `xss${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        cy.visit('/add')

        const xssAttempt = '<script>alert("XSS")</script>'

        // Try XSS in form fields
        cy.get('input[placeholder*="nom"]').type(xssAttempt)
        cy.get('textarea[placeholder*="description"]').type(xssAttempt)
        cy.get('input[placeholder*="adresse"]').type('Valid address')

        cy.get('button[type="submit"]').click()

        // Should not execute script
        cy.on('window:alert', () => {
          throw new Error('XSS vulnerability detected!')
        })

        // Should handle as text content
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })

    it('should handle SQL injection attempts', () => {
      cy.visit('/search')

      const sqlInjection = "'; DROP TABLE users; --"

      // Try SQL injection in search
      cy.get('input[placeholder*="rechercher"]').type(sqlInjection)
      cy.get('button[type="submit"]').click()

      // Should treat as normal search query
      cy.get('body').should('exist')
    })
  })

  context('Offline Scenarios', () => {
    it('should handle offline state', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `offlinetest${Date.now()}`,
          email: `offline${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        // Simulate offline state
        cy.window().then(win => {
          win.navigator.__defineGetter__('onLine', () => false)
        })

        cy.visit('/')

        // Should show offline message or cached content
        cy.get('body').should('exist')
      })
    })

    it('should handle connection recovery', () => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `recoverytest${Date.now()}`,
          email: `recovery${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)

        // Start offline
        cy.window().then(win => {
          win.navigator.__defineGetter__('onLine', () => false)
        })

        cy.visit('/')

        // Come back online
        cy.window().then(win => {
          win.navigator.__defineGetter__('onLine', () => true)
          win.dispatchEvent(new Event('online'))
        })

        // Should recover and function normally
        cy.get('body').should('exist')
      })
    })
  })
})