# Étape 1 : Utiliser l'image Caddy comme base
FROM caddy:alpine

# Étape 2 : Copier le contenu du dossier 'build' dans le répertoire par défaut de Caddy
COPY dist /usr/share/caddy

# Étape 3 : Copier le fichier Caddyfile dans le conteneur
COPY Caddyfile /etc/caddy/Caddyfile

# Étape 4 : Exposer le port 80 pour accéder à l'application
EXPOSE 80

# Caddy démarre automatiquement avec l'image de base, vous n'avez pas besoin de CMD



# Étape 1: Construire l'application React
# FROM node:16-alpine AS build

# # Définir le répertoire de travail
# WORKDIR /app

# # Copier les fichiers de configuration et installer les dépendances
# COPY package*.json ./
# RUN npm install

# # Copier le code source et construire l'application
# COPY . .
# RUN npm run build

# # Étape 2: Servir l'application construite avec Nginx
# FROM nginx:alpine

# # Copier les fichiers construits depuis l'étape précédente
# COPY --from=build /app/build /usr/share/nginx/html

# # Exposer le port 80 pour accéder à l'application
# EXPOSE 80

# # Commande pour démarrer Nginx
# CMD ["nginx", "-g", "daemon off;"]

# # Étape 1 : Utiliser l'image Nginx comme base
# FROM nginx:alpine

# # Étape 2 : Copier le contenu du dossier 'build' dans le répertoire par défaut de Nginx
# COPY dist /usr/share/nginx/html

# # Étape 3 : Exposer le port 80 pour accéder à l'application
# EXPOSE 80

# # Étape 4 : Démarrer Nginx
# CMD ["nginx", "-g", "daemon off;"]
