#!/bin/sh
set -e

# API owns schema migrations; workers skip so two processes do not race Alembic.
# Example: API start → migrate then seed; worker start with SKIP_DB_MIGRATIONS=1 → skip.
if [ "${SKIP_DB_MIGRATIONS:-0}" != "1" ] && [ "${STORAGE_PROVIDER:-postgres}" != "memory" ]; then
  echo "Running Alembic migrations..."
  alembic upgrade head
fi

exec "$@"
