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
│   ├── login.cy.js          # Tests de connexion utilisateur
│   └── places.cy.js         # Tests CRUD des lieux
├── fixtures/
│   ├── users.json           # Données de test (utilisateurs)
│   └── places.json          # Données de test (lieux)
├── support/
│   ├── commands.js          # Commandes personnalisées Cypress
│   └── e2e.js              # Configuration globale des tests
└── cypress.config.js        # Configuration principale Cypress
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

## Tests de connexion disponibles

Le fichier `login.cy.js` contient les tests suivants :

1. **Connexion avec identifiants valides** - Teste la connexion réussie et la redirection
2. **Connexion avec identifiants invalides** - Teste l'affichage des messages d'erreur
3. **Affichage/masquage du mot de passe** - Teste la fonctionnalité de visibilité du mot de passe
4. **Validation des champs requis** - Teste la validation côté client
5. **Navigation vers l'inscription** - Teste la navigation entre pages
6. **Bouton retour** - Teste la fonctionnalité de retour en arrière

## Tests CRUD des lieux disponibles

Le fichier `places.cy.js` contient les tests suivants :

1. **Création de lieu (Create)**
   - Création d'un nouveau lieu avec tous les champs
   - Validation des champs requis lors de la création

2. **Lecture de lieux (Read)**
   - Affichage de la liste des lieux
   - Visualisation des détails d'un lieu

3. **Modification de lieu (Update)**
   - Modification d'un lieu existant

4. **Suppression de lieu (Delete)**
   - Suppression d'un lieu avec confirmation
   - Test de la demande de confirmation avant suppression

5. **Navigation et interface utilisateur**
   - Navigation entre les pages de lieux
   - Validation des éléments d'interface

## Données de test

Les données de test sont stockées dans `cypress/fixtures/users.json` et incluent :
- Utilisateurs valides (basés sur les données de mock de l'application)
- Utilisateurs invalides pour tester les cas d'erreur

Les données de test pour les lieux sont stockées dans `cypress/fixtures/places.json` et incluent :
- Données de lieu de test pour la création
- Données de lieu modifié pour les tests de mise à jour
- Types de lieux disponibles

## Prérequis pour les tests

- L'application React doit être démarrée sur `http://localhost:3000`
- Le backend doit être configuré pour accepter les requêtes de test (optionnel pour les tests UI)

## Commandes personnalisées

Les commandes suivantes sont disponibles pour simplifier les tests :
- `cy.login(username, password)` - Connexion utilisateur
- `cy.loginAndWait(username, password)` - Connexion avec vérification du token
- `cy.createPlace(placeData)` - Création d'un lieu
- `cy.goToFirstPlaceDetail()` - Navigation vers le premier lieu de la liste

## Notes importantes

- Les tests sont conçus pour tester l'interface utilisateur même si le backend n'est pas disponible
- Pour des tests complets, il faudrait configurer un environnement de test avec données de base
- Les tests nettoient automatiquement le localStorage et les cookies avant chaque exécution