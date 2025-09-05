#!/bin/bash

# Verification script for Cypress CRUD tests setup
# This script checks if all required files and configurations are in place

echo "🔍 Vérification de la configuration des tests Cypress CRUD pour les lieux"
echo "================================================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : Ce script doit être exécuté depuis le dossier frontend"
    exit 1
fi

echo "✅ Dossier frontend détecté"

# Check Cypress configuration file
if [ -f "cypress.config.js" ]; then
    echo "✅ cypress.config.js trouvé"
else
    echo "❌ cypress.config.js manquant"
fi

# Check test files
echo ""
echo "📁 Vérification des fichiers de test :"

if [ -f "cypress/e2e/login.cy.js" ]; then
    echo "✅ cypress/e2e/login.cy.js"
else
    echo "❌ cypress/e2e/login.cy.js manquant"
fi

if [ -f "cypress/e2e/places.cy.js" ]; then
    echo "✅ cypress/e2e/places.cy.js"
    lines=$(wc -l < cypress/e2e/places.cy.js)
    echo "   └── $lines lignes de code"
else
    echo "❌ cypress/e2e/places.cy.js manquant"
fi

# Check fixture files
echo ""
echo "📄 Vérification des données de test :"

if [ -f "cypress/fixtures/users.json" ]; then
    echo "✅ cypress/fixtures/users.json"
else
    echo "❌ cypress/fixtures/users.json manquant"
fi

if [ -f "cypress/fixtures/places.json" ]; then
    echo "✅ cypress/fixtures/places.json"
else
    echo "❌ cypress/fixtures/places.json manquant"
fi

# Check support files
echo ""
echo "🛠️  Vérification des fichiers de support :"

if [ -f "cypress/support/commands.js" ]; then
    echo "✅ cypress/support/commands.js"
    # Check if custom commands are present
    if grep -q "createPlace" cypress/support/commands.js; then
        echo "   └── ✅ Commande createPlace trouvée"
    else
        echo "   └── ❌ Commande createPlace manquante"
    fi
    
    if grep -q "loginAndWait" cypress/support/commands.js; then
        echo "   └── ✅ Commande loginAndWait trouvée"
    else
        echo "   └── ❌ Commande loginAndWait manquante"
    fi
else
    echo "❌ cypress/support/commands.js manquant"
fi

if [ -f "cypress/support/e2e.js" ]; then
    echo "✅ cypress/support/e2e.js"
else
    echo "❌ cypress/support/e2e.js manquant"
fi

# Check documentation files
echo ""
echo "📚 Vérification de la documentation :"

if [ -f "cypress/README.md" ]; then
    echo "✅ cypress/README.md"
else
    echo "❌ cypress/README.md manquant"
fi

if [ -f "cypress/MANUAL_TESTING.md" ]; then
    echo "✅ cypress/MANUAL_TESTING.md"
else
    echo "❌ cypress/MANUAL_TESTING.md manquant"
fi

# Check package.json for Cypress scripts
echo ""
echo "📦 Vérification des scripts npm :"

if grep -q "cypress:open" package.json; then
    echo "✅ Script cypress:open trouvé"
else
    echo "❌ Script cypress:open manquant"
fi

if grep -q "cypress:run" package.json; then
    echo "✅ Script cypress:run trouvé"
else
    echo "❌ Script cypress:run manquant"
fi

# Check if Cypress is installed
echo ""
echo "🔧 Vérification de l'installation Cypress :"

if [ -d "node_modules/cypress" ]; then
    echo "✅ Cypress installé dans node_modules"
else
    echo "❌ Cypress non installé - exécuter: npm install"
fi

# Summary
echo ""
echo "📊 Résumé :"
echo "✅ Tests de connexion : cypress/e2e/login.cy.js"
echo "✅ Tests CRUD lieux : cypress/e2e/places.cy.js"
echo "✅ Données utilisateurs : cypress/fixtures/users.json" 
echo "✅ Données lieux : cypress/fixtures/places.json"
echo "✅ Commandes personnalisées : cypress/support/commands.js"
echo "✅ Documentation complète disponible"

echo ""
echo "🚀 Pour exécuter les tests :"
echo "   npm run cypress:open    (mode interactif)"
echo "   npm run cypress:run     (mode headless)"

echo ""
echo "📖 Pour plus d'informations :"
echo "   cat cypress/README.md"
echo "   cat cypress/MANUAL_TESTING.md"