#!/bin/bash
# Script pour charger le fichier .dump dans PostgreSQL et exécuter des commandes SQL supplémentaires

# Attendre que PostgreSQL soit prêt avec un délai d'attente augmenté
# echo "Waiting for PostgreSQL to start..."
# for i in {1..30}; do
#   if pg_isready -h localhost -p 5432 -U "$POSTGRES_USER" > /dev/null 2>&1; then
#     echo "PostgreSQL is ready!"
#     break
#   fi
#   echo "PostgreSQL is not ready yet. Sleeping..."
#   sleep 5
# done

# Charger le fichier .dump
echo "Restoring the database from my_database.dump..."
pg_restore --no-owner --no-acl --clean --if-exists -U "$POSTGRES_USER" -d "$POSTGRES_DB" /docker-entrypoint-initdb.d/my_database.dump
echo "Database restored successfully!"

# Exécuter les commandes SQL supplémentaires
echo "Executing additional SQL commands..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<EOF
ALTER TABLE timesheet_signature
ADD COLUMN is_absent BOOLEAN DEFAULT FALSE;

UPDATE timesheet_signature
SET is_absent = FALSE;
EOF

echo "Additional SQL commands executed successfully!"
