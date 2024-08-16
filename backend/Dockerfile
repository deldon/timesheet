# Étape 1: Utiliser une image de base légère pour Node.js
FROM node:16-alpine

# Étape 2: Définir le répertoire de travail
WORKDIR /app

# Étape 3: Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm install --production

# Étape 5: Copier le reste de l'application
COPY . .

# Étape 6: Exposer le port sur lequel le backend écoute
EXPOSE 5000

# Étape 7: Démarrer l'application
CMD ["npm", "start"]
