# Production Dockerfile for Mall App Frontend Dashboard

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mall-frontend -u 1001

# Change ownership
RUN chown -R mall-frontend:nodejs /usr/share/nginx/html
RUN chown -R mall-frontend:nodejs /var/cache/nginx
RUN chown -R mall-frontend:nodejs /var/log/nginx
RUN chown -R mall-frontend:nodejs /etc/nginx/conf.d

# Create PID directory
RUN mkdir -p /var/run/nginx
RUN chown -R mall-frontend:nodejs /var/run/nginx

# Switch to non-root user
USER mall-frontend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]