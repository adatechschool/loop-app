# Tests End-to-End avec Cypress

Ce projet inclut des tests end-to-end (E2E) utilisant Cypress pour tester la fonctionnalité de connexion utilisateur.

## Installation et configuration

Cypress a été installé en tant que dépendance de développement. Si vous devez réinstaller :

```bash
npm install --save-dev cypress
```

## Structure des tests

```
cypress/
├── e2e/
│   ├── login.cy.ts                      # Tests de connexion utilisateur
│   ├── user-account-management.cy.js    # Tests complets de gestion de compte (détaillés)
│   └── user-workflow-complete.cy.js     # Test du workflow principal (création → modification → suppression)
├── fixtures/
│   └── users.json                       # Données de test (utilisateurs valides, invalides, et de test)
├── support/
│   ├── commands.js                      # Commandes personnalisées Cypress (login, signup, goToSettings)
│   └── e2e.js                          # Configuration globale des tests
└── cypress.config.js                    # Configuration principale Cypress
```

## Exécution des tests

### En mode interactif (avec interface graphique)
```bash
npm run cypress:open
```

### En mode headless (ligne de commande)
```bash
npm run cypress:run
```

### Pour exécuter un test spécifique
```bash
# Test du workflow principal uniquement
npx cypress run --spec "cypress/e2e/user-workflow-complete.cy.js"

# Tests de gestion de compte complets
npx cypress run --spec "cypress/e2e/user-account-management.cy.js"

# Tests de connexion
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

## Tests de connexion disponibles

Le fichier `login.cy.ts` contient les tests suivants :

1. **Connexion avec identifiants valides** - Teste la connexion réussie et la redirection
2. **Connexion avec identifiants invalides** - Teste l'affichage des messages d'erreur
3. **Affichage/masquage du mot de passe** - Teste la fonctionnalité de visibilité du mot de passe
4. **Validation des champs requis** - Teste la validation côté client
5. **Navigation vers l'inscription** - Teste la navigation entre pages
6. **Bouton retour** - Teste la fonctionnalité de retour en arrière

## Tests de gestion de compte disponibles

Le fichier `user-account-management.cy.js` contient les tests suivants :

1. **Workflow complet de gestion de compte** - Teste la création, modification et suppression d'un compte utilisateur
2. **Validation des champs d'inscription** - Teste la validation côté client du formulaire d'inscription
3. **Gestion des emails existants** - Teste la gestion d'erreur lors de l'inscription avec un email existant
4. **Navigation depuis l'inscription** - Teste la navigation de retour depuis la page d'inscription
5. **Modification de profil sans suppression** - Teste la modification isolée du profil utilisateur

## Test de workflow principal

Le fichier `user-workflow-complete.cy.js` contient le test demandé spécifiquement :

1. **Workflow complet utilisateur** - Test e2e complet qui suit le parcours : 
   - ✅ Création d'un compte utilisateur (signup)
   - ✅ Modification du profil (paramètres)
   - ✅ Suppression du compte
2. **Gestion d'erreurs** - Test de gestion d'erreur avec email existant

## Commandes personnalisées disponibles

- `cy.login(username, password)` - Connexion utilisateur
- `cy.signup(name, username, email, password)` - Inscription d'un nouvel utilisateur
- `cy.goToSettings()` - Navigation vers la page des paramètres depuis le profil

## Données de test

Les données de test sont stockées dans `cypress/fixtures/users.json` et incluent :
- Utilisateurs valides (basés sur les données de mock de l'application)
- Utilisateurs invalides pour tester les cas d'erreur

## Prérequis pour les tests

- L'application React doit être démarrée sur `http://localhost:3000`
- Le backend doit être configuré pour accepter les requêtes de test (optionnel pour les tests UI)

## Commandes personnalisées

Une commande `cy.login(username, password)` est disponible pour simplifier les tests de connexion.

## Notes importantes

- Les tests sont conçus pour tester l'interface utilisateur même si le backend n'est pas disponible
- Pour des tests complets, il faudrait configurer un environnement de test avec données de base
- Les tests nettoient automatiquement le localStorage et les cookies avant chaque exécution