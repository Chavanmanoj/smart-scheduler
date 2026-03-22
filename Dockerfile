# ── Stage 1: Build React App ──
FROM node:18-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package files first (for faster caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the production app
RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine

# Copy built files from Stage 1 into nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Open port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]