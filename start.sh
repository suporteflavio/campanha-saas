#!/bin/bash

# CampanhaOS - Railway Start Script
# Detecta se é backend ou frontend e executa o comando apropriado

if [ -f "/app/backend/dist/main.js" ]; then
  echo "Starting NestJS Backend..."
  cd /app/backend
  npm run start:prod
elif [ -f "/app/frontend/.next/server/pages/_app.js" ]; then
  echo "Starting Next.js Frontend..."
  cd /app/frontend
  npm start
else
  echo "Error: Could not determine which service to start"
  exit 1
fi
