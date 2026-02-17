#!/bin/sh
set -e

# Always ensure node_modules is properly installed
echo "⚠️  Installing/updating dependencies in bind mount..."
cd /app && npm install --no-audit --no-fund

# Execute the main command
exec "$@"
