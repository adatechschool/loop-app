# Tests End-to-End avec Cypress

Ce projet inclut des tests end-to-end (E2E) utilisant Cypress pour tester les fonctionnalités de l'application Loop, notamment la connexion utilisateur et les opérations CRUD sur les lieux.

## Installation et configuration

Cypress a été installé en tant que dépendance de développement. Si vous devez réinstaller :

```bash
npm install --save-dev cypress
```

## Structure des tests

```
cypress/
├── e2e/
│   ├── login.cy.ts            # Tests de connexion utilisateur
│   ├── places-crud.cy.ts      # Tests CRUD complets pour les lieux
│   └── places-basic.cy.ts     # Tests CRUD basiques pour les lieux
├── fixtures/
│   ├── users.json             # Données de test (utilisateurs)
│   └── places.json            # Données de test (lieux)
├── support/
│   ├── commands.js            # Commandes personnalisées Cypress
│   ├── commands.d.ts          # Types TypeScript pour les commandes
│   └── e2e.js                # Configuration globale des tests
└── cypress.config.js          # Configuration principale Cypress
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

### Exécuter des tests spécifiques
```bash
# Tests de connexion seulement
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Tests CRUD basiques seulement
npx cypress run --spec "cypress/e2e/places-basic.cy.ts"

# Tests CRUD complets seulement
npx cypress run --spec "cypress/e2e/places-crud.cy.ts"
```

## Tests disponibles

### Tests de connexion (`login.cy.ts`)
1. **Connexion avec identifiants valides** - Teste la connexion réussie et la redirection
2. **Connexion avec identifiants invalides** - Teste l'affichage des messages d'erreur
3. **Affichage/masquage du mot de passe** - Teste la fonctionnalité de visibilité du mot de passe
4. **Validation des champs requis** - Teste la validation côté client
5. **Navigation vers l'inscription** - Teste la navigation entre pages
6. **Bouton retour** - Teste la fonctionnalité de retour en arrière

### Tests CRUD des lieux (`places-crud.cy.ts`)

#### Create (Création)
- ✅ Créer un lieu avec tous les champs
- ✅ Créer un lieu avec les champs minimaux requis
- ✅ Validation des champs requis
- ✅ Gestion des erreurs réseau

#### Read (Lecture)
- ✅ Afficher les lieux dans la liste
- ✅ Voir les détails d'un lieu
- ✅ Gérer les lieux inexistants (404)
- ✅ Navigation entre les pages

#### Update (Mise à jour)
- ✅ Modifier tous les champs d'un lieu
- ✅ Formulaire pré-rempli avec les données existantes
- ✅ Gestion des erreurs réseau
- ✅ Contrôle d'accès (propriétaire uniquement)

#### Delete (Suppression)
- ✅ Supprimer un lieu avec confirmation
- ✅ Annuler la suppression
- ✅ Gestion des erreurs réseau
- ✅ Contrôle d'accès (propriétaire uniquement)

#### Tests d'intégration
- ✅ Cycle CRUD complet
- ✅ Scénarios d'erreur
- ✅ Permissions utilisateur

### Tests CRUD basiques (`places-basic.cy.ts`)
- Tests simplifiés pour validation rapide
- Cycle CRUD en un seul test
- Validation des champs requis
- Affichage de la liste des lieux

## Données de test

Les données de test sont stockées dans `cypress/fixtures/` :

### `users.json`
- Utilisateurs valides (basés sur les données de mock de l'application)
- Utilisateurs invalides pour tester les cas d'erreur

### `places.json`
- Lieux de test avec tous les champs
- Lieux minimaux
- Données de modification
- Données invalides pour les tests d'erreur

## Prérequis pour les tests

1. **Application React** démarrée sur `http://localhost:3000`
2. **Backend API** démarré sur `http://localhost:5000`
3. **Utilisateur de test** existant en base de données avec les identifiants dans `users.json`
4. **Permissions CORS** configurées pour accepter les requêtes depuis localhost:3000

## Commandes personnalisées

### Authentification
- `cy.login(username, password)` - Connexion avec identifiants
- `cy.loginAsValidUser()` - Connexion avec les données de fixture

### API des lieux
- `cy.createPlaceViaAPI(placeData)` - Créer un lieu via l'API
- `cy.deletePlaceViaAPI(placeId)` - Supprimer un lieu via l'API
- `cy.getPlacesViaAPI()` - Récupérer tous les lieux via l'API

### Formulaires
- `cy.fillPlaceForm(placeData)` - Remplir le formulaire de lieu
- `cy.verifyUrlContains(urlPart)` - Vérifier qu'une URL contient une partie

## Configuration d'environnement

Les tests sont configurés pour utiliser :
- **Frontend** : `http://localhost:3000` (baseUrl)
- **Backend API** : `http://localhost:5000` (REACT_APP_LOOP_API_URL)

Ces valeurs peuvent être modifiées dans `cypress.config.js`.

## Dépannage

### Problèmes courants

1. **Échec d'authentification**
   - Vérifier que l'utilisateur de test existe en base de données
   - Vérifier les identifiants dans `cypress/fixtures/users.json`

2. **Échec des appels API**
   - S'assurer que le backend fonctionne sur le port 5000
   - Vérifier la configuration CORS
   - Vérifier l'accessibilité des endpoints API

3. **Éléments non trouvés**
   - Les composants UI peuvent avoir changé
   - Mettre à jour les sélecteurs dans les fichiers de test
   - Utiliser le Test Runner Cypress pour inspecter les éléments

4. **Problèmes d'état de base de données**
   - Les tests créent et nettoient les données de test
   - En cas d'échec, vérifier la présence de données de test orphelines
   - Considérer un nettoyage de base entre les exécutions de test

### Conseils de débogage

1. Utiliser `cy.pause()` pour mettre en pause l'exécution
2. Utiliser le Test Runner Cypress pour le débogage étape par étape
3. Vérifier la console du navigateur pour les erreurs JavaScript
4. Vérifier les requêtes réseau dans les DevTools
5. Utiliser `cy.screenshot()` pour capturer l'état

## Bonnes pratiques

1. **Isolation des tests** : Chaque test doit être indépendant
2. **Nettoyage des données** : Les tests nettoient les données créées
3. **Stratégies d'attente** : Utiliser des stratégies d'attente appropriées pour les opérations asynchrones
4. **Sélecteurs** : Utiliser des sélecteurs stables (éviter de dépendre des détails d'implémentation)
5. **Gestion d'erreur** : Tester à la fois les scénarios de succès et d'erreur

## Notes importantes

- Les tests sont conçus pour nettoyer automatiquement les données de test créées
- Pour des tests complets, s'assurer que l'environnement de test est configuré avec des données de base appropriées
- Les tests nettoient automatiquement le localStorage et les cookies avant chaque exécution
- Les tests CRUD nécessitent un backend fonctionnel contrairement aux tests de connexion qui peuvent fonctionner en mode UI uniquement