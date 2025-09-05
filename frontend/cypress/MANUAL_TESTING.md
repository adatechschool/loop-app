# Test Manual - Vérification des fonctionnalités de connexion

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

## 🔧 Configuration Cypress

Les fichiers suivants ont été créés pour les tests automatisés :

- `cypress.config.js` - Configuration principale
- `cypress/e2e/login.cy.js` - Tests de connexion
- `cypress/support/commands.js` - Commandes personnalisées
- `cypress/support/e2e.js` - Configuration globale
- `cypress/fixtures/users.json` - Données de test
- `cypress/README.md` - Documentation

## 🚀 Exécution des tests automatisés

Une fois que Cypress est correctement installé avec son binaire :

```bash
# Mode interactif
npm run cypress:open

# Mode headless
npm run cypress:run
```

## 📝 Notes importantes

- Les tests sont conçus pour fonctionner indépendamment du backend
- Ils testent principalement l'interface utilisateur et les interactions
- Pour des tests complets, il faudrait configurer un environnement de test avec données mockées