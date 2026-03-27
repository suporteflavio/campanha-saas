# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace manifest
COPY package*.json ./

# Copy backend source
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies
RUN npm ci --only=production && \
    npm run build --prefix backend

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Copy backend compiled files from builder
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package*.json ./backend/

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "backend/dist/main.js"]
