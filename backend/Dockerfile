# Étape 1 : Utiliser une image officielle de Node.js
FROM node:20.18

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances de l'application
RUN npm install

# Étape 5 : Copier tous les fichiers de l'application dans le conteneur
COPY . .

# Étape 6 : Exposer le port sur lequel l'app écoute
EXPOSE 5000

# Étape 7 : Lancer l'application
CMD ["npm", "run", "dev"]
