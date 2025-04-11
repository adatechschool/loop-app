# Étape 1 : Utiliser une image officielle de Node.js
FROM node:20.18
# Étape 2 : Définir le répertoire de travail
WORKDIR /app
# Étape 3 : Copier les fichiers package.json, package-lock.json et prisma
COPY package*.json ./

COPY prisma ./prisma
# Étape 4 : Installer les dépendances de l'application
RUN npm install
# Étape 5 : Générer le client Prisma
RUN npx prisma generate
# Étape 6 : Copier tous les fichiers de l'application (le reste du code)
COPY . .
# Étape 7 : Exposer le port
EXPOSE 5000
# Étape 8 : Lancer l'application
CMD ["npm", "run", "dev"]
