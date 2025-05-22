# Étape 1 : Utiliser une image officielle de Node.js
FROM node:20.18
# Étape 2 : Définir le répertoire de travail
WORKDIR /app
# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./
# Étape 4 : Installer les dépendances
RUN npm install
# Étape 5 : Copier tout le code de l'application, y compris le dossier prisma
COPY . .
# Étape 6 : Générer le client Prisma (sur le schéma à jour)
RUN npx prisma generate
# Étape 7 : Exposer le port
EXPOSE 5000
# Étape 8 : Lancer l'application
CMD ["npm", "run", "dev"]
