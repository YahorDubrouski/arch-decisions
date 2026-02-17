#!/bin/sh
set -e

cd /app && npm install --no-audit --no-fund

# Execute the main command
exec "$@"
