# Étape 1: Construire l'application React
FROM node:16-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source et construire l'application
COPY . .
RUN npm run build

# Étape 2: Servir l'application construite avec Nginx
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
