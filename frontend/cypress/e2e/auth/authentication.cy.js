// cypress/e2e/auth/authentication.cy.js

describe('Authentication', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    cy.visit('/')
  })

  context('User Registration', () => {
    it('should allow new user registration with valid data', () => {
      cy.fixture('users').then(users => {
        const newUser = {
          ...users.newUser,
          username: `user${Date.now()}`,
          email: `test${Date.now()}@example.com`
        }

        cy.visit('/login')
        cy.contains('Créer un compte').click()
        
        // Fill registration form
        cy.get('input[placeholder="Nom complet"]').type(newUser.name)
        cy.get('input[placeholder="Nom d\'utilisateur"]').type(newUser.username)
        cy.get('input[placeholder="Email"]').type(newUser.email)
        cy.get('input[placeholder="Mot de passe"]').type(newUser.password)
        
        // Submit form
        cy.get('button[type="submit"]').click()
        
        // Should redirect to home page
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        cy.contains('Compte créé !').should('be.visible')
      })
    })

    it('should show validation errors for invalid registration data', () => {
      cy.visit('/signup')
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Should show validation messages (HTML5 validation will prevent submission)
      cy.get('input[placeholder="Nom complet"]:invalid').should('exist')
      cy.get('input[placeholder="Email"]:invalid').should('exist')
    })

    it('should show error for already existing user', () => {
      cy.fixture('users').then(users => {
        // First registration
        const user = {
          ...users.newUser,
          username: `duplicate${Date.now()}`,
          email: `duplicate${Date.now()}@example.com`
        }
        
        cy.signup(user)
        cy.visit('/signup')
        
        // Try to register the same user again
        cy.signup(user)
        
        // Should show error message
        cy.contains('Erreur').should('be.visible')
      })
    })

    it('should allow profile picture upload during registration', () => {
      cy.fixture('users').then(users => {
        const userWithImage = {
          ...users.newUser,
          username: `imguser${Date.now()}`,
          email: `img${Date.now()}@example.com`
        }
        
        cy.visit('/signup')
        
        cy.get('input[placeholder="Nom complet"]').type(userWithImage.name)
        cy.get('input[placeholder="Nom d\'utilisateur"]').type(userWithImage.username)
        cy.get('input[placeholder="Email"]').type(userWithImage.email)
        cy.get('input[placeholder="Mot de passe"]').type(userWithImage.password)
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg')
        
        // Should show file name
        cy.contains('test-image.jpg').should('be.visible')
        
        cy.get('button[type="submit"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
      })
    })
  })

  context('User Login', () => {
    beforeEach(() => {
      // Create a test user for login tests
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `logintest${Date.now()}`,
          email: `logintest${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.wrap(testUser).as('testUser')
      })
    })

    it('should allow user login with valid credentials', function() {
      cy.visit('/signin')
      
      cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
        .type(this.testUser.email)
      cy.get('input[placeholder="Mot de passe"]')
        .type(this.testUser.password)
      
      cy.get('button[type="submit"]').click()
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Connexion réussie').should('be.visible')
      cy.shouldBeAuthenticated()
    })

    it('should show password toggle functionality', function() {
      cy.visit('/signin')
      
      cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'password')
      
      // Click show password button
      cy.get('[aria-label="Afficher le mot de passe"]').click()
      cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'text')
      
      // Click hide password button
      cy.get('[aria-label="Cacher le mot de passe"]').click()
      cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'password')
    })

    it('should show error for invalid credentials', () => {
      cy.fixture('users').then(users => {
        cy.visit('/signin')
        
        cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
          .type(users.invalidUser.username)
        cy.get('input[placeholder="Mot de passe"]')
          .type(users.invalidUser.password)
        
        cy.get('button[type="submit"]').click()
        
        cy.contains('Nom d\'utilisateur ou mot de passe invalide').should('be.visible')
        cy.shouldNotBeAuthenticated()
      })
    })

    it('should allow login with username or email', function() {
      // Test login with email
      cy.visit('/signin')
      cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
        .type(this.testUser.email)
      cy.get('input[placeholder="Mot de passe"]')
        .type(this.testUser.password)
      cy.get('button[type="submit"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Logout and test login with username
      cy.visit('/settings')
      cy.contains('Se déconnecter').click()
      
      cy.visit('/signin')
      cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
        .type(this.testUser.username)
      cy.get('input[placeholder="Mot de passe"]')
        .type(this.testUser.password)
      cy.get('button[type="submit"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  context('Navigation', () => {
    it('should navigate between login and signup forms', () => {
      cy.visit('/login')
      
      // Go to signup from login page
      cy.contains('Créer un compte').click()
      cy.url().should('include', '/signup')
      cy.contains('Inscription').should('be.visible')
      
      // Go back to login from signup page
      cy.get('[aria-label="Retour"]').click()
      cy.url().should('include', '/login')
    })

    it('should show back button on auth pages', () => {
      cy.visit('/signin')
      cy.get('[aria-label="Retour"]').should('be.visible')
      
      cy.visit('/signup')
      cy.get('[aria-label="Retour"]').should('be.visible')
    })
  })

  context('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      const protectedRoutes = ['/add', '/profile', '/settings']
      
      protectedRoutes.forEach(route => {
        cy.visit(route)
        cy.url().should('include', '/login')
      })
    })

    it('should allow access to protected routes for authenticated users', () => {
      cy.fixture('users').then(users => {
        const user = {
          ...users.validUser,
          username: `protectedtest${Date.now()}`,
          email: `protected${Date.now()}@example.com`
        }
        
        cy.signup(user)
        cy.login(user.email, user.password)
        
        const protectedRoutes = ['/add', '/profile', '/settings']
        
        protectedRoutes.forEach(route => {
          cy.visit(route)
          cy.url().should('include', route)
        })
      })
    })
  })

  context('Logout', () => {
    beforeEach(() => {
      cy.fixture('users').then(users => {
        const testUser = {
          ...users.validUser,
          username: `logouttest${Date.now()}`,
          email: `logout${Date.now()}@example.com`
        }
        cy.signup(testUser)
        cy.login(testUser.email, testUser.password)
      })
    })

    it('should logout user and clear session', () => {
      cy.visit('/settings')
      cy.contains('Se déconnecter').click()
      
      cy.shouldNotBeAuthenticated()
      cy.url().should('include', '/login')
    })
  })
})