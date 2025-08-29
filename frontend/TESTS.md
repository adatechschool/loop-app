# Tests unitaires - Loop App Frontend

Ce fichier décrit la suite de tests unitaires créée pour l'application Loop App frontend.

## Configuration Jest

### Configuration dans package.json
```json
"jest": {
  "transformIgnorePatterns": [
    "node_modules/(?!(react-leaflet|@react-leaflet|axios)/)"
  ],
  "moduleNameMapper": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^leaflet$": "<rootDir>/src/__mocks__/leaflet.ts",
    "^react-leaflet$": "<rootDir>/src/__mocks__/react-leaflet.tsx"
  }
}
```

### Mocks créés
- **@chakra-ui/react** : Mocks pour tous les composants Chakra UI
- **@chakra-ui/icons** : Mocks pour les icônes
- **leaflet** : Mock pour la bibliothèque de cartes
- **react-leaflet** : Mocks pour les composants de carte React

## Tests créés

### ✅ Tests fonctionnels

#### Utils (/src/utils/__tests__/)
- `constant.test.js` - Test des constantes de l'app (types de lieux, couleurs)
- `mock.test.js` - Validation des données de mock (users, places)
- `apiClient.test.ts` - Test du client API Axios
- `ChangeView.test.tsx` - Test du composant utilitaire de vue carte

#### Hooks (/src/hooks/__tests__/)
- `useGetPlace.test.tsx` - Hook pour récupérer un lieu spécifique
- `useQueryPlaces.test.tsx` - Hook pour récupérer tous les lieux
- `useQueryUser.test.tsx` - Hook pour récupérer les données utilisateur (partiellement fonctionnel)
- `useGeolocation.test.tsx` - Hook pour la géolocalisation

#### Components (/src/components/__tests__/)
- `BackButton.test.tsx` - Bouton de retour navigation
- `Card.test.tsx` - Composant carte de lieu
- `LikeButton.test.tsx` - Bouton j'aime/pas j'aime
- `GpsButton.test.tsx` - Bouton GPS
- `InstallPWAButton.test.tsx` - Bouton d'installation PWA
- `NavBar.test.tsx` - Barre de navigation
- `FormAddList.test.tsx` - Formulaire d'ajout de lieu (structure de base)

#### Pages (/src/pages/__tests__/)
- `ListPage.test.tsx` - Page liste des lieux
- `HomePage.test.tsx` - Page d'accueil
- `AddPage.test.tsx` - Page d'ajout de lieu
- `SearchPage.test.tsx` - Page de recherche
- `ProfilePage.test.tsx` - Page de profil utilisateur
- `DetailPage.test.tsx` - Page de détails d'un lieu
- `LoginForm.test.tsx` - Formulaire de connexion
- `SignupForm.test.tsx` - Formulaire d'inscription

#### Routes (/src/routes/__tests__/)
- `PrivateRoute.test.tsx` - Route protégée
- `PublicRoute.test.tsx` - Route publique

#### Layouts (/src/layouts/__tests__/)
- `MainLayout.test.tsx` - Layout principal avec navbar
- `AuthLayout.test.tsx` - Layout pour l'authentification

#### Contexts (/src/contexts/__tests__/)
- `PlacesContext.test.tsx` - Context de gestion des lieux
- `GeolocationContext.test.tsx` - Context de géolocalisation
- `AuthContext.test.tsx` - Context d'authentification (nécessite corrections)

### 🔧 Tests nécessitant des ajustements
Certains tests ont été créés mais nécessitent des ajustements pour passer complètement :
- Tests des contextes complexes avec des dépendances d'API
- Tests des composants avec des intégrations Chakra UI complexes
- Tests des formulaires avec upload d'images

## Fonctionnalités testées

### ✅ Authentification
- Login/logout
- Gestion des tokens
- Routes protégées/publiques

### ✅ Navigation
- Boutons de navigation
- Routage
- Layouts

### ✅ Gestion des lieux
- Affichage des lieux
- Récupération via API
- Filtrage par utilisateur

### ✅ Géolocalisation
- Hook de géolocalisation
- Gestion d'erreurs GPS

### ✅ Interface utilisateur
- Composants de base
- Boutons interactifs
- States de chargement/erreur

## Commandes pour exécuter les tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test utils/
npm test hooks/
npm test components/
npm test pages/

# Tests en mode watch (développement)
npm test -- --watch

# Tests avec couverture
npm test -- --coverage
```

## Mocks et configuration

Les mocks créés permettent de tester les composants sans dépendances externes :
- APIs externes (Cloudinary, Backend)
- Géolocalisation navigateur
- Stockage local
- Composants UI complexes

Cette suite de tests couvre les principales fonctionnalités de l'application Loop App et assure la qualité du code frontend.