# Multi-stage Dockerfile for BankApp Backend

# Build stage for frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY TestAiApp/package*.json ./
COPY TestAiApp/vite.config.js ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source
COPY TestAiApp/src ./src
COPY TestAiApp/public ./public
COPY TestAiApp/index.html ./

# Build frontend for production
RUN npm run build

# Production stage
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY TestAiApp/package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy backend server code
COPY TestAiApp/server ./server

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server/index.cjs"]
