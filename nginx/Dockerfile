# Utiliser l'image officielle NGINX comme base
FROM nginx:latest

# Copier la configuration NGINX dans le conteneur
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copier les certificats Let's Encrypt (ils seront montés à l'exécution)
COPY ./certs /etc/nginx/certs

# Copier le contenu HTML ou les fichiers statiques (si nécessaire)
COPY ./html /usr/share/nginx/html

# Exposer les ports 80 et 443
EXPOSE 80 443

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
