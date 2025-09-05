# Test Manual - Vérification des fonctionnalités de connexion et CRUD des lieux

En attendant que Cypress soit complètement configuré avec le binaire, voici une checklist pour tester manuellement les fonctionnalités couvertes par les tests Cypress :

## ✅ Fonctionnalités testées par le script Cypress `login.cy.js`

### 1. Connexion avec identifiants valides
- [ ] Naviguer vers `/signin`
- [ ] Vérifier que le titre "Connexion" est affiché
- [ ] Saisir un nom d'utilisateur valide (ex: `mcarre`)
- [ ] Saisir un mot de passe (ex: `password123`)
- [ ] Cliquer sur "Se connecter"
- [ ] Vérifier la redirection vers la page d'accueil (`/`)
- [ ] Vérifier que le token est stocké dans localStorage

### 2. Connexion avec identifiants invalides
- [ ] Naviguer vers `/signin`
- [ ] Saisir un nom d'utilisateur invalide (ex: `utilisateur_inexistant`)
- [ ] Saisir un mot de passe invalide (ex: `mot_de_passe_incorrect`)
- [ ] Cliquer sur "Se connecter"
- [ ] Vérifier l'affichage du message d'erreur "Nom d'utilisateur ou mot de passe invalide"
- [ ] Vérifier que nous restons sur la page `/signin`
- [ ] Vérifier qu'aucun token n'est stocké dans localStorage

### 3. Affichage/masquage du mot de passe
- [ ] Naviguer vers `/signin`
- [ ] Saisir un mot de passe dans le champ
- [ ] Vérifier que le champ est de type `password` par défaut
- [ ] Cliquer sur l'icône œil pour afficher le mot de passe
- [ ] Vérifier que le champ devient de type `text`
- [ ] Cliquer à nouveau pour masquer le mot de passe
- [ ] Vérifier que le champ redevient de type `password`

### 4. Validation des champs requis
- [ ] Naviguer vers `/signin`
- [ ] Cliquer sur "Se connecter" sans remplir les champs
- [ ] Vérifier que les champs sont marqués comme invalides (validation HTML5)

### 5. Navigation vers l'inscription
- [ ] Naviguer vers `/login`
- [ ] Cliquer sur le bouton "S'inscrire"
- [ ] Vérifier la redirection vers `/signup`

### 6. Bouton retour
- [ ] Naviguer vers `/login`
- [ ] Cliquer sur "Se connecter" pour aller à `/signin`
- [ ] Cliquer sur le bouton retour (BackButton)
- [ ] Vérifier le retour à la page précédente

## ✅ Fonctionnalités testées par le script Cypress `places.cy.js`

### Tests de création (Create)

#### 1. Création d'un nouveau lieu
- [ ] Se connecter avec un utilisateur valide
- [ ] Naviguer vers `/add`
- [ ] Vérifier l'affichage du titre "Ajouter un lieu"
- [ ] Remplir le champ "Nom" avec "Parc de Test Cypress"
- [ ] Remplir le champ "Adresse" avec "123 Rue de Test, Paris"
- [ ] Remplir la description avec "Un parc créé pour les tests automatisés Cypress"
- [ ] Sélectionner "Parc" dans la catégorie
- [ ] Activer l'accessibilité si nécessaire
- [ ] Cliquer sur "Ajouter"
- [ ] Vérifier la redirection vers `/places` ou `/`
- [ ] Vérifier l'affichage d'un message de succès contenant "créé"

#### 2. Validation des champs requis
- [ ] Naviguer vers `/add`
- [ ] Cliquer sur "Ajouter" sans remplir les champs
- [ ] Vérifier que les champs "Nom" et "Adresse" sont marqués comme invalides

### Tests de lecture (Read)

#### 3. Affichage de la liste des lieux
- [ ] Naviguer vers `/places`
- [ ] Vérifier l'affichage du titre "Lieux à proximité"
- [ ] Vérifier l'affichage des lieux ou du message "Aucun lieux disponibles"

