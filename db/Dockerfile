# Dockerfile pour PostgreSQL
FROM postgres:13

# Copie du fichier .dump et du script d'initialisation
COPY ./my_database.dump /docker-entrypoint-initdb.d/my_database.dump
COPY ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh

# Donner les permissions d'exécution au script
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh