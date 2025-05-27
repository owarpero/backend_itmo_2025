# docker-entrypoint-initdb.d/init-multiple-dbs.sh
#!/usr/bin/env bash
set -eo pipefail

# Не падаем, если переменная не задана
: "${POSTGRES_MULTIPLE_DATABASES:=}"
IFS=',' read -ra DBS <<< "$POSTGRES_MULTIPLE_DATABASES"

for db in "${DBS[@]}"; do
  if [[ -n "$db" ]]; then
    echo "=> Create user+db '$db'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
      CREATE USER $db WITH PASSWORD '$POSTGRES_PASSWORD';
      CREATE DATABASE $db OWNER $db;
      GRANT ALL PRIVILEGES ON DATABASE $db TO $db;
EOSQL
  fi
done
