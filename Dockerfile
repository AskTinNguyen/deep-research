FROM node:22-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Don't copy .env.local, use environment variables instead
ENV NODE_ENV=production

# Use non-root user for security
USER node

CMD ["npm", "run", "docker"]
