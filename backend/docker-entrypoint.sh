#!/bin/sh
set -e

# Always ensure node_modules is properly installed
echo "⚠️  Installing/updating dependencies in bind mount..."
cd /app && npm install --no-audit --no-fund

# Execute the main command
# Workers share the API DB file — migrations run once on the API container.
# Example: SKIP_DB_MIGRATIONS=1 on worker → skip migrate; unset on API → run migrate.
if [ "${STORAGE_PROVIDER:-sqlite}" != "memory" ] && [ "${SKIP_DB_MIGRATIONS:-0}" != "1" ]; then
  echo "Running database migrations..."
  npm run migrate
fi

exec "$@"