#### 4. Visualisation des détails d'un lieu
- [ ] Naviguer vers `/places`
- [ ] Si des lieux sont disponibles, cliquer sur le premier lieu
- [ ] Vérifier la navigation vers une URL de type `/places/:id`
- [ ] Vérifier la présence du bouton "Voir sur la map"

### Tests de modification (Update)

#### 5. Modification d'un lieu existant
- [ ] Naviguer vers un lieu existant
- [ ] Vérifier la présence de l'icône d'édition (crayon) en haut à droite
- [ ] Cliquer sur l'icône d'édition
- [ ] Vérifier la navigation vers `/edit/:id`
- [ ] Modifier le nom du lieu
- [ ] Modifier l'adresse du lieu
- [ ] Modifier la description
- [ ] Cliquer sur "Modifier"
- [ ] Vérifier l'affichage d'un message de succès contenant "modifié"

### Tests de suppression (Delete)

#### 6. Suppression d'un lieu
- [ ] Naviguer vers un lieu existant
- [ ] Vérifier la présence de l'icône de suppression (poubelle rouge) en haut à droite
- [ ] Cliquer sur l'icône de suppression
- [ ] Vérifier l'affichage de la boîte de dialogue de confirmation
- [ ] Vérifier le texte "Êtes-vous sûr de vouloir supprimer ce lieu ?"
- [ ] Cliquer sur "Supprimer" pour confirmer
- [ ] Vérifier la redirection vers `/places` ou `/`
- [ ] Vérifier l'affichage d'un message de succès contenant "supprimé"

#### 7. Annulation de suppression
- [ ] Naviguer vers un lieu existant
- [ ] Cliquer sur l'icône de suppression
- [ ] Vérifier l'affichage de la boîte de dialogue de confirmation
- [ ] Cliquer sur "Annuler"
- [ ] Vérifier que l'on reste sur la page de détail du lieu

### Tests d'interface utilisateur

#### 8. Navigation entre les pages
- [ ] Naviguer vers `/places`
- [ ] Naviguer vers `/add`
- [ ] Tester le bouton retour du navigateur
- [ ] Vérifier que la navigation fonctionne correctement

#### 9. Éléments d'interface
- [ ] Naviguer vers `/add`
- [ ] Vérifier la présence du champ "Nom"
- [ ] Vérifier la présence du champ "Adresse"
- [ ] Vérifier la présence du champ "Description"
- [ ] Vérifier la présence du sélecteur de catégorie
- [ ] Vérifier la présence du bouton "Ajouter"

## 🔧 Configuration Cypress

Les fichiers suivants ont été créés pour les tests automatisés :

### Fichiers de test
- `cypress/e2e/login.cy.js` - Tests de connexion
- `cypress/e2e/places.cy.js` - Tests CRUD des lieux

### Fichiers de configuration
- `cypress.config.js` - Configuration principale
- `cypress/support/commands.js` - Commandes personnalisées
- `cypress/support/e2e.js` - Configuration globale

### Données de test
- `cypress/fixtures/users.json` - Données utilisateurs de test
- `cypress/fixtures/places.json` - Données lieux de test

### Documentation
- `cypress/README.md` - Documentation complète
- `cypress/MANUAL_TESTING.md` - Ce guide de test manuel

## 🚀 Exécution des tests automatisés

Une fois que Cypress est correctement installé avec son binaire :

```bash
# Mode interactif (recommandé pour le développement)
npm run cypress:open

# Mode headless (pour CI/CD)
npm run cypress:run
```

## 📝 Notes importantes

- Les tests sont conçus pour fonctionner avec ou sans backend
- Ils testent principalement l'interface utilisateur et les interactions
- Les tests utilisent des sélecteurs spécifiques aux composants Chakra UI
- Pour des tests complets, assurez-vous d'avoir des données de test appropriées

## 🎯 Commandes personnalisées Cypress

Les tests utilisent ces commandes personnalisées :

```javascript
// Connexion simple
cy.login(username, password)

// Connexion avec vérification du token
cy.loginAndWait(username, password)

// Création d'un lieu
cy.createPlace(placeData)

// Navigation vers le premier lieu
cy.goToFirstPlaceDetail()
```