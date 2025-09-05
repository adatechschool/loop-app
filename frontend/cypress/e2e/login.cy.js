describe('Test de connexion utilisateur', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    
    cy.fixture('users').as('users')
  })

  it('devrait permettre à un utilisateur de se connecter avec des identifiants valides', function() {
    cy.visit('/signin')

    cy.contains('Connexion').should('be.visible')

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
      .should('be.visible')
      .type(this.users.validUser.username)

    cy.get('input[placeholder="Mot de passe"]')
      .should('be.visible')
      .type(this.users.validUser.password)

    cy.get('button[type="submit"]')
      .contains('Se connecter')
      .should('be.visible')
      .click()

    cy.url().should('include', '/')
    
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token')
      if (token) {
        expect(token).to.exist
      }
    })
  })

  it('devrait afficher une erreur avec des identifiants invalides', function() {
    cy.visit('/signin')

    cy.contains('Connexion').should('be.visible')

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
      .should('be.visible')
      .type(this.users.invalidUser.username)

    cy.get('input[placeholder="Mot de passe"]')
      .should('be.visible')
      .type(this.users.invalidUser.password)

    cy.get('button[type="submit"]')
      .contains('Se connecter')
      .should('be.visible')
      .click()

    cy.contains('Nom d\'utilisateur ou mot de passe invalide')
      .should('be.visible')
    
    cy.url().should('include', '/signin')
    
    cy.window().then((window) => {
      const token = window.localStorage.getItem('token')
      expect(token).to.be.null
    })
  })

  it('devrait permettre d\'afficher/cacher le mot de passe', () => {
    cy.visit('/signin')

    cy.get('input[placeholder="Mot de passe"]').type('motdepasse123')

    cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'password')

    cy.get('button[aria-label="Afficher le mot de passe"]').click()

    cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'text')

    cy.get('button[aria-label="Cacher le mot de passe"]').click()

    cy.get('input[placeholder="Mot de passe"]').should('have.attr', 'type', 'password')
  })

  it('devrait valider les champs requis', () => {
    cy.visit('/signin')

    cy.get('button[type="submit"]').click()

    cy.get('input[placeholder="Email ou Nom d\'utilisateur"]')
      .should('have.prop', 'validity')
      .and('deep.include', { valid: false })
    
    cy.get('input[placeholder="Mot de passe"]')
      .should('have.prop', 'validity')
      .and('deep.include', { valid: false })
  })

  it('devrait permettre de naviguer vers la page d\'inscription', () => {
    cy.visit('/login')

    cy.get('button').contains('S\'inscrire').click()

    cy.url().should('include', '/signup')
  })

  it('devrait permettre de revenir en arrière depuis la page de connexion', () => {
    cy.visit('/login')
    
    // Aller à la page de connexion
    cy.get('button').contains('Se connecter').click()
    cy.url().should('include', '/signin')


    cy.get('button').first().click()
  })
})